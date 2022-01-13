import type { ForeignInterface, CrochetValue } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("actor.turn", (fn) => {
    setImmediate(() => {
      ffi.run_asynchronously(function* () {
        return yield ffi.apply(fn, []);
      });
    });
    return ffi.nothing;
  });
};
