import { CrochetValue, ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defmachine("trap.run", function* (fn) {
    try {
      const value = yield ffi.apply(fn, []);
      return ffi.record(
        new Map([
          ["ok", ffi.boolean(true)],
          ["value", value],
        ])
      );
    } catch (e) {
      return ffi.record(
        new Map([
          ["ok", ffi.boolean(false)],
          ["reason", ffi.box(e)],
        ])
      );
    }
  });

  ffi.defun("trap.error-format", (e0) => {
    const e = ffi.unbox(e0);
    if (e instanceof Error) {
      return ffi.text(e.stack ?? `${e.name}: ${e.message}`);
    } else {
      return ffi.text(String(e));
    }
  });
};
