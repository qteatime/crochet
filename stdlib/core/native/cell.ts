import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("cell.make", (v) => ffi.cell(v));
  ffi.defun("cell.deref", (x) => ffi.deref_cell(x));
  ffi.defun("cell.cas", (x, o, n) => ffi.boolean(ffi.update_cell(x, o, n)));
};
