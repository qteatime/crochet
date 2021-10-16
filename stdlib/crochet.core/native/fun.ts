import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defmachine("fun.capture", function* (arity0, fn0) {
    const arity = Number(ffi.integer_to_bigint(arity0));
    const fn = yield ffi.make_closure(arity, function* (...args) {
      return yield ffi.apply(fn0, args);
    });
    return fn;
  });
};
