import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("pkg.name", (x) => {
    const pkg = ffi.get_underlying_package(x);
    return ffi.text(pkg.name);
  });
};
