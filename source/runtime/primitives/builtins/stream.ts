import { gen, iter, pick } from "../../../utils";
import {
  avalue,
  cvalue,
  ErrIndexOutOfRange,
  run_all,
  State,
  _push,
  _throw,
} from "../../vm";
import {
  foreign,
  foreign_namespace,
  machine,
} from "../../world/ffi-decorators";
import { safe_cast } from "../core-ops";
import { CrochetValue } from "../value";
import { CrochetRecord, TCrochetRecord } from "../record";
import { CrochetStream } from "../stream";
import { CrochetInteger } from "../integer";
import { Record } from "./record";

@foreign_namespace("crochet.stream")
export class Stream {
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
}
