import { inspect } from "util";
import { logger } from "../utils";

type uint32 = number;

export interface Writer {
  write(chunk: Buffer): void;
}

export class BufferedWriter implements Writer {
  private chunks: Buffer[] = [];

  write(chunk: Buffer) {
    this.chunks.push(chunk);
  }

  collect() {
    return Buffer.concat(this.chunks);
  }
}

export class BinaryWriter {
  constructor(readonly target: Writer) {}

  uint8(x: number) {
    if (!Number.isInteger(x) || x < 0 || x > 255) {
      throw new Error(`internal: Invalid uint8 ${x}`);
    }

    const buffer = Buffer.alloc(1);
    buffer.writeUInt8(x);
    this.target.write(buffer);
    logger.debug(`Wrote uint8 ${x}`);
  }

  uint16(x: number) {
    if (!Number.isInteger(x) || x < 0 || x >= 2 ** 16) {
      throw new Error(`internal: Invalid uint16 ${x}`);
    }

    const buffer = Buffer.alloc(2);
    buffer.writeUInt16LE(x);
    this.target.write(buffer);
    logger.debug(`Wrote uint16 ${x}`);
  }

  uint32(x: number) {
    if (!Number.isInteger(x) || x < 0 || x >= 2 ** 32) {
      throw new Error(`internal: Invalid uint32 ${x}`);
    }

    const buffer = Buffer.alloc(4);
    buffer.writeUInt32LE(x);
    this.target.write(buffer);
    logger.debug(`Wrote uint32 ${x}`);
  }

  boolean(x: boolean) {
    logger.debug(`Writing boolean ${x}`);
    this.uint8(x ? 1 : 0);
  }

  maybe<A>(x: A | null, f: (_: A) => void) {
    logger.debug(`Writing maybe ${inspect(x)}`);
    if (x == null) {
      this.boolean(false);
    } else {
      this.boolean(true);
      f(x);
    }
  }

  array<A>(xs: A[], f: (_: A) => void) {
    logger.debug(`Writing array of length ${xs.length} - ${inspect(xs)}`);
    this.uint32(xs.length);
    for (const x of xs) {
      f(x);
    }
  }

  map<K, V>(map: Map<K, V>, f: (k: K, v: V) => void) {
    logger.debug(`Writing map of length ${map.size} - ${inspect(map)}`);
    this.uint32(map.size);
    for (const [k, v] of map.entries()) {
      f(k, v);
    }
  }

  uint64(x: number) {
    if (!Number.isInteger(x)) {
      throw new Error(`internal: Invalid integer ${x}`);
    }

    const buffer = Buffer.alloc(8);
    buffer.writeBigInt64LE(BigInt(x));
    this.target.write(buffer);
    logger.debug(`Wrote int64 ${x}`);
  }

  bigint(x: bigint) {
    logger.debug(`Writing bigint ${x}`);
    let bytes = (x < 0 ? -x : x).toString(16);
    if (bytes.length % 2 != 0) bytes = "0" + bytes;
    const buffer = new Uint8Array(bytes.length / 2);
    for (let i = 0; i < buffer.length; ++i) {
      buffer[i] = parseInt(bytes.substr(i * 2, 2), 16);
    }
    logger.debug(`Bytes are ${inspect(buffer)}`);
    this.boolean(x < 0);
    this.bytes(Buffer.from(buffer));
  }

  double(x: number) {
    const buffer = Buffer.alloc(8);
    buffer.writeDoubleLE(x);
    this.target.write(buffer);
    logger.debug(`Wrote double ${x}`);
  }

  text(x: string) {
    const buffer = Buffer.from(x, "utf-8");
    this.target.write(buffer);
    logger.debug(`Wrote text ${x}`);
  }

  string(x: string) {
    logger.debug(`Writing string ${x}`);
    const buffer = Buffer.from(x, "utf-8");
    this.bytes(buffer);
  }

  bytes(x: Buffer) {
    this.uint32(x.length);
    this.target.write(x);
    logger.debug(`Wrote bytes ${x.toString("hex")}`);
  }
}

export class BinaryReader {
  public offset: uint32 = 0;

  constructor(readonly source: Buffer) {}

  uint8(): number {
    const result = this.source.readUInt8(this.offset);
    logger.debug(`Read uint8 ${result} at ${this.offset.toString(16)}`);
    this.offset += 1;
    return result;
  }

  uint16(): number {
    const result = this.source.readUInt16LE(this.offset);
    logger.debug(`Read uint16 ${result} at ${this.offset.toString(16)}`);
    this.offset += 2;
    return result;
  }

  uint32(): number {
    const result = this.source.readUInt32LE(this.offset);
    logger.debug(`Read uint32 ${result} at ${this.offset.toString(16)}`);
    this.offset += 4;
    return result;
  }

  uint64(): number {
    const result = this.source.readBigUInt64LE(this.offset);
    logger.debug(`Read uint64 ${result} at ${this.offset.toString(16)}`);
    this.offset += 8;
    return Number(result);
  }

  bigint(): bigint {
    logger.debug(`Reading bigint at ${this.offset.toString(16)}`);
    const negative = this.boolean();
    const bytes = this.bytes();
    const result = BigInt(`0x${bytes.toString("hex")}`);
    logger.debug(
      `Read bigint ${result} at ${this.offset.toString(
        16
      )}. Bytes are ${inspect(bytes)}`
    );
    return negative ? -result : result;
  }

  boolean(): boolean {
    const result = this.uint8();
    if (result === 0) {
      logger.debug(`Read boolean true at ${this.offset.toString(16)}`);
      return false;
    } else if (result === 1) {
      logger.debug(`Read boolean false at ${this.offset.toString(16)}`);
      return true;
    } else {
      throw new Error(`Invalid boolean ${result} at position ${this.offset}`);
    }
  }

  maybe<A>(f: () => A): A | null {
    logger.debug(`Reading maybe at ${this.offset.toString(16)}`);
    if (this.boolean()) {
      return f();
    } else {
      return null;
    }
  }

  array<A>(f: (index: number) => A): A[] {
    logger.debug(`Reading array at ${this.offset.toString(16)}`);
    const length = this.uint32();
    const result = [];
    for (let i = 0; i < length; ++i) {
      const item = f(i);
      logger.debug(
        `Read array item ${inspect(item)} at ${this.offset.toString(16)}`
      );
      result.push(item);
    }
    logger.debug(
      `Read array ${inspect(result)} at ${this.offset.toString(16)}`
    );
    return result;
  }

  map<K, V>(f: (index: number) => [K, V]): Map<K, V> {
    logger.debug(`Reading map at ${this.offset.toString(16)}`);
    const length = this.uint32();
    const result = new Map<K, V>();
    for (let i = 0; i < length; ++i) {
      const [k, v] = f(i);
      logger.debug(
        `Read map pair ${inspect(k)}=${inspect(v)} at ${this.offset.toString(
          16
        )}`
      );
      result.set(k, v);
    }
    logger.debug(`Read map ${inspect(result)} at ${this.offset.toString(16)}`);
    return result;
  }

  double(): number {
    const result = this.source.readDoubleLE(this.offset);
    logger.debug(`Read double ${result} at ${this.offset.toString(16)}`);
    this.offset += 8;
    return result;
  }

  bytes_with_size(size: number): Buffer {
    const result = this.source.slice(this.offset, this.offset + size);
    logger.debug(
      `Read bytes ${result.toString("hex")} at ${this.offset.toString(16)}`
    );
    this.offset += size;
    return result;
  }

  bytes(): Buffer {
    const length = this.uint32();
    return this.bytes_with_size(length);
  }

  text(x: string) {
    logger.debug(`Reading text at ${this.offset.toString(16)}`);
    const byteLength = Buffer.from(x, "utf-8").length;
    const result = this.bytes_with_size(byteLength).toString("utf-8");
    logger.debug(`Read text ${result} at ${this.offset.toString(16)}`);
    if (result !== x) {
      throw new Error(
        `Expected ${x}, got ${result} at position ${this.offset}`
      );
    }
    return result;
  }

  string(): string {
    logger.debug(`Reading string at ${this.offset.toString(16)}`);
    const bytes = this.bytes();
    const result = bytes.toString("utf-8");
    logger.debug(`Read string ${result} at ${this.offset.toString(16)}`);
    return result;
  }
}
