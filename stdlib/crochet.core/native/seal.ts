import type { CrochetValue, ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("seal.box", (value) => {
    return ffi.box(value);
  });

  ffi.defun("seal.unbox", (value0, type0) => {
    const value = ffi.unbox(value0);
    if (ffi.is_crochet_value(value)) {
      if (ffi.is_value_of_same_type(value, type0)) {
        return value;
      } else {
        throw ffi.panic(
          "no-unseal-capability",
          `Cannot unseal the value because the type provided does not match.`
        );
      }
    } else {
      throw ffi.panic(
        "no-unseal-capability",
        `Cannot unseal the value because the type provided does not match.`
      );
    }
  });

  ffi.defun("seal.can-unseal", (value) => {
    return ffi.boolean(ffi.is_crochet_value(ffi.unbox(value)));
  });

  ffi.defun("seal.unseal-unconditionally", (value) => {
    const result = ffi.unbox(value);
    if (ffi.is_crochet_value(result)) {
      return result;
    } else {
      throw ffi.panic(
        "cannot-unseal",
        "The seal does not wrap a Crochet value"
      );
    }
  });
};
