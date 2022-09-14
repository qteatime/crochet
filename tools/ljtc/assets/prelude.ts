interface _DecoderMethod {
  decode(decoder: _Decoder): any;
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
    const buffer = new Array(size);
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

  array<T>(f: () => T): T[] {
    const size = this.ui32();
    const result = new Array(size);
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

export type Int8 = number;
export type Int16 = number;
export type Int32 = number;
export type UInt8 = number;
export type UInt16 = number;
export type UInt32 = number;
export type Float32 = number;
export type Float64 = number;
