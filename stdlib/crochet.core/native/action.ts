import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("action.score", (x) => ffi.float(ffi.action_choice(x).score));
  ffi.defun("action.action", (x) => ffi.action_choice(x).action);
};