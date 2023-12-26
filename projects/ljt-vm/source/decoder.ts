/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Op } from "./ast";
import { Record, Schema, Union } from "./schema";
import { byte_equals, bytes_to_hex, unreachable } from "./util";

export class Decoder {
  private offset: number = 0;

  constructor(readonly view: DataView) {}

  static from_bytes(bytes: Uint8Array) {
    return new Decoder(new DataView(bytes.buffer));
  }

  seek(offset: number) {
    this.offset = offset;
    return this;
  }

  slice(offset: number, size: number) {
    const bytes = new Uint8Array(this.view.buffer).slice(offset, offset + size);
    return Decoder.from_bytes(bytes);
  }

  get current_offset() {
    return this.view.byteOffset + this.offset;
  }

  get remaining_bytes() {
    return this.view.byteLength - (this.view.byteOffset + this.offset);
  }

  clone() {
    return new Decoder(this.view).seek(this.offset);
  }

  peek<A>(f: (transient_decoder: Decoder) => A) {
    return f(this.clone());
  }

  fail(code: string, reason: string) {
    throw new Error(`(${code}): decoding failed at 0x${this.offset.toString(16)}: ${reason}`);
  }

  int8() {
    const value = this.view.getInt8(this.offset);
    this.offset += 1;
    return value;
  }

  int16() {
    const value = this.view.getInt16(this.offset, true);
    this.offset += 2;
    return value;
  }

  int32() {
    const value = this.view.getInt32(this.offset, true);
    this.offset += 4;
    return value;
  }

  int64() {
    const value = this.view.getBigInt64(this.offset, true);
    this.offset += 8;
    return value;
  }

  uint8() {
    const value = this.view.getUint8(this.offset);
    this.offset += 1;
    return value;
  }

  uint16() {
    const value = this.view.getUint16(this.offset, true);
    this.offset += 2;
    return value;
  }

  uint32() {
    const value = this.view.getUint32(this.offset, true);
    this.offset += 4;
    return value;
  }

  uint64() {
    const value = this.view.getBigUint64(this.offset, true);
    this.offset += 8;
    return value;
  }

  float32() {
    const value = this.view.getFloat32(this.offset, true);
    this.offset += 4;
    return value;
  }

  float64() {
    const value = this.view.getFloat64(this.offset, true);
    this.offset += 8;
    return value;
  }

  bool() {
    return this.uint8() > 0;
  }

  bigint() {
    const negative = this.bool();
    const size = this.uint32();
    const buffer = [];
    for (let i = 0; i < size; ++i) {
      buffer[i] = this.uint8().toString(16).padStart(2, "0");
    }
    const result = BigInt(`0x${buffer.join("")}`);
    return negative ? -result : result;
  }

  text() {
    const size = this.uint32();
    const decoder = new TextDecoder("utf-8");
    const text_view = new DataView(this.view.buffer, this.offset, size);
    const result = decoder.decode(text_view);
    this.offset += size;
    return result;
  }

  bytes() {
    const size = this.uint32();
    return this.raw_bytes(size);
  }

  raw_bytes(size: number) {
    if (size > this.remaining_bytes) {
      throw this.fail("invalid-size", `Size out of bounds: ${size}`);
    }
    const result = new Uint8Array(size);
    for (let i = 0; i < result.length; ++i) {
      result[i] = this.view.getUint8(this.offset + i);
    }
    this.offset += size;
    return result;
  }

  array<T>(f: () => T): T[] {
    const size = this.uint32();
    const result = [];
    for (let i = 0; i < size; ++i) {
      result[i] = f();
    }
    return result;
  }

  map<K, V>(k: () => K, v: () => V): Map<K, V> {
    const size = this.uint32();
    const result: Map<K, V> = new Map();
    for (let i = 0; i < size; ++i) {
      const key = k();
      const value = v();
      result.set(key, value);
    }
    return result;
  }

  optional<T>(f: () => T): T | null {
    const has_value = this.bool();
    if (has_value) {
      return f();
    } else {
      return null;
    }
  }
}

export class SchemaDecoder {
  private constructor(private schema: Schema, readonly decoder: Decoder) {}

  static from_bytes(bytes: Uint8Array, schema: Schema) {
    return new SchemaDecoder(schema, Decoder.from_bytes(bytes));
  }

  clone() {
    return new SchemaDecoder(this.schema, this.decoder.clone());
  }

  seek(offset: number) {
    return new SchemaDecoder(this.schema, this.decoder.seek(offset));
  }

  slice(offset: number, size: number) {
    return new SchemaDecoder(this.schema, this.decoder.slice(offset, size));
  }

  assert_magic() {
    const magic = this.decoder.raw_bytes(this.schema.magic.length);
    if (!byte_equals(magic, this.schema.magic)) {
      throw new Error(`Invalid schema magic header: ${bytes_to_hex(magic)}`);
    }
    const version = this.decoder.uint32();
    if (version > this.schema.version) {
      throw new Error(
        `Encoded version (${version}) is higher than the schema version (${this.schema.version}). Decoding is not possible.`
      );
    }
    return this;
  }

  record(root: number) {
    const tag = this.decoder.peek((d) => d.uint32());
    if (tag !== root) {
      throw new Error(`Unexpected record ${tag}`);
    }
    return do_decode({ op: "record", id: tag }, this.decoder, this.schema);
  }
}

export function decode(bytes: Uint8Array, schema: Schema, root: number) {
  const decoder = SchemaDecoder.from_bytes(bytes, schema);
  decoder.assert_magic();
  return decoder.record(root);
}

function do_decode(op: Op, decoder: Decoder, schema: Schema): unknown {
  switch (op.op) {
    case "bool":
      return decoder.bool();

    case "int8":
      return decoder.int8();

    case "int16":
      return decoder.int16();

    case "int32":
      return decoder.int32();

    case "int64":
      return decoder.int64();

    case "uint8":
      return decoder.uint8();

    case "uint16":
      return decoder.uint16();

    case "uint32":
      return decoder.uint32();

    case "uint64":
      return decoder.uint64();

    case "integer":
      return decoder.bigint();

    case "float32":
      return decoder.float32();

    case "float64":
      return decoder.float64();

    case "text":
      return decoder.text();

    case "bytes":
      return decoder.bytes();

    case "constant": {
      const value = decoder.raw_bytes(op.value.length);
      if (!byte_equals(value, op.value)) {
        throw decoder.fail(
          "constant-mismatch",
          `Expected byte constant: ${bytes_to_hex(op.value)}`
        );
      }
      return value;
    }

    case "array": {
      return decoder.array(() => {
        return do_decode(op.items, decoder, schema);
      });
    }

    case "map": {
      return decoder.map(
        () => {
          return do_decode(op.keys, decoder, schema);
        },
        () => {
          return do_decode(op.values, decoder, schema);
        }
      );
    }

    case "optional": {
      return decoder.optional(() => {
        return do_decode(op.value, decoder, schema);
      });
    }

    case "record": {
      const tag = decoder.uint32();
      if (tag !== op.id) {
        throw decoder.fail("tag-mismatch", `Expected tag: ${op.id}`);
      }
      const record = schema.resolve(op.id);
      if (!(record instanceof Record)) {
        throw decoder.fail("entity-mismatch", `Expected record, got union: ${op.id}`);
      }
      const version_tag = decoder.uint32();
      const version = record.version(version_tag);

      const result = Object.create(null);
      for (const [field, extractor] of version.fields) {
        result[field] = do_decode(extractor, decoder, schema);
      }

      return version.reify(result);
    }

    case "union": {
      const tag = decoder.uint32();
      if (tag !== op.id) {
        throw decoder.fail("tag-mismatch", `Expected tag: ${op.id}`);
      }
      const union = schema.resolve(op.id);
      if (!(union instanceof Union)) {
        throw decoder.fail("entity-mismatch", `Expected union, got record: ${op.id}`);
      }
      const version_tag = decoder.uint32();
      const version = union.version(version_tag);

      const variant_tag = decoder.uint32();
      const variant = version.variant(variant_tag);

      const result = Object.create(null);
      for (const [field, extractor] of variant.fields) {
        result[field] = do_decode(extractor, decoder, schema);
      }

      variant.reify(result);
      version.reify(result);

      return result;
    }

    default:
      throw unreachable(op, `LJT Op`);
  }
}
