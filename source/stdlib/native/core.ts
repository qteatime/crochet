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
  TCrochetNothing,
  CrochetCell,
  TCrochetCell,
  CrochetRecord,
  CrochetNothing,
  ErrArbitrary,
  _push,
  invoke,
  apply,
  cvalue,
  get_string,
  ErrNativeError,
  from_string,
  InteprolationPart,
  get_array,
  get_map,
  get_integer,
  Thread,
  equals_sync,
} from "../../runtime";
import { cast, copy_map } from "../../utils";
import { ForeignNamespace } from "../ffi-def";

export function core_types(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.core:core")
    .deftype("any", TCrochetAny.type)
    .deftype("unknown", TCrochetUnknown.type)
    .deftype("nothing", TCrochetNothing.type)
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
    .deftype("thunk", TCrochetThunk.type)
    .deftype("cell", TCrochetCell.type);
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
    })
    .defun("interpolation-to-text", [CrochetInterpolation], (x) => {
      return new CrochetText(
        x.parts
          .map((x) => {
            if (x instanceof InterpolationStatic) {
              return x.text;
            } else if (x instanceof InterpolationDynamic) {
              return cast(x.value, CrochetText).value;
            } else {
              throw new Error(`internal: impossible`);
            }
          })
          .join("")
      );
    })
    .defun("text-to-integer", [CrochetText], (x) => {
      try {
        return new CrochetInteger(BigInt(x.value));
      } catch (_) {
        return CrochetNothing.instance;
      }
    })
    .defun("text-to-float", [CrochetText], (x) => {
      const n = Number(x.value);
      if (isNaN(n)) {
        return CrochetNothing.instance;
      } else {
        return new CrochetFloat(n);
      }
    })
    .defun("any-to-text", [CrochetValue], (x) => {
      return new CrochetText(x.to_text());
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
    .defun("to-plain-text", [CrochetInterpolation], (x) => {
      function flatten_part(x: InteprolationPart): string {
        if (x instanceof InterpolationStatic) {
          return x.text;
        } else if (x instanceof InterpolationDynamic) {
          return flatten(x.value);
        } else {
          throw new Error(`unreachable`);
        }
      }

      function flatten(x: CrochetValue): string {
        if (x instanceof CrochetText) {
          return x.value;
        } else if (x instanceof CrochetInterpolation) {
          return x.parts.map(flatten_part).reduce((a, b) => a + b, "");
        } else {
          throw new ErrArbitrary(
            "invalid-type",
            "Can only flatten interpolations containing text"
          );
        }
      }

      return from_string(flatten(x));
    })
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
        for (let i = x.value; i <= y.value; i += z.value) {
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
      [CrochetFloat, CrochetInteger],
      (x, y) => new CrochetFloat(x.value ** Number(y.value))
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
      "concat",
      [CrochetTuple, CrochetTuple],
      (xs, ys) => new CrochetTuple(xs.values.concat(ys.values))
    )
    .defun("contains", [CrochetTuple, CrochetValue], (xs, x) =>
      from_bool(xs.values.some((y) => x.equals(y)))
    )
    .defmachine(
      "fold",
      [CrochetTuple, CrochetValue, CrochetValue],
      function* (state, xs, z, f) {
        let acc = z;
        for (const x of xs.values) {
          acc = cvalue(yield _push(apply(state, f, [acc, x])));
        }
        return acc;
      }
    )
    .defmachine(
      "foldr",
      [CrochetTuple, CrochetValue, CrochetValue],
      function* (state, xs, z, f) {
        let acc = z;
        const vs = xs.values;
        for (let i = vs.length - 1; i >= 0; --i) {
          const x = vs[i];
          acc = cvalue(yield _push(apply(state, f, [x, acc])));
        }
        return acc;
      }
    )
    .defun(
      "slice",
      [CrochetTuple, CrochetInteger, CrochetInteger],
      (xs, from, to) => {
        return new CrochetTuple(
          xs.values.slice(Number(from.value - 1n), Number(to.value))
        );
      }
    )
    .defun(
      "at",
      [CrochetTuple, CrochetInteger],
      (xs, i) => xs.values[Number(i.value - 1n)]
    )
    .defun(
      "at-put",
      [CrochetTuple, CrochetInteger, CrochetValue],
      (xs, i, v) => {
        const result = xs.values.slice();
        result[Number(i.value - 1n)] = v;
        return new CrochetTuple(result);
      }
    )
    .defun("at-delete", [CrochetTuple, CrochetInteger], (xs, i) => {
      const result = [];
      const values = xs.values;
      const target = Number(i.value - 1n);
      for (let i = 0; i < values.length; ++i) {
        if (i !== target) {
          result.push(values[i]);
        }
      }
      return new CrochetTuple(result);
    })
    .defun1("at-insert", (xs0, i0, x) => {
      const xs = get_array(xs0);
      const i = get_integer(i0);
      const xs1 = xs.slice();
      xs1.splice(Number(i - 1n), 0, x);
      return new CrochetTuple(xs1);
    })
    .defmachine1("zip-with", function* (state, self0, that0, fn) {
      const self = get_array(self0);
      const that = get_array(that0);
      if (self.length !== that.length) {
        throw new ErrArbitrary(
          "invalid-length",
          "Cannot zip tuples of different lengths"
        );
      }
      let result = [];
      for (let i = 0; i < self.length; ++i) {
        const x = self[i];
        const y = that[i];
        const value = cvalue(yield _push(apply(state, fn, [x, y])));
        result.push(value);
      }
      return new CrochetTuple(result);
    })
    .defun("reverse", [CrochetTuple], (xs) => {
      const source = xs.values;
      const result = [];
      for (let i = source.length - 1; i >= 0; i--) {
        result.push(source[i]);
      }
      return new CrochetTuple(result);
    })
    .defmachine("sort", [CrochetTuple, CrochetValue], function* (state, xs, f) {
      const result = xs.values.slice();
      result.sort((a, b) => {
        const call = apply(state, f, [a, b]);
        const order = cast(Thread.for_machine(call).run_sync(), CrochetInteger);
        return Number(order.value);
      });
      return new CrochetTuple(result);
    })
    .defmachine("unique", [CrochetTuple], function* (state, xs) {
      const result: CrochetValue[] = [];
      for (const x of xs.values) {
        if (!result.some((y) => equals_sync(state, x, y))) {
          result.push(x);
        }
      }
      return new CrochetTuple(result);
    });
}

export function core_cell(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.core:cell")
    .defun("make", [CrochetValue], (v) => new CrochetCell(v))
    .defun("deref", [CrochetCell], (x) => x.deref())
    .defun("cas", [CrochetCell, CrochetValue, CrochetValue], (x, v1, v2) =>
      from_bool(x.cas(v1, v2))
    );
}

export function core_record(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.core:record")
    .defun(
      "count",
      [CrochetRecord],
      (x) => new CrochetInteger(BigInt(x.values.size))
    )
    .defun(
      "keys",
      [CrochetRecord],
      (x) =>
        new CrochetTuple([...x.values.keys()].map((x) => new CrochetText(x)))
    )
    .defun(
      "values",
      [CrochetRecord],
      (x) => new CrochetTuple([...x.values.values()])
    )
    .defun("pairs", [CrochetRecord], (x) => {
      return new CrochetTuple(
        [...x.values.entries()].map(
          ([k, v]) =>
            new CrochetRecord(
              new Map([
                ["key", new CrochetText(k)],
                ["value", v],
              ])
            )
        )
      );
    })
    .defun("concat", [CrochetRecord, CrochetRecord], (a, b) => {
      const result = new Map();
      for (const [k, v] of a.values) {
        result.set(k, v);
      }
      for (const [k, v] of b.values) {
        result.set(k, v);
      }
      return new CrochetRecord(result);
    })
    .defmachine("from-pairs", [CrochetTuple], function* (state, xs) {
      const result = new Map();
      for (const pair0 of xs.values) {
        const pair = cast(pair0, CrochetRecord);
        result.set(
          cast(
            pair.projection.project("key", state.env.raw_module),
            CrochetText
          ).value,
          pair.projection.project("value", state.env.raw_module)
        );
      }
      return new CrochetRecord(result);
    })
    .defmachine(
      "at-default",
      [CrochetRecord, CrochetText, CrochetValue],
      function* (state, r, k, x) {
        if (r.values.has(k.value)) {
          return r.projection.project(k.value, state.env.raw_module);
        } else {
          return x;
        }
      }
    )
    .defun1("has-key", (rec0, key0) => {
      const rec = get_map(rec0);
      const key = get_string(key0);
      return from_bool(rec.has(key));
    })
    .defun1("delete-at", (rec0, key0) => {
      const rec = get_map(rec0);
      const key = get_string(key0);
      const result = new Map();
      for (const [k, v] of rec.entries()) {
        if (k !== key) {
          result.set(k, v);
        }
      }
      return new CrochetRecord(result);
    })
    .defun1("at-put", (rec0, key0, value) => {
      const rec = get_map(rec0);
      const key = get_string(key0);
      const result = new Map();
      copy_map(rec, result);
      result.set(key, value);
      return new CrochetRecord(result);
    });
}

export function core_commands(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.core:commands").defun(
    "panic",
    [CrochetText, CrochetText],
    (tag, text) => {
      throw new ErrArbitrary(tag.value, text.value);
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
  core_cell,
  core_record,
  core_commands,
];
