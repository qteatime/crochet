interface Writer {
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
    const buffer = Buffer.alloc(1);
    buffer.writeUInt8(x);
    this.target.write(buffer);
  }

  uint16(x: number) {
    const buffer = Buffer.alloc(2);
    buffer.writeUInt16LE(x);
    this.target.write(buffer);
  }

  uint32(x: number) {
    const buffer = Buffer.alloc(4);
    buffer.writeUInt32LE(x);
    this.target.write(buffer);
  }

  uint64(x: number) {
    const buffer = Buffer.alloc(8);
    buffer.writeBigUInt64LE(BigInt(x));
    this.target.write(buffer);
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
    this.uint64(x.length);
    this.target.write(x);
  }
}

export abstract class BinSpec {}

export class BinUInt32 extends BinSpec {
  constructor(readonly value: number) {
    super();
  }

  encode(buffer: Buffer) {}
}

export class BinDouble extends BinSpec {}
