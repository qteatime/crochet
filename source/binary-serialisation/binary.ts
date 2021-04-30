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
  }

  uint16(x: number) {
    if (!Number.isInteger(x) || x < 0 || x >= 2 ** 16) {
      throw new Error(`internal: Invalid uint16 ${x}`);
    }

    const buffer = Buffer.alloc(2);
    buffer.writeUInt16LE(x);
    this.target.write(buffer);
  }

  uint32(x: number) {
    if (!Number.isInteger(x) || x < 0 || x >= 2 ** 32) {
      throw new Error(`internal: Invalid uint32 ${x}`);
    }

    const buffer = Buffer.alloc(4);
    buffer.writeUInt32LE(x);
    this.target.write(buffer);
  }

  boolean(x: boolean) {
    this.uint8(x ? 1 : 0);
  }

  maybe<A>(x: A | null, f: (_: A) => void) {
    if (x == null) {
      this.boolean(false);
    } else {
      this.boolean(true);
      f(x);
    }
  }

  array<A>(xs: A[], f: (_: A) => void) {
    this.uint32(xs.length);
    for (const x of xs) {
      f(x);
    }
  }

  map<K, V>(map: Map<K, V>, f: (k: K, v: V) => void) {
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
  }

  bigint(x: bigint) {
    let bytes = x.toString(16);
    if (bytes.length % 2 != 0) bytes = "0" + bytes;
    const buffer = new Uint8Array(bytes.length / 2);
    for (let i = 0; i < buffer.length; ++i) {
      buffer[i] = parseInt(bytes.substr(i, 2), 16);
    }
    this.target.write(Buffer.from(bytes));
  }

  double(x: number) {
    const buffer = Buffer.alloc(8);
    buffer.writeDoubleLE(x);
    this.target.write(buffer);
  }

  text(x: string) {
    const buffer = Buffer.from(x, "utf-8");
    this.target.write(buffer);
  }

  string(x: string) {
    const buffer = Buffer.from(x, "utf-8");
    this.bytes(buffer);
  }

  bytes(x: Buffer) {
    this.uint32(x.length);
    this.target.write(x);
  }
}

export class BinaryReader {
  private offset: uint32 = 0;

  constructor(readonly source: Buffer) {}

  uint8(): number {
    const result = this.source.readUInt8(this.offset);
    this.offset += 1;
    return result;
  }

  uint16(): number {
    const result = this.source.readUInt16LE(this.offset);
    this.offset += 2;
    return result;
  }

  uint32(): number {
    const result = this.source.readUInt32LE(this.offset);
    this.offset += 4;
    return result;
  }

  uint64(): number {
    const result = this.source.readBigUInt64LE(this.offset);
    this.offset += 8;
    return Number(result);
  }

  bigint(): bigint {
    const bytes = this.bytes();
    return BigInt(`0x${bytes.toString("hex")}`);
  }

  boolean(): boolean {
    const result = this.uint8();
    if (result === 0) {
      return false;
    } else if (result === 1) {
      return true;
    } else {
      throw new Error(`Invalid boolean ${result}`);
    }
  }

  maybe<A>(f: () => A): A | null {
    if (this.boolean()) {
      return f();
    } else {
      return null;
    }
  }

  array<A>(f: (index: number) => A): A[] {
    const length = this.uint32();
    const result = [];
    for (let i = 0; i < length; ++i) {
      result.push(f(i));
    }
    return result;
  }

  map<K, V>(f: (index: number) => [K, V]): Map<K, V> {
    const length = this.uint32();
    const result = new Map<K, V>();
    for (let i = 0; i < length; ++i) {
      const [k, v] = f(i);
      result.set(k, v);
    }
    return result;
  }

  double(): number {
    const result = this.source.readDoubleLE(this.offset);
    this.offset += 8;
    return result;
  }

  bytes_with_size(size: number): Buffer {
    const result = this.source.slice(this.offset, this.offset + size);
    this.offset += size;
    return result;
  }

  bytes(): Buffer {
    const length = this.uint32();
    return this.bytes_with_size(length);
  }

  text(x: string) {
    const byteLength = Buffer.from(x, "utf-8").length;
    const result = this.bytes_with_size(byteLength).toString("utf-8");
    if (result !== x) {
      throw new Error(`Expected ${x}, got ${result}`);
    }
    return result;
  }

  string(): string {
    const bytes = this.bytes();
    return bytes.toString("utf-8");
  }
}
