import {
  apply,
  CrochetFloat,
  CrochetInteger,
  CrochetInterpolation,
  CrochetPartial,
  CrochetRecord,
  CrochetStream,
  CrochetText,
  CrochetValue,
  cvalue,
  ErrIndexOutOfRange,
  foreign,
  foreign_namespace,
  from_bool,
  InterpolationDynamic,
  InterpolationStatic,
  machine,
  PartialConcrete,
  State,
  TCrochetFloat,
  type_name,
  _push,
} from "../../runtime";
import { pick, iter, gen, cast } from "../../utils";

@foreign_namespace("crochet.native.stream")
export class StreamFfi {
  @foreign()
  @machine()
  static count(stream: CrochetStream) {
    return new CrochetInteger(BigInt(stream.values.length));
  }

  @foreign("random-choice")
  @machine()
  static random_choice(stream: CrochetStream) {
    if (stream.values.length === 0) {
      throw new ErrIndexOutOfRange(stream, 0);
    } else {
      return cvalue(pick(stream.values));
    }
  }

  @foreign()
  @machine()
  static first(stream: CrochetStream) {
    if (stream.values.length === 0) {
      throw new ErrIndexOutOfRange(stream, 0);
    } else {
      return stream.values[0];
    }
  }

  @foreign()
  @machine()
  static last(stream: CrochetStream) {
    if (stream.values.length === 0) {
      throw new ErrIndexOutOfRange(stream, 0);
    } else {
      return stream.values[stream.values.length - 1];
    }
  }

  @foreign()
  @machine()
  static but_first(stream: CrochetStream) {
    return new CrochetStream(stream.values.slice(1));
  }

  @foreign()
  @machine()
  static but_last(stream: CrochetStream) {
    return new CrochetStream(stream.values.slice(0, -1));
  }

  @foreign()
  @machine()
  static take(stream: CrochetStream, n: CrochetInteger) {
    return new CrochetStream(stream.values.slice(0, Number(n.value)));
  }

  @foreign()
  @machine()
  static drop(stream: CrochetStream, n: CrochetInteger) {
    return new CrochetStream(stream.values.slice(Number(n.value)));
  }

  @foreign()
  @machine()
  static zip(a: CrochetStream, b: CrochetStream) {
    return new CrochetStream(
      iter<CrochetValue>(a.values)
        .zip<CrochetValue>(gen(b.values))
        .to_array()
        .map(([x, y]) => new CrochetStream([x, y]))
    );
  }

  @foreign()
  @machine()
  static concat(a: CrochetStream, b: CrochetStream) {
    return new CrochetStream(a.values.concat(b.values));
  }

  @foreign()
  @machine()
  static contains(a: CrochetStream, x: CrochetValue) {
    return from_bool(a.values.includes(x));
  }

  @foreign("sort-by")
  static async *sort(state: State, items: CrochetStream, key0: CrochetText) {
    const key = key0.value;
    const items1 = items.values.slice().sort((a, b) => {
      const ra = cast(a, CrochetRecord);
      const rb = cast(b, CrochetRecord);
      return compare(ra.projection.project(key), rb.projection.project(key));
    });
    return new CrochetStream(items1);
  }

  @foreign("shuffle")
  static async *shuffle(state: State, stream: CrochetStream) {
    return new CrochetStream(stream.values.sort((a, b) => Math.random() - 0.5));
  }

  @foreign("reverse")
  @machine()
  static reverse(stream: CrochetStream) {
    return new CrochetStream(stream.values.slice().reverse());
  }

  @foreign()
  static async *fold(
    state: State,
    stream: CrochetStream,
    initial: CrochetValue,
    partial: CrochetPartial
  ) {
    let current = initial;
    for (const x of stream.values) {
      current = cvalue(
        yield _push(
          apply(state, partial, [
            new PartialConcrete(current),
            new PartialConcrete(x),
          ])
        )
      );
    }
    return current;
  }

  @foreign()
  @machine()
  static interpolate(stream: CrochetStream) {
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
    throw new Error(
      `unsupported comparison: ${type_name(a)} - ${type_name(b)}`
    );
  }
}
