import { CrochetFloat, ForeignInterface } from "../../runtime";
import { ForeignNamespace } from "../ffi-def";

export function float_ffi(ffi: ForeignInterface) {
  const pi = new CrochetFloat(Math.PI);
  const e = new CrochetFloat(Math.E);

  new ForeignNamespace(ffi, "crochet.mathematics:float")
    .defun("pi", [], () => pi)
    .defun("e", [], () => e)
    .defun("sin", [CrochetFloat], (x) => new CrochetFloat(Math.sin(x.value)))
    .defun("sinh", [CrochetFloat], (x) => new CrochetFloat(Math.sinh(x.value)))
    .defun("asin", [CrochetFloat], (x) => new CrochetFloat(Math.asin(x.value)))
    .defun(
      "asinh",
      [CrochetFloat],
      (x) => new CrochetFloat(Math.asinh(x.value))
    )
    .defun("cos", [CrochetFloat], (x) => new CrochetFloat(Math.cos(x.value)))
    .defun("cosh", [CrochetFloat], (x) => new CrochetFloat(Math.cosh(x.value)))
    .defun("acos", [CrochetFloat], (x) => new CrochetFloat(Math.acos(x.value)))
    .defun(
      "acosh",
      [CrochetFloat],
      (x) => new CrochetFloat(Math.acosh(x.value))
    )
    .defun("tan", [CrochetFloat], (x) => new CrochetFloat(Math.tan(x.value)))
    .defun("atan", [CrochetFloat], (x) => new CrochetFloat(Math.atan(x.value)))
    .defun(
      "atan2",
      [CrochetFloat, CrochetFloat],
      (x, y) => new CrochetFloat(Math.atan2(x.value, y.value))
    )
    .defun(
      "atanh",
      [CrochetFloat],
      (x) => new CrochetFloat(Math.atanh(x.value))
    )
    .defun("tanh", [CrochetFloat], (x) => new CrochetFloat(Math.tanh(x.value)))
    .defun("cbrt", [CrochetFloat], (x) => new CrochetFloat(Math.cbrt(x.value)))
    .defun("sqrt", [CrochetFloat], (x) => new CrochetFloat(Math.sqrt(x.value)))
    .defun(
      "clz32",
      [CrochetFloat],
      (x) => new CrochetFloat(Math.clz32(x.value))
    )
    .defun("exp", [CrochetFloat], (x) => new CrochetFloat(Math.exp(x.value)))
    .defun("log", [CrochetFloat], (x) => new CrochetFloat(Math.log(x.value)));
}

export default [float_ffi];
