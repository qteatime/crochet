import type { ForeignInterface, CrochetValue } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defmachine("timer.wait", function* (ms0) {
    const ms = Number(ffi.integer_to_bigint(ms0));
    const p = new Promise<CrochetValue>((resolve, reject) => {
      setTimeout(() => {
        resolve(ffi.nothing);
      });
    });
    return yield ffi.await(p);
  });
};
