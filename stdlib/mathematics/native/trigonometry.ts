import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  const pi = ffi.float(Math.PI);
  const e = ffi.float(Math.E);

  ffi.defun("float.pi", () => pi);
  ffi.defun("float.e", () => e);

  ffi.defun("float.sin", (x) => ffi.float(Math.sin(ffi.float_to_number(x))));
  ffi.defun("float.sinh", (x) => ffi.float(Math.sinh(ffi.float_to_number(x))));
  ffi.defun("float.asin", (x) => ffi.float(Math.asin(ffi.float_to_number(x))));
  ffi.defun("float.asinh", (x) =>
    ffi.float(Math.asinh(ffi.float_to_number(x)))
  );

  ffi.defun("float.cos", (x) => ffi.float(Math.cos(ffi.float_to_number(x))));
  ffi.defun("float.cosh", (x) => ffi.float(Math.cosh(ffi.float_to_number(x))));
  ffi.defun("float.acos", (x) => ffi.float(Math.acos(ffi.float_to_number(x))));
  ffi.defun("float.acosh", (x) =>
    ffi.float(Math.acosh(ffi.float_to_number(x)))
  );

  ffi.defun("float.tan", (x) => ffi.float(Math.tan(ffi.float_to_number(x))));
  ffi.defun("float.tanh", (x) => ffi.float(Math.tanh(ffi.float_to_number(x))));
  ffi.defun("float.atan", (x) => ffi.float(Math.atan(ffi.float_to_number(x))));
  ffi.defun("float.atanh", (x) =>
    ffi.float(Math.atanh(ffi.float_to_number(x)))
  );

  ffi.defun("float.cbrt", (x) => ffi.float(Math.cbrt(ffi.float_to_number(x))));
  ffi.defun("float.sqrt", (x) => ffi.float(Math.sqrt(ffi.float_to_number(x))));
  ffi.defun("float.clz32", (x) =>
    ffi.float(Math.clz32(ffi.float_to_number(x)))
  );
  ffi.defun("float.exp", (x) => ffi.float(Math.exp(ffi.float_to_number(x))));
  ffi.defun("float.log", (x) => ffi.float(Math.log(ffi.float_to_number(x))));
};
