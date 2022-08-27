import type { ForeignInterface, CrochetValue } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("reflection.get-type-info", (x) => {
    const styp = ffi.get_type(ffi.get_static_type(x));
    return ffi.record(
      new Map([
        ["package", ffi.text(styp.module?.pkg.name ?? "crochet.core")],
        ["name", ffi.text(styp.name)],
      ])
    );
  });
};
