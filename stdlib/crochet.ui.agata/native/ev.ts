import type { CrochetValue, ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  function unbox_typed<T extends Function>(
    x0: CrochetValue,
    type: T
  ): T["prototype"] {
    const x = ffi.unbox(x0);
    if (x instanceof type) {
      return x as any;
    } else {
      throw ffi.panic("invalid-type", `Expected native ${type.name}`);
    }
  }

  ffi.defun("ev.time", (ev0) => {
    const ev = unbox_typed(ev0, Event);
    return ffi.integer(BigInt(Math.round(ev.timeStamp)));
  });

  ffi.defun("ev.cancel", (ev0) => {
    const ev = unbox_typed(ev0, Event);
    ev.stopPropagation();
    ev.preventDefault();
    return ffi.nothing;
  });
};
