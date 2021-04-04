import {
  CrochetFloat,
  foreign,
  foreign_namespace,
  from_bool,
  machine,
  CrochetStream,
  CrochetValue,
} from "../../../runtime";
import { cast } from "../../../utils";

@foreign_namespace("crochet.core:float")
export class FloatFfi {
  @foreign()
  @machine()
  static add(x0: CrochetValue, y0: CrochetValue) {
    const x = cast(x0, CrochetFloat);
    const y = cast(y0, CrochetFloat);

    return new CrochetFloat(x.value + y.value);
  }

  @foreign()
  @machine()
  static sub(x0: CrochetValue, y0: CrochetValue) {
    const x = cast(x0, CrochetFloat);
    const y = cast(y0, CrochetFloat);

    return new CrochetFloat(x.value - y.value);
  }

  @foreign()
  @machine()
  static mul(x0: CrochetValue, y0: CrochetValue) {
    const x = cast(x0, CrochetFloat);
    const y = cast(y0, CrochetFloat);

    return new CrochetFloat(x.value * y.value);
  }

  @foreign()
  @machine()
  static div(x0: CrochetValue, y0: CrochetValue) {
    const x = cast(x0, CrochetFloat);
    const y = cast(y0, CrochetFloat);

    return new CrochetFloat(x.value / y.value);
  }

  @foreign()
  @machine()
  static rem(x0: CrochetValue, y0: CrochetValue) {
    const x = cast(x0, CrochetFloat);
    const y = cast(y0, CrochetFloat);

    return new CrochetFloat(x.value % y.value);
  }

  @foreign()
  @machine()
  static lt(x0: CrochetValue, y0: CrochetValue) {
    const x = cast(x0, CrochetFloat);
    const y = cast(y0, CrochetFloat);

    return from_bool(x.value < y.value);
  }

  @foreign()
  @machine()
  static lte(x0: CrochetValue, y0: CrochetValue) {
    const x = cast(x0, CrochetFloat);
    const y = cast(y0, CrochetFloat);

    return from_bool(x.value <= y.value);
  }

  @foreign()
  @machine()
  static gt(x0: CrochetValue, y0: CrochetValue) {
    const x = cast(x0, CrochetFloat);
    const y = cast(y0, CrochetFloat);

    return from_bool(x.value > y.value);
  }

  @foreign()
  @machine()
  static gte(x0: CrochetValue, y0: CrochetValue) {
    const x = cast(x0, CrochetFloat);
    const y = cast(y0, CrochetFloat);

    return from_bool(x.value >= y.value);
  }

  @foreign()
  @machine()
  static range(min0: CrochetValue, max0: CrochetValue) {
    const min = cast(min0, CrochetFloat);
    const max = cast(max0, CrochetFloat);

    return new CrochetStream(
      Array.from(
        { length: max.value - min.value + 1 },
        (_, i) => new CrochetFloat(min.value + i)
      )
    );
  }

  @foreign()
  @machine()
  static power(x0: CrochetValue, p0: CrochetValue) {
    const x = cast(x0, CrochetFloat);
    const p = cast(p0, CrochetFloat);

    return new CrochetFloat(x.value ** p.value);
  }

  @foreign()
  @machine()
  static floor(x0: CrochetValue) {
    const x = cast(x0, CrochetFloat);
    return new CrochetFloat(Math.floor(x.value));
  }

  @foreign()
  @machine()
  static ceil(x0: CrochetValue) {
    const x = cast(x0, CrochetFloat);
    return new CrochetFloat(Math.ceil(x.value));
  }

  @foreign()
  @machine()
  static trunc(x0: CrochetValue) {
    const x = cast(x0, CrochetFloat);
    return new CrochetFloat(Math.trunc(x.value));
  }

  @foreign()
  @machine()
  static round(x0: CrochetValue) {
    const x = cast(x0, CrochetFloat);
    return new CrochetFloat(Math.round(x.value));
  }

  @foreign()
  @machine()
  static sqrt(x0: CrochetValue) {
    const x = cast(x0, CrochetFloat);

    return new CrochetFloat(Math.sqrt(x.value));
  }
}

export default [FloatFfi];
