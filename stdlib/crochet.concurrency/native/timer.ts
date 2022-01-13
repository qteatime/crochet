import type { ForeignInterface, CrochetValue } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("timer.wait", (ms0, fn) => {
    const ms = Number(ffi.integer_to_bigint(ms0));
    setTimeout(() => {
      ffi.run_asynchronously(function* () {
        return yield ffi.apply(fn, []);
      });
    }, ms);
    return ffi.nothing;
  });
};
