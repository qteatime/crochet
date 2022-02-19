import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  const max_int32 = 2 ** 32 - 1;

  ffi.defun("random.random-seed", () => {
    return ffi.integer(BigInt(Math.trunc(Math.random() * max_int32)));
  });
};
