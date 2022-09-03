import { CrochetValue, ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  function read_boolean(view: DataView, offset: number) {
    return view.getUint8(offset) !== 0;
  }

  function write_boolean(view: DataView, offset: number, value: boolean) {
    view.setUint8(offset, value ? 1 : 0);
  }

  function read_bigint(view: DataView, offset0: number) {
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
      size: offset - offset0,
    };
  }

  function encode_bigint(value: bigint) {
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

  function read_text(view: DataView, offset0: number) {
    let offset = offset0;
    const size = view.getUint32(offset, true);
    offset += 4;
    const decoder = new TextDecoder("utf-8");
    const text_view = new DataView(view.buffer, view.byteOffset + offset, size);
    const result = decoder.decode(text_view);
    return {
      value: result,
      offset: offset + size,
      size: offset + size - offset0,
    };
  }

  function encode_text(text: string) {
    const encoder = new TextEncoder();
    let encoded_text = encoder.encode(text);
    const header_size = 4;
    const result = new Uint8Array(encoded_text.length + header_size);
    const resultv = new DataView(result.buffer);
    resultv.setUint32(0, encoded_text.length, true);
    result.set(encoded_text, header_size);
    return result;
  }

  function read_bytes(view: DataView, offset0: number) {
    let offset = offset0;
    const size = view.getUint32(offset, true);
    offset += 4;
    const result = new Uint8Array(size);
    for (let i = 0; i < size; ++i) {
      result[i] = view.getUint8(offset);
      offset += 1;
    }
    return {
      value: result,
      offset: offset,
      size: offset - offset0,
    };
  }

  function encode_bytes(bytes: Uint8Array) {
    const result = new Uint8Array(bytes.length + 4);
    const view = new DataView(result.buffer);
    view.setUint32(0, bytes.length, true);
    result.set(bytes, 4);
    return result;
  }

  ffi.defun("byte.view", (ba0) => {
    const ba = ffi.to_uint8_array(ba0);
    return ffi.box(new DataView(ba.buffer));
  });

  ffi.defun("byte.view-slice-from", (view0, from0) => {
    const view = ffi.unbox_typed(DataView, view0);
    const from = ffi.integer_to_bigint(from0);
    return ffi.box(
      new DataView(view.buffer, view.byteOffset + Number(from) - 1)
    );
  });

  ffi.defun("byte.view-take", (view0, count0) => {
    const view = ffi.unbox_typed(DataView, view0);
    const count = Number(ffi.integer_to_bigint(count0));
    return ffi.box(new DataView(view.buffer, view.byteOffset, Number(count)));
  });

  ffi.defun("byte.from-list", (list0) => {
    const list = ffi
      .list_to_array(list0)
      .map((x) => Number(ffi.integer_to_bigint(x)));
    return ffi.byte_array(new Uint8Array(list));
  });

  ffi.defun("byte.allocate", (size) => {
    const ba = new Uint8Array(Number(ffi.integer_to_bigint(size)));
    return ffi.byte_array(ba);
  });

  ffi.defun("byte.concat", (buffers) => {
    const bytes = ffi.list_to_array(buffers).map((x) => ffi.to_uint8_array(x));
    const size = bytes.reduce((s, x) => s + x.length, 0);
    const result = new Uint8Array(size);
    let offset = 0;
    for (let i = 0; i < bytes.length; ++i) {
      result.set(bytes[i], offset);
      offset += bytes[i].length;
    }
    return ffi.byte_array(result);
  });

  ffi.defun("byte.size", (x) => {
    return ffi.integer(BigInt(ffi.to_uint8_array(x).length));
  });

  ffi.defun("byte.view-size", (x0) => {
    const x = ffi.unbox_typed(DataView, x0);
    return ffi.integer(BigInt(x.byteLength));
  });

  ffi.defun("byte.at", (x, i) => {
    return ffi.integer(
      BigInt(ffi.to_uint8_array(x)[Number(ffi.integer_to_bigint(i)) - 1])
    );
  });

  ffi.defun("byte.put", (x, i, v) => {
    ffi.to_uint8_array(x)[Number(ffi.integer_to_bigint(i)) - 1] = Number(
      ffi.integer_to_bigint(v)
    );
    return ffi.nothing;
  });

  ffi.defun("byte.view-to-array", (x0) => {
    const view = ffi.unbox_typed(DataView, x0);
    if (view.byteOffset === 0 && view.byteLength === view.buffer.byteLength) {
      const array = new Uint8Array(view.buffer);
      return ffi.byte_array(array);
    } else {
      const array = new Uint8Array(view.byteLength);
      for (let i = 0; i < array.length; ++i) {
        array[i] = view.getUint8(i);
      }
      return ffi.byte_array(array);
    }
  });

  // Reading
  ffi.defun("byte.get-bool", (view0, offset) => {
    const view = ffi.unbox_typed(DataView, view0);
    const value = read_boolean(view, Number(ffi.integer_to_bigint(offset)) - 1);
    return ffi.boolean(value);
  });

  ffi.defun("byte.get-int8", (view0, offset) => {
    const view = ffi.unbox_typed(DataView, view0);
    const value = view.getInt8(Number(ffi.integer_to_bigint(offset)) - 1);
    return ffi.integer(BigInt(value));
  });

  ffi.defun("byte.get-int16", (view0, offset, le) => {
    const view = ffi.unbox_typed(DataView, view0);
    const value = view.getInt16(
      Number(ffi.integer_to_bigint(offset)) - 1,
      ffi.to_js_boolean(le)
    );
    return ffi.integer(BigInt(value));
  });

  ffi.defun("byte.get-int32", (view0, offset, le) => {
    const view = ffi.unbox_typed(DataView, view0);
    const value = view.getInt32(
      Number(ffi.integer_to_bigint(offset)) - 1,
      ffi.to_js_boolean(le)
    );
    return ffi.integer(BigInt(value));
  });

  ffi.defun("byte.get-uint8", (view0, offset) => {
    const view = ffi.unbox_typed(DataView, view0);
    const value = view.getUint8(Number(ffi.integer_to_bigint(offset)) - 1);
    return ffi.integer(BigInt(value));
  });

  ffi.defun("byte.get-uint16", (view0, offset, le) => {
    const view = ffi.unbox_typed(DataView, view0);
    const value = view.getUint16(
      Number(ffi.integer_to_bigint(offset)) - 1,
      ffi.to_js_boolean(le)
    );
    return ffi.integer(BigInt(value));
  });

  ffi.defun("byte.get-uint32", (view0, offset, le) => {
    const view = ffi.unbox_typed(DataView, view0);
    const value = view.getUint32(
      Number(ffi.integer_to_bigint(offset)) - 1,
      ffi.to_js_boolean(le)
    );
    return ffi.integer(BigInt(value));
  });

  ffi.defun("byte.get-float32", (view0, offset, le) => {
    const view = ffi.unbox_typed(DataView, view0);
    const value = view.getFloat32(
      Number(ffi.integer_to_bigint(offset)) - 1,
      ffi.to_js_boolean(le)
    );
    return ffi.float_64(value);
  });

  ffi.defun("byte.get-float64", (view0, offset, le) => {
    const view = ffi.unbox_typed(DataView, view0);
    const value = view.getFloat64(
      Number(ffi.integer_to_bigint(offset)) - 1,
      ffi.to_js_boolean(le)
    );
    return ffi.float_64(value);
  });

  // -- Writing
  ffi.defun("byte.set-bool", (view0, offset, value) => {
    const view = ffi.unbox_typed(DataView, view0);
    write_boolean(
      view,
      Number(ffi.integer_to_bigint(offset)) - 1,
      ffi.to_js_boolean(value)
    );
    return ffi.nothing;
  });

  ffi.defun("byte.set-int8", (view0, offset, value) => {
    const view = ffi.unbox_typed(DataView, view0);
    view.setInt8(
      Number(ffi.integer_to_bigint(offset)) - 1,
      Number(ffi.integer_to_bigint(value))
    );
    return ffi.nothing;
  });

  ffi.defun("byte.set-int16", (view0, offset, value, le) => {
    const view = ffi.unbox_typed(DataView, view0);
    view.setInt16(
      Number(ffi.integer_to_bigint(offset)) - 1,
      Number(ffi.integer_to_bigint(value)),
      ffi.to_js_boolean(le)
    );
    return ffi.nothing;
  });

  ffi.defun("byte.set-int32", (view0, offset, value, le) => {
    const view = ffi.unbox_typed(DataView, view0);
    view.setInt32(
      Number(ffi.integer_to_bigint(offset)) - 1,
      Number(ffi.integer_to_bigint(value)),
      ffi.to_js_boolean(le)
    );
    return ffi.nothing;
  });

  ffi.defun("byte.set-uint8", (view0, offset, value) => {
    const view = ffi.unbox_typed(DataView, view0);
    view.setUint8(
      Number(ffi.integer_to_bigint(offset)) - 1,
      Number(ffi.integer_to_bigint(value))
    );
    return ffi.nothing;
  });

  ffi.defun("byte.set-uint16", (view0, offset, value, le) => {
    const view = ffi.unbox_typed(DataView, view0);
    view.setUint16(
      Number(ffi.integer_to_bigint(offset)) - 1,
      Number(ffi.integer_to_bigint(value)),
      ffi.to_js_boolean(le)
    );
    return ffi.nothing;
  });

  ffi.defun("byte.set-uint32", (view0, offset, value, le) => {
    const view = ffi.unbox_typed(DataView, view0);
    view.setUint32(
      Number(ffi.integer_to_bigint(offset)) - 1,
      Number(ffi.integer_to_bigint(value)),
      ffi.to_js_boolean(le)
    );
    return ffi.nothing;
  });

  ffi.defun("byte.set-float32", (view0, offset, value, le) => {
    const view = ffi.unbox_typed(DataView, view0);
    view.setFloat32(
      Number(ffi.integer_to_bigint(offset)) - 1,
      ffi.float_to_number(value),
      ffi.to_js_boolean(le)
    );
    return ffi.nothing;
  });

  ffi.defun("byte.set-float64", (view0, offset, value, le) => {
    const view = ffi.unbox_typed(DataView, view0);
    view.setFloat64(
      Number(ffi.integer_to_bigint(offset)) - 1,
      ffi.float_to_number(value),
      ffi.to_js_boolean(le)
    );
    return ffi.nothing;
  });

  // -- Specialised codecs
  ffi.defun("byte.get-bigint", (view0, offset) => {
    const view = ffi.unbox_typed(DataView, view0);
    const value = read_bigint(view, Number(ffi.integer_to_bigint(offset)) - 1);
    return ffi.record(
      new Map<string, CrochetValue>([
        ["value", ffi.integer(value.value)],
        ["size", ffi.float_64(value.size)],
      ])
    );
  });

  ffi.defun("byte.encode-bigint", (value) => {
    return ffi.byte_array(encode_bigint(ffi.integer_to_bigint(value)));
  });

  ffi.defun("byte.get-text", (view0, offset) => {
    const view = ffi.unbox_typed(DataView, view0);
    const value = read_text(view, Number(ffi.integer_to_bigint(offset)) - 1);
    return ffi.record(
      new Map([
        ["value", ffi.text(value.value)],
        ["size", ffi.float_64(value.size)],
      ])
    );
  });

  ffi.defun("byte.encode-text", (text) => {
    return ffi.byte_array(encode_text(ffi.text_to_string(text)));
  });

  ffi.defun("byte.get-bytes", (view0, offset) => {
    const view = ffi.unbox_typed(DataView, view0);
    const value = read_bytes(view, Number(ffi.integer_to_bigint(offset)) - 1);
    return ffi.record(
      new Map([
        ["value", ffi.byte_array(value.value)],
        ["size", ffi.float_64(value.size)],
      ])
    );
  });

  ffi.defun("byte.encode-bytes", (array) => {
    return ffi.byte_array(encode_bytes(ffi.to_uint8_array(array)));
  });

  ffi.defun("byte.get-raw-bytes", (view0, offset0, size0) => {
    const view = ffi.unbox_typed(DataView, view0);
    const offset = Number(ffi.integer_to_bigint(offset0)) - 1;
    const size = Number(ffi.integer_to_bigint(size0));
    const result = new Uint8Array(size);
    for (let i = 0; i < size; ++i) {
      result[i] = view.getUint8(offset + i);
    }
    return ffi.byte_array(result);
  });
};
