import type { ForeignInterface, CrochetValue } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("document.location", () => {
    return ffi.text(document.location.href);
  });
};
