export function read_boolean(view: DataView, offset: number) {
  return view.getUint8(offset) !== 0;
}

export function write_boolean(view: DataView, offset: number, value: boolean) {
  view.setUint8(offset, value ? 1 : 0);
}

export function read_bigint(view: DataView, offset0: number) {
  let offset = offset0;
  const negative = read_boolean(view, offset);
  offset += 1;
  const size = view.getUint32(offset, true);
  offset += 4;
  const buffer = new Array(size);
  for (let i = 0; i < size; ++i) {
    buffer[i] = view.getUint8(offset).toString(16).padStart(2, "0");
    offset += 1;
  }
  const result = BigInt(`0x${buffer.join("")}`);
  return {
    value: negative ? -result : result,
    offset: offset,
  };
}

export function encode_bigint(value: bigint) {
  let bytes = (value < 0 ? -value : value).toString(16);
  if (bytes.length % 2 != 0) bytes = "0" + bytes;
  const size = bytes.length / 2;

  const header_size = 5;
  const buffer = new Uint8Array(size + header_size);
  const bufferv = new DataView(buffer.buffer);
  write_boolean(bufferv, 0, value < 0);
  bufferv.setUint32(1, size, true);

  for (let i = 0; i < size; ++i) {
    const byte_offset = i * 2;
    bufferv.setUint8(
      header_size + i,
      parseInt(bytes.substring(byte_offset, byte_offset + 2), 16)
    );
  }

  return buffer;
}

export function read_text(view: DataView, offset0: number) {
  let offset = offset0;
  const size = view.getUint32(offset, true);
  offset += 4;
  const decoder = new TextDecoder("utf-8");
  const text_view = new DataView(view.buffer, view.byteOffset + offset, size);
  const result = decoder.decode(text_view);
  return {
    value: result,
    offset: offset + size,
  };
}

export function encode_text(text: string) {
  const encoder = new TextEncoder();
  let encoded_text = encoder.encode(text);
  const header_size = 4;
  const result = new Uint8Array(encoded_text.length + header_size);
  const resultv = new DataView(result.buffer);
  resultv.setUint32(0, encoded_text.length, true);
  result.set(encoded_text, header_size);
  return result;
}

export function read_bytes(view: DataView, offset0: number) {
  let offset = offset0;
  const size = view.getUint32(offset, true);
  offset += 4;
  const result = new Uint8Array(size);
  for (let i = 0; i < size; ++i) {
    result[i] = view.getUint8(offset);
    offset += 1;
  }
  return result;
}

export function encode_bytes(bytes: Uint8Array) {
  const result = new Uint8Array(bytes.length + 4);
  const view = new DataView(result.buffer);
  view.setUint32(0, bytes.length, true);
  result.set(bytes, 4);
  return result;
}

export function write_bytes(
  view: DataView,
  offset0: number,
  value: Uint8Array
) {
  let offset = offset0;
  view.setUint8(offset, value.length);
  offset += 4;
  for (let i = 0; i < value.length; ++i) {
    view.setUint8(offset, value[i]);
    offset += 1;
  }
  return offset;
}
