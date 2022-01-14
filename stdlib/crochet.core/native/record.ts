import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("record.pairs", (x) => {
    const result = [];
    for (const [k, v] of ffi.record_to_map(x).entries()) {
      const m = new Map([
        ["key", ffi.text(k)],
        ["value", v],
      ]);
      result.push(ffi.record(m));
    }
    return ffi.list(result);
  });
};
