import {
  apply,
  apply_partial,
  CrochetFloat,
  CrochetInteger,
  CrochetInterpolation,
  CrochetPartial,
  CrochetRecord,
  CrochetTuple,
  CrochetText,
  CrochetValue,
  cvalue,
  die,
  ErrIndexOutOfRange,
  foreign,
  foreign_namespace,
  from_bool,
  InterpolationDynamic,
  InterpolationStatic,
  Machine,
  machine,
  PartialConcrete,
  State,
  TCrochetFloat,
  type_name,
  _push,
} from "../../runtime";
import { iter, gen, cast } from "../../utils";

@foreign_namespace("crochet.core:tuple")
export class TupleFfi {
  @foreign()
  @machine()
  static count(stream0: CrochetValue) {
    const stream = cast(stream0, CrochetTuple);

    return new CrochetInteger(BigInt(stream.values.length));
  }

  @foreign("random-choice")
  static *random_choice(state: State, stream0: CrochetValue) {
    const stream = cast(stream0, CrochetTuple);

    if (stream.values.length === 0) {
      throw new ErrIndexOutOfRange(stream, 0);
    } else {
      return cvalue(state.random.random_choice(stream.values));
    }
  }

  @foreign()
  @machine()
  static first(stream0: CrochetValue) {
    const stream = cast(stream0, CrochetTuple);

    if (stream.values.length === 0) {
      throw new ErrIndexOutOfRange(stream, 0);
    } else {
      return stream.values[0];
    }
  }

  @foreign()
  @machine()
  static last(stream0: CrochetValue) {
    const stream = cast(stream0, CrochetTuple);

    if (stream.values.length === 0) {
      throw new ErrIndexOutOfRange(stream, 0);
    } else {
      return stream.values[stream.values.length - 1];
    }
  }

  @foreign("but-first")
  @machine()
  static but_first(stream0: CrochetValue) {
    const stream = cast(stream0, CrochetTuple);

    return new CrochetTuple(stream.values.slice(1));
  }

  @foreign("but-last")
  @machine()
  static but_last(stream0: CrochetValue) {
    const stream = cast(stream0, CrochetTuple);

    return new CrochetTuple(stream.values.slice(0, -1));
  }

  @foreign()
  @machine()
  static take(stream0: CrochetValue, n0: CrochetValue) {
    const stream = cast(stream0, CrochetTuple);
    const n = cast(n0, CrochetInteger);

    return new CrochetTuple(stream.values.slice(0, Number(n.value)));
  }

  @foreign()
  @machine()
  static drop(stream0: CrochetValue, n0: CrochetValue) {
    const stream = cast(stream0, CrochetTuple);
    const n = cast(n0, CrochetInteger);

    return new CrochetTuple(stream.values.slice(Number(n.value)));
  }

  @foreign()
  @machine()
  static zip(a0: CrochetValue, b0: CrochetValue) {
    const a = cast(a0, CrochetTuple);
    const b = cast(b0, CrochetTuple);

    return new CrochetTuple(
      iter<CrochetValue>(a.values)
        .zip<CrochetValue>(gen(b.values))
        .to_array()
        .map(([x, y]) => new CrochetTuple([x, y]))
    );
  }

  @foreign()
  @machine()
  static concat(a0: CrochetValue, b0: CrochetValue) {
    const a = cast(a0, CrochetTuple);
    const b = cast(b0, CrochetTuple);

    return new CrochetTuple(a.values.concat(b.values));
  }

  @foreign()
  @machine()
  static contains(a0: CrochetValue, x: CrochetValue) {
    const a = cast(a0, CrochetTuple);

    return from_bool(a.values.some((v) => v.equals(x)));
  }

  @foreign("sort-by")
  static *sort(
    state: State,
    items0: CrochetValue,
    key0: CrochetValue
  ): Machine {
    const items = cast(items0, CrochetTuple);
    const key = cast(key0, CrochetText).value;

    const items1 = items.values.slice().sort((a, b) => {
      const ra = cast(a, CrochetRecord);
      const rb = cast(b, CrochetRecord);
      return compare(ra.projection.project(key), rb.projection.project(key));
    });
    return new CrochetTuple(items1);
  }

  @foreign("shuffle")
  static *shuffle(state: State, stream0: CrochetValue) {
    const stream = cast(stream0, CrochetTuple);

    return new CrochetTuple(
      stream.values.sort((a, b) => state.random.random() - 0.5)
    );
  }

  @foreign("reverse")
  @machine()
  static reverse(stream0: CrochetValue) {
    const stream = cast(stream0, CrochetTuple);

    return new CrochetTuple(stream.values.slice().reverse());
  }

  @foreign()
  static *fold(
    state: State,
    stream0: CrochetValue,
    initial: CrochetValue,
    fn: CrochetValue
  ) {
    const stream = cast(stream0, CrochetTuple);

    let current = initial;
    for (const x of stream.values) {
      current = cvalue(yield _push(apply(state, fn, [current, x])));
    }
    return current;
  }

  @foreign()
  @machine()
  static interpolate(stream0: CrochetValue) {
    const stream = cast(stream0, CrochetTuple);

    return new CrochetInterpolation(
      stream.values.map((x) => {
        if (x instanceof CrochetText) {
          return new InterpolationStatic(x.value);
        } else {
          return new InterpolationDynamic(x);
        }
      })
    );
  }
}

function compare(a: CrochetValue, b: CrochetValue): number {
  if (a instanceof CrochetInteger && b instanceof CrochetInteger) {
    return a.value < b.value
      ? -1
      : a.value > b.value
      ? 1
      : /* a.value === b.value */ 0;
  } else if (a instanceof CrochetFloat && b instanceof CrochetFloat) {
    return a.value - b.value;
  } else if (a instanceof CrochetFloat) {
    return compare(a, cast(TCrochetFloat.type.coerce(b), CrochetFloat));
  } else if (b instanceof CrochetFloat) {
    return compare(cast(TCrochetFloat.type.coerce(a), CrochetFloat), b);
  } else {
    throw die(`unsupported comparison: ${type_name(a)} - ${type_name(b)}`);
  }
}

export default [TupleFfi];
