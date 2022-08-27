import type { ForeignInterface, CrochetValue } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("dom.make-data-uri", (mime0, bytes0) => {
    const mime = ffi.text_to_string(mime0);
    const bytes = ffi.to_uint8_array(bytes0);
    const blob = new Blob([bytes.buffer], { type: mime });
    const url = URL.createObjectURL(blob);
    return ffi.text(url);
  });
};
