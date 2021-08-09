import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("conversion.list-to-interpolation", (xs) => {
    return ffi.interpolation(ffi.list_to_array(xs));
  });
};
