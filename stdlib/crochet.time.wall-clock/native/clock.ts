import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("clock.now", () => {
    return ffi.integer(BigInt(new Date().getTime()));
  });
};
