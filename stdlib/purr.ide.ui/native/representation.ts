import type { ForeignInterface, CrochetValue } from "../../../build/crochet";

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
  async function all_repr(value: CrochetValue) {
    const perspectives = await ffi.debug_perspectives(value);
    const representations = await ffi.debug_representations(
      value,
      perspectives
    );
    return representations;
  }

  async function specific_repr(value: CrochetValue, typ: VM.CrochetType) {
    return (await ffi.debug_representations(value, [typ])).filter(
      (x) => x.name !== "Internal"
    );
  }

  function repr_to_crochet(x: { name: string; document: unknown }) {
    return ffi.record(
      new Map([
        ["name", ffi.text(x.name)],
        ["document", ffi.text(JSON.stringify(x.document))],
      ])
    );
  }

  ffi.defmachine("repr.show-all", function* (value) {
    const reprs = yield ffi.await(
      all_repr(value).then((xs) => ffi.list(xs.map(repr_to_crochet)))
    );
    return reprs;
  });

  ffi.defmachine("repr.show-one", function* (value, persp) {
    const typ = persp.type;
    const reprs = ffi.list_to_array(
      yield ffi.await(
        specific_repr(value, typ).then((xs) =>
          ffi.list(xs.map(repr_to_crochet))
        )
      )
    );
    if (reprs.length === 0) {
      return ffi.nothing;
    } else if (reprs.length === 1) {
      return reprs[0];
    } else {
      throw ffi.panic(
        "internal",
        "computed multiple representations for the same type",
        ffi.record(
          new Map([
            ["value", value],
            ["perspective", persp],
          ])
        )
      );
    }
  });

  ffi.defun("repr.internal", (value0) => {
    const value = ffi.unbox(value0);
    if (value instanceof Crochet.VM.CrochetValue) {
      return ffi.text(Crochet.VM.Location.simple_value(value));
    } else {
      return ffi.text(Crochet.VM.Location.simple_value(value0));
    }
  });
};
