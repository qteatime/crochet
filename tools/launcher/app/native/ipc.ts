import type { ForeignInterface, CrochetValue } from "../../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("ipc.uuid", () => {
    return ffi.text(ffi.uuid4());
  });
};
