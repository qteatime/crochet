import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("conversion.tuple-to-interpolation", (xs) => {
    return ffi.interpolation(ffi.tuple_to_array(xs));
  });
};
