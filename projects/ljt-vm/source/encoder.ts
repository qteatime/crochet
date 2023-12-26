/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Op } from "./ast";
import { Record, Schema, Union } from "./schema";
import { byte_equals, bytes_to_hex, unreachable } from "./util";

export type Int8 = number;
export type Int16 = number;
export type Int32 = number;
export type UInt8 = number;
export type UInt16 = number;
export type UInt32 = number;
export type Float32 = number;
export type Float64 = number;

const MAX_UINT8 = 2 ** 8;
const MAX_UINT16 = 2 ** 16;
const MAX_UINT32 = 2 ** 32;
const MIN_INT8 = -(MAX_UINT8 / 2);
const MAX_INT8 = MAX_UINT8 / 2 - 1;
const MIN_INT16 = -(MAX_UINT16 / 2);
const MAX_INT16 = MAX_UINT16 / 2 - 1;
const MIN_INT32 = -(MAX_UINT32 / 2);
const MAX_INT32 = MAX_UINT32 / 2 - 1;

export class Encoder {
  private buffers: Uint8Array[] = [];

  bool(x: boolean) {
    this.buffers.push(new Uint8Array([x ? 0x01 : 0x00]));
    return this;
  }

  int8(x: Int8) {
    if (x < MIN_INT8 || x > MAX_INT8) {
      throw new RangeError(`Invalid int8 value: ${x}`);
    }
    const a = new Uint8Array(1);
    const v = new DataView(a.buffer);
    v.setInt8(0, x);
    this.buffers.push(a);
    return this;
  }

  int16(x: Int16) {
    if (x < MIN_INT16 || x > MAX_INT16) {
      throw new RangeError(`Invalid int16 value: ${x}`);
    }

    const a = new Uint8Array(2);
    const v = new DataView(a.buffer);
    v.setInt16(0, x, true);
    this.buffers.push(a);
    return this;
  }

  int32(x: Int32) {
    if (x < MIN_INT32 || x > MAX_INT32) {
      throw new RangeError(`Invalid int32 value: ${x}`);
    }

    const a = new Uint8Array(4);
    const v = new DataView(a.buffer);
    v.setInt32(0, x, true);
    this.buffers.push(a);
    return this;
  }

  uint8(x: UInt8) {
    if (x < 0 || x >= MAX_UINT8) {
      throw new RangeError(`Invalid uint8 value: ${x}`);
    }

    const a = new Uint8Array(1);
    const v = new DataView(a.buffer);
    v.setUint8(0, x);
    this.buffers.push(a);
    return this;
  }

  uint16(x: UInt16) {
    if (x < 0 || x >= MAX_UINT16) {
      throw new RangeError(`Invalid uint16 value: ${x}`);
    }

    const a = new Uint8Array(2);
    const v = new DataView(a.buffer);
    v.setUint16(0, x, true);
    this.buffers.push(a);
    return this;
  }

  uint32(x: UInt32) {
    if (x < 0 || x >= MAX_UINT32) {
      throw new RangeError(`Invalid uint32 value: ${x}`);
    }

    const a = new Uint8Array(4);
    const v = new DataView(a.buffer);
    v.setUint32(0, x, true);
    this.buffers.push(a);
    return this;
  }

  float32(x: Float32) {
    const a = new Uint8Array(4);
    const v = new DataView(a.buffer);
    v.setFloat32(0, x, true);
    this.buffers.push(a);
    return this;
  }

  float64(x: Float64) {
    const a = new Uint8Array(8);
    const v = new DataView(a.buffer);
    v.setFloat64(0, x, true);
    this.buffers.push(a);
    return this;
  }

  bigint(x: bigint) {
    let bytes = (x < 0 ? -x : x).toString(16);
    if (bytes.length % 2 != 0) bytes = "0" + bytes;
    const size = bytes.length / 2;

    const header_size = 5;
    const buffer = new Uint8Array(size + header_size);
    const bufferv = new DataView(buffer.buffer);
    bufferv.setUint8(0, x < 0 ? 0x01 : 0x00);
    bufferv.setUint32(1, size, true);

    for (let i = 0; i < size; ++i) {
      const byte_offset = i * 2;
      bufferv.setUint8(
        header_size + i,
        parseInt(bytes.substring(byte_offset, byte_offset + 2), 16)
      );
    }

    this.buffers.push(buffer);
    return this;
  }

  text(x: string) {
    const encoder = new TextEncoder();
    let encoded_text = encoder.encode(x);
    const header_size = 4;
    const result = new Uint8Array(encoded_text.length + header_size);
    const resultv = new DataView(result.buffer);
    resultv.setUint32(0, encoded_text.length, true);
    result.set(encoded_text, header_size);
    this.buffers.push(result);
    return this;
  }

  bytes(x: Uint8Array) {
    const result = new Uint8Array(x.length + 4);
    const view = new DataView(result.buffer);
    view.setUint32(0, x.length, true);
    result.set(x, 4);
    this.buffers.push(result);
    return this;
  }

  raw_bytes(x: Uint8Array) {
    this.buffers.push(x);
    return this;
  }

  array<A>(xs: A[], f: (_: Encoder, x: A) => void) {
    this.uint32(xs.length);
    for (const x of xs) {
      f(this, x);
    }
    return this;
  }

  map<K, V>(
    x: Map<K, V>,
    fk: (_: Encoder, k: K) => void,
    fv: (_: Encoder, v: V) => void
  ) {
    this.uint32(x.size);
    for (const [k, v] of x.entries()) {
      fk(this, k);
      fv(this, v);
    }
    return this;
  }

  optional<A>(x: A | null, f: (_: Encoder, v: A) => void) {
    if (x == null) {
      this.bool(false);
    } else {
      this.bool(true);
      f(this, x);
    }
    return this;
  }

  to_bytes() {
    const size = this.buffers.reduce((a, b) => a + b.byteLength, 0);
    const result = new Uint8Array(size);
    let offset = 0;
    for (let i = 0; i < this.buffers.length; ++i) {
      result.set(this.buffers[i], offset);
      offset += this.buffers[i].byteLength;
    }
    return result;
  }
}

export function magic_size(schema: Schema) {
  return schema.magic.length + 4; // magic + version
}

export function encode(value: unknown, schema: Schema, root: number) {
  const encoder = new Encoder();
  encoder.raw_bytes(schema.magic);
  encoder.uint32(schema.version);
  return do_encode(
    value,
    { op: "record", id: root },
    encoder,
    schema
  ).to_bytes();
}

export function encode_magicless(value: unknown, schema: Schema, root: number) {
  const encoder = new Encoder();
  return do_encode(
    value,
    { op: "record", id: root },
    encoder,
    schema
  ).to_bytes();
}

function do_encode(
  value: unknown,
  op: Op,
  encoder: Encoder,
  schema: Schema
): Encoder {
  switch (op.op) {
    case "bool": {
      if (typeof value !== "boolean") {
        throw new Error(`Expected boolean, got ${typeof value}`);
      }
      return encoder.bool(value);
    }

    case "int8": {
      if (typeof value !== "number") {
        throw new Error(`Expected number, got ${typeof value}`);
      }
      return encoder.int8(value);
    }

    case "int16": {
      if (typeof value !== "number") {
        throw new Error(`Expected number, got ${typeof value}`);
      }
      return encoder.int16(value);
    }

    case "int32": {
      if (typeof value !== "number") {
        throw new Error(`Expected number, got ${typeof value}`);
      }
      return encoder.int32(value);
    }

    case "uint8": {
      if (typeof value !== "number") {
        throw new Error(`Expected number, got ${typeof value}`);
      }
      return encoder.uint8(value);
    }

    case "uint16": {
      if (typeof value !== "number") {
        throw new Error(`Expected number, got ${typeof value}`);
      }
      return encoder.uint16(value);
    }

    case "uint32": {
      if (typeof value !== "number") {
        throw new Error(`Expected number, got ${typeof value}`);
      }
      return encoder.uint32(value);
    }

    case "integer": {
      if (typeof value !== "bigint") {
        throw new Error(`Expected bigint, got ${typeof value}`);
      }
      return encoder.bigint(value);
    }

    case "float32": {
      if (typeof value !== "number") {
        throw new Error(`Expected number, got ${typeof value}`);
      }
      return encoder.float32(value);
    }

    case "float64": {
      if (typeof value !== "number") {
        throw new Error(`Expected number, got ${typeof value}`);
      }
      return encoder.float64(value);
    }

    case "text": {
      if (typeof value !== "string") {
        throw new Error(`Expected string, got ${typeof value}`);
      }
      return encoder.text(value);
    }

    case "bytes": {
      if (!(value instanceof Uint8Array)) {
        throw new Error(`Expected Uint8Array`);
      }
      return encoder.bytes(value);
    }

    case "constant": {
      if (!(value instanceof Uint8Array)) {
        throw new Error(`Expected Uint8Array`);
      }
      if (!byte_equals(value, op.value)) {
        throw new Error(`Unexpected constant: ${bytes_to_hex(value)}`);
      }
      return encoder.raw_bytes(op.value);
    }

    case "array": {
      if (!Array.isArray(value)) {
        throw new Error(`Expected array`);
      }
      return encoder.array(value, (encoder, x) => {
        do_encode(x, op.items, encoder, schema);
      });
    }

    case "map": {
      if (!(value instanceof Map)) {
        throw new Error(`Expected map`);
      }
      return encoder.map(
        value,
        (encoder, key) => {
          do_encode(key, op.keys, encoder, schema);
        },
        (encoder, value) => {
          do_encode(value, op.values, encoder, schema);
        }
      );
    }

    case "optional": {
      return encoder.optional(value, (encoder, value) => {
        do_encode(value, op.value, encoder, schema);
      });
    }

    case "record": {
      if (value == null || typeof value !== "object") {
        throw new Error(`Expected record`);
      }
      const record = schema.resolve(op.id);
      if (!(record instanceof Record)) {
        throw new Error(`Expected record, got union`);
      }
      const version = record.find_version(value as any);
      encoder.uint32(version.id);
      encoder.uint32(version.version);
      for (const [field, op] of version.fields) {
        do_encode((value as any)[field], op, encoder, schema);
      }
      return encoder;
    }

    case "union": {
      if (
        value == null ||
        typeof value !== "object" ||
        typeof (value as any)["@variant"] !== "number"
      ) {
        throw new Error(`Expected union`);
      }
      const union = schema.resolve(op.id);
      if (!(union instanceof Union)) {
        throw new Error(`Expected union, got record`);
      }
      const version = union.find_version(value as any);
      const variant_tag = (value as any)["@variant"];
      const variant = version.variant(variant_tag);

      encoder.uint32(version.id);
      encoder.uint32(version.version);
      encoder.uint32(variant.tag);

      for (const [field, op] of variant.fields) {
        do_encode((value as any)[field], op, encoder, schema);
      }

      return encoder;
    }

    default:
      throw unreachable(op, "LJT Op");
  }
}
