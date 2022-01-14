import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  const pi = ffi.float_64(Math.PI);
  const e = ffi.float_64(Math.E);

  ffi.defun("float-64.pi", () => pi);
  ffi.defun("float-64.e", () => e);

  ffi.defun("float-64.sin", (x) =>
    ffi.float_64(Math.sin(ffi.float_to_number(x)))
  );
  ffi.defun("float-64.sinh", (x) =>
    ffi.float_64(Math.sinh(ffi.float_to_number(x)))
  );
  ffi.defun("float-64.asin", (x) =>
    ffi.float_64(Math.asin(ffi.float_to_number(x)))
  );
  ffi.defun("float-64.asinh", (x) =>
    ffi.float_64(Math.asinh(ffi.float_to_number(x)))
  );

  ffi.defun("float-64.cos", (x) =>
    ffi.float_64(Math.cos(ffi.float_to_number(x)))
  );
  ffi.defun("float-64.cosh", (x) =>
    ffi.float_64(Math.cosh(ffi.float_to_number(x)))
  );
  ffi.defun("float-64.acos", (x) =>
    ffi.float_64(Math.acos(ffi.float_to_number(x)))
  );
  ffi.defun("float-64.acosh", (x) =>
    ffi.float_64(Math.acosh(ffi.float_to_number(x)))
  );

  ffi.defun("float-64.tan", (x) =>
    ffi.float_64(Math.tan(ffi.float_to_number(x)))
  );
  ffi.defun("float-64.tanh", (x) =>
    ffi.float_64(Math.tanh(ffi.float_to_number(x)))
  );
  ffi.defun("float-64.atan", (x) =>
    ffi.float_64(Math.atan(ffi.float_to_number(x)))
  );
  ffi.defun("float-64.atanh", (x) =>
    ffi.float_64(Math.atanh(ffi.float_to_number(x)))
  );

  ffi.defun("float-64.cbrt", (x) =>
    ffi.float_64(Math.cbrt(ffi.float_to_number(x)))
  );
  ffi.defun("float-64.sqrt", (x) =>
    ffi.float_64(Math.sqrt(ffi.float_to_number(x)))
  );
  ffi.defun("float-64.clz32", (x) =>
    ffi.float_64(Math.clz32(ffi.float_to_number(x)))
  );
  ffi.defun("float-64.exp", (x) =>
    ffi.float_64(Math.exp(ffi.float_to_number(x)))
  );
  ffi.defun("float-64.log", (x) =>
    ffi.float_64(Math.log(ffi.float_to_number(x)))
  );
};
