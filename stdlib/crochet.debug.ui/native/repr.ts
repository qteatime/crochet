import type { ForeignInterface } from "../../../build/crochet";
import type { CrochetValue } from "../../../build/vm";
import type {
  CrochetForBrowser,
  Package,
  IR,
  Binary,
  VM,
  Compiler,
  AST,
} from "../../../build/targets/browser";

declare var Crochet: {
  CrochetForBrowser: typeof CrochetForBrowser;
  Package: typeof Package;
  IR: typeof IR;
  Binary: typeof Binary;
  VM: typeof VM;
  Compiler: typeof Compiler;
  AST: typeof AST;
};

export default (ffi: ForeignInterface) => {
  ffi.defun("repr.internal", (value0) => {
    const value = ffi.unbox(value0);
    if (value instanceof Crochet.VM.CrochetValue) {
      return ffi.text(Crochet.VM.Location.simple_value(value));
    } else {
      return ffi.text(Crochet.VM.Location.simple_value(value0));
    }
  });
};
