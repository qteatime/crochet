import {
  TCrochetAny,
  CrochetValue,
  from_bool,
  TCrochetUnknown,
  TCrochetTrue,
  TCrochetFalse,
  TCrochetBoolean,
  TCrochetFloat,
  TCrochetInteger,
  TCrochetText,
  TCrochetInterpolation,
  TAnyFunction,
  TCrochetRecord,
  TCrochetTuple,
  TCrochetThunk,
  CrochetInteger,
  baseEnum,
  TCrochetNumeric,
  TCrochetIntegral,
  TCrochetFractional,
  TFunctionWithArity,
  ForeignInterface,
  CrochetFloat,
  CrochetInterpolation,
  CrochetTuple,
  InterpolationDynamic,
  CrochetText,
  InterpolationStatic,
} from "../../runtime";
import { ForeignNamespace } from "../ffi-def";

export function core_types(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.core:core")
    .deftype("any", TCrochetAny.type)
    .deftype("unknown", TCrochetUnknown.type)
    .deftype("true", TCrochetTrue.type)
    .deftype("false", TCrochetFalse.type)
    .deftype("boolean", TCrochetBoolean.type)
    .deftype("numeric", TCrochetNumeric.type)
    .deftype("integral", TCrochetIntegral.type)
    .deftype("fractional", TCrochetFractional.type)
    .deftype("float", TCrochetFloat.type)
    .deftype("integer", TCrochetInteger.type)
    .deftype("text", TCrochetText.type)
    .deftype("interpolation", TCrochetInterpolation.type)
    .deftype("function", TAnyFunction.type)
    .deftype("function-0", TFunctionWithArity.for_arity(0))
    .deftype("function-1", TFunctionWithArity.for_arity(1))
    .deftype("function-2", TFunctionWithArity.for_arity(2))
    .deftype("function-3", TFunctionWithArity.for_arity(3))
    .deftype("function-4", TFunctionWithArity.for_arity(4))
    .deftype("function-5", TFunctionWithArity.for_arity(5))
    .deftype("function-6", TFunctionWithArity.for_arity(6))
    .deftype("record", TCrochetRecord.type)
    .deftype("tuple", TCrochetTuple.type)
    .deftype("enum", baseEnum)
    .deftype("thunk", TCrochetThunk.type);
}

export function core_boolean(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.core:boolean")
    .defun("and", [CrochetValue, CrochetValue], (x, y) =>
      from_bool(x.as_bool() && y.as_bool())
    )
    .defun("or", [CrochetValue, CrochetValue], (x, y) =>
      from_bool(x.as_bool() || y.as_bool())
    )
    .defun("not", [CrochetValue], (x) => from_bool(!x.as_bool()));
}

export function core_conversion(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.core:conversion")
    .defun(
      "integer-to-float",
      [CrochetInteger],
      (x) => new CrochetFloat(Number(x.value))
    )
    .defun(
      "float-to-integer",
      [CrochetFloat],
      (x) => new CrochetInteger(BigInt(x.value))
    )
    .defun("tuple-to-interpolation", [CrochetTuple], (xs) => {
      return new CrochetInterpolation(
        xs.values.map((x) => {
          if (x instanceof CrochetText) {
            return new InterpolationStatic(x.value);
          } else {
            return new InterpolationDynamic(x);
          }
        })
      );
    });
}

export function core_interpolation(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.core:interpolation")
    .defun(
      "concat",
      [CrochetInterpolation, CrochetInterpolation],
      (x, y) => new CrochetInterpolation(x.parts.concat(y.parts))
    )
    .defun(
      "parts",
      [CrochetInterpolation],
      (x) => new CrochetTuple(x.parts.map((a) => a.to_part()))
    )
    .defun(
      "holes",
      [CrochetInterpolation],
      (x) =>
        new CrochetTuple(
          x.parts
            .filter((a) => a instanceof InterpolationDynamic)
            .map((a) => a.to_part())
        )
    )
    .defun(
      "static-text",
      [CrochetInterpolation],
      (x) => new CrochetText(x.parts.map((a) => a.to_static()).join(""))
    )
    .defun("normalise", [CrochetInterpolation], (x) => x.normalize());
}

export function core_text(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.core:text").defun(
    "concat",
    [CrochetText, CrochetText],
    (x, y) => new CrochetText(x.value + y.value)
  );
}

export function core_integer(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.core:integer")
    .defun(
      "add",
      [CrochetInteger, CrochetInteger],
      (x, y) => new CrochetInteger(x.value + y.value)
    )
    .defun(
      "sub",
      [CrochetInteger, CrochetInteger],
      (x, y) => new CrochetInteger(x.value - y.value)
    )
    .defun(
      "mul",
      [CrochetInteger, CrochetInteger],
      (x, y) => new CrochetInteger(x.value * y.value)
    )
    .defun(
      "div",
      [CrochetInteger, CrochetInteger],
      (x, y) => new CrochetInteger(x.value / y.value)
    )
    .defun(
      "rem",
      [CrochetInteger, CrochetInteger],
      (x, y) => new CrochetInteger(x.value % y.value)
    )
    .defun("lt", [CrochetInteger, CrochetInteger], (x, y) =>
      from_bool(x.value < y.value)
    )
    .defun("lte", [CrochetInteger, CrochetInteger], (x, y) =>
      from_bool(x.value <= y.value)
    )
    .defun("gt", [CrochetInteger, CrochetInteger], (x, y) =>
      from_bool(x.value > y.value)
    )
    .defun("gte", [CrochetInteger, CrochetInteger], (x, y) =>
      from_bool(x.value >= y.value)
    )
    .defun(
      "power",
      [CrochetInteger, CrochetInteger],
      (x, y) => new CrochetInteger(x.value ** y.value)
    )
    .defun(
      "range",
      [CrochetInteger, CrochetInteger, CrochetInteger],
      (x, y, z) => {
        const result = [];
        for (let i = x.value; i < y.value; i += z.value) {
          result.push(new CrochetInteger(i));
        }
        return new CrochetTuple(result);
      }
    );
}

export function core_float(ffi: ForeignInterface) {
  const nan = new CrochetFloat(NaN);
  const inf = new CrochetFloat(Number.POSITIVE_INFINITY);
  const neginf = new CrochetFloat(Number.NEGATIVE_INFINITY);

  new ForeignNamespace(ffi, "crochet.core:float")
    .defun(
      "add",
      [CrochetFloat, CrochetFloat],
      (x, y) => new CrochetFloat(x.value + y.value)
    )
    .defun(
      "sub",
      [CrochetFloat, CrochetFloat],
      (x, y) => new CrochetFloat(x.value - y.value)
    )
    .defun(
      "mul",
      [CrochetFloat, CrochetFloat],
      (x, y) => new CrochetFloat(x.value * y.value)
    )
    .defun(
      "div",
      [CrochetFloat, CrochetFloat],
      (x, y) => new CrochetFloat(x.value / y.value)
    )
    .defun(
      "rem",
      [CrochetFloat, CrochetFloat],
      (x, y) => new CrochetFloat(x.value % y.value)
    )
    .defun("lt", [CrochetFloat, CrochetFloat], (x, y) =>
      from_bool(x.value < y.value)
    )
    .defun("lte", [CrochetFloat, CrochetFloat], (x, y) =>
      from_bool(x.value <= y.value)
    )
    .defun("gt", [CrochetFloat, CrochetFloat], (x, y) =>
      from_bool(x.value > y.value)
    )
    .defun("gte", [CrochetFloat, CrochetFloat], (x, y) =>
      from_bool(x.value >= y.value)
    )
    .defun("eq", [CrochetFloat, CrochetFloat], (x, y) =>
      from_bool(x.value === y.value)
    )
    .defun("neq", [CrochetFloat, CrochetFloat], (x, y) =>
      from_bool(x.value !== y.value)
    )
    .defun(
      "power",
      [CrochetFloat, CrochetFloat],
      (x, y) => new CrochetFloat(x.value ** y.value)
    )
    .defun(
      "floor",
      [CrochetFloat],
      (x) => new CrochetFloat(Math.floor(x.value))
    )
    .defun("ceil", [CrochetFloat], (x) => new CrochetFloat(Math.ceil(x.value)))
    .defun(
      "trunc",
      [CrochetFloat],
      (x) => new CrochetFloat(Math.trunc(x.value))
    )
    .defun(
      "round",
      [CrochetFloat],
      (x) => new CrochetFloat(Math.round(x.value))
    )
    .defun("is-nan", [CrochetFloat], (x) => from_bool(Number.isNaN(x.value)))
    .defun("is-finite", [CrochetFloat], (x) =>
      from_bool(Number.isFinite(x.value))
    )
    .defun("nan", [], () => nan)
    .defun("infinity", [], () => inf)
    .defun("negative-infinity", [], () => neginf);
}

export function core_tuple(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.core:tuple")
    .defun(
      "count",
      [CrochetTuple],
      (xs) => new CrochetInteger(BigInt(xs.values.length))
    )
    .defun(
      "at",
      [CrochetTuple, CrochetInteger],
      (xs, i) => xs.values[Number(i.value - 1n)]
    )
    .defun(
      "concat",
      [CrochetTuple, CrochetTuple],
      (xs, ys) => new CrochetTuple(xs.values.concat(ys.values))
    )
    .defun(
      "slice",
      [CrochetTuple, CrochetInteger, CrochetInteger],
      (xs, from, to) => {
        return new CrochetTuple(
          xs.values.slice(Number(from.value - 1n), Number(to.value - 1n))
        );
      }
    );
}

export default [
  core_types,
  core_boolean,
  core_conversion,
  core_interpolation,
  core_text,
  core_integer,
  core_float,
  core_tuple,
];
