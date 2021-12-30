import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("debug.type", (value) => {
    return ffi.get_static_type(value);
  });

  ffi.defun("debug.type-info", (value) => {
    return ffi.get_type_info(value);
  });
};
