import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("base64.encode", (x) => {
    return ffi.text(Buffer.from(ffi.text_to_string(x)).toString("base64"));
  });

  ffi.defun("base64.decode", (x) => {
    return ffi.text(
      Buffer.from(ffi.text_to_string(x), "base64").toString("utf-8")
    );
  });

  ffi.defun("base64.encode-bytes", (x0) => {
    return ffi.text(Buffer.from(ffi.to_uint8_array(x0)).toString("base64"));
  });

  ffi.defun("base64.decode-bytes", (x0) => {
    const buffer = Buffer.from(ffi.text_to_string(x0), "base64");
    return ffi.byte_array(new Uint8Array(buffer.buffer));
  });

  ffi.defun("hex.encode", (x) => {
    return ffi.text(Buffer.from(ffi.text_to_string(x)).toString("hex"));
  });

  ffi.defun("hex.encode-int", (x) => {
    return ffi.text(ffi.integer_to_bigint(x).toString(16));
  });

  ffi.defun("hex.decode", (x) => {
    return ffi.text(
      Buffer.from(ffi.text_to_string(x), "hex").toString("utf-8")
    );
  });

  ffi.defun("hex.decode-int", (x) => {
    return ffi.integer(BigInt(`0x${ffi.text_to_string(x)}`));
  });
};
