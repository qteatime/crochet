import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("uri.encode-segment", (segment) => {
    return ffi.text(encodeURIComponent(ffi.text_to_string(segment)));
  });
};
