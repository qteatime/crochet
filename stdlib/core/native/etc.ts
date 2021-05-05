import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("etc.panic", (tag, message) => {
    throw ffi.panic(ffi.text_to_string(tag), ffi.text_to_string(message));
  });
};
