interface _DecoderMethod {
  decode(decoder: _Decoder): any;
}

interface _EncodeMethod {
  encode(encoder: _Encoder): void;
}

export class _Decoder {
  private offset: number = 0;

  constructor(readonly view: DataView) {}

  peek<A>(f: (view: DataView) => A) {
    return f(
      new DataView(this.view.buffer, this.view.byteOffset + this.offset)
    );
  }

  bool() {
    return this.ui8() > 0;
  }

  i8() {
    const value = this.view.getInt8(this.offset);
    this.offset += 1;
    return value;
  }

  i16() {
    const value = this.view.getInt16(this.offset, true);
    this.offset += 2;
    return value;
  }

  i32() {
    const value = this.view.getInt32(this.offset, true);
    this.offset += 4;
    return value;
  }

  ui8() {
    const value = this.view.getUint8(this.offset);
    this.offset += 1;
    return value;
  }

  ui16() {
    const value = this.view.getUint16(this.offset, true);
    this.offset += 2;
    return value;
  }

  ui32() {
    const value = this.view.getUint32(this.offset, true);
    this.offset += 4;
    return value;
  }

  f32() {
    const value = this.view.getFloat32(this.offset, true);
    this.offset += 4;
    return value;
  }

  f64() {
    const value = this.view.getFloat64(this.offset, true);
    this.offset += 8;
    return value;
  }

  bigint() {
    const negative = this.bool();
    const size = this.ui32();
    const buffer = [];
    for (let i = 0; i < size; ++i) {
      buffer[i] = this.ui8().toString(16).padStart(2, "0");
    }
    const result = BigInt(`0x${buffer.join("")}`);
    return negative ? -result : result;
  }

  text() {
    const size = this.ui32();
    const decoder = new TextDecoder("utf-8");
    const text_view = new DataView(this.view.buffer, this.offset, size);
    const result = decoder.decode(text_view);
    this.offset += size;
    return result;
  }

  bytes() {
    const size = this.ui32();
    const result = [];
    for (let i = 0; i < size; ++i) {
      result[i] = this.view.getUint8(this.offset + i);
    }
    this.offset += size;
    return new Uint8Array(result);
  }

  array<T>(f: () => T): T[] {
    const size = this.ui32();
    const result = [];
    for (let i = 0; i < size; ++i) {
      result[i] = f();
    }
    return result;
  }

  map<K, V>(k: () => K, v: () => V): Map<K, V> {
    const size = this.ui32();
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

  decode(method: _DecoderMethod) {
    method.decode(this);
  }
}

export class _Encoder {
  private buffers: Uint8Array[] = [];

  bool(x: boolean) {
    this.buffers.push(new Uint8Array([x ? 0x01 : 0x00]));
    return this;
  }

  i8(x: Int8) {
    const a = new Uint8Array(1);
    const v = new DataView(a.buffer);
    v.setInt8(0, x);
    this.buffers.push(a);
    return this;
  }

  i16(x: Int8) {
    const a = new Uint8Array(2);
    const v = new DataView(a.buffer);
    v.setInt16(0, x, true);
    this.buffers.push(a);
    return this;
  }

  i32(x: Int8) {
    const a = new Uint8Array(4);
    const v = new DataView(a.buffer);
    v.setInt32(0, x, true);
    this.buffers.push(a);
    return this;
  }

  ui8(x: UInt8) {
    const a = new Uint8Array(1);
    const v = new DataView(a.buffer);
    v.setUint8(0, x);
    this.buffers.push(a);
    return this;
  }

  ui16(x: Int8) {
    const a = new Uint8Array(2);
    const v = new DataView(a.buffer);
    v.setUint16(0, x, true);
    this.buffers.push(a);
    return this;
  }

  ui32(x: Int8) {
    const a = new Uint8Array(4);
    const v = new DataView(a.buffer);
    v.setUint32(0, x, true);
    this.buffers.push(a);
    return this;
  }

  float32(x: Int8) {
    const a = new Uint8Array(4);
    const v = new DataView(a.buffer);
    v.setFloat32(0, x, true);
    this.buffers.push(a);
    return this;
  }

  float64(x: Int8) {
    const a = new Uint8Array(8);
    const v = new DataView(a.buffer);
    v.setFloat64(0, x, true);
    this.buffers.push(a);
    return this;
  }

  integer(x: bigint) {
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

  array<A>(xs: A[], f: (_: _Encoder, x: A) => void) {
    this.ui32(xs.length);
    for (const x of xs) {
      f(this, x);
    }
    return this;
  }

  map<K, V>(
    x: Map<K, V>,
    fk: (_: _Encoder, k: K) => void,
    fv: (_: _Encoder, v: V) => void
  ) {
    this.ui32(x.size);
    for (const [k, v] of x.entries()) {
      fk(this, k);
      fv(this, v);
    }
    return this;
  }

  optional<A>(x: A | null, f: (_: _Encoder, v: A) => void) {
    if (x == null) {
      this.bool(false);
    } else {
      this.bool(true);
      f(this, x);
    }
    return this;
  }

  encode(method: _EncodeMethod) {
    method.encode(this);
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

export type Int8 = number;
export type Int16 = number;
export type Int32 = number;
export type UInt8 = number;
export type UInt16 = number;
export type UInt32 = number;
export type Float32 = number;
export type Float64 = number;
