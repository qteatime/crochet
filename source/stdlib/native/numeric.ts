import {
  CrochetInteger,
  CrochetFloat,
  foreign,
  foreign_namespace,
  from_bool,
  machine,
  CrochetStream,
  CrochetValue,
} from "../../runtime";
import { cast } from "../../utils";

@foreign_namespace("crochet.core:integer")
export class IntegerFfi {
  @foreign()
  @machine()
  static add(x0: CrochetValue, y0: CrochetValue) {
    const x = cast(x0, CrochetInteger);
    const y = cast(y0, CrochetInteger);

    return new CrochetInteger(x.value + y.value);
  }

  @foreign()
  @machine()
  static sub(x0: CrochetValue, y0: CrochetValue) {
    const x = cast(x0, CrochetInteger);
    const y = cast(y0, CrochetInteger);

    return new CrochetInteger(x.value - y.value);
  }

  @foreign()
  @machine()
  static mul(x0: CrochetValue, y0: CrochetValue) {
    const x = cast(x0, CrochetInteger);
    const y = cast(y0, CrochetInteger);

    return new CrochetInteger(x.value * y.value);
  }

  @foreign()
  @machine()
  static div(x0: CrochetValue, y0: CrochetValue) {
    const x = cast(x0, CrochetInteger);
    const y = cast(y0, CrochetInteger);

    return new CrochetInteger(x.value / y.value);
  }

  @foreign()
  @machine()
  static rem(x0: CrochetValue, y0: CrochetValue) {
    const x = cast(x0, CrochetInteger);
    const y = cast(y0, CrochetInteger);

    return new CrochetInteger(x.value % y.value);
  }

  @foreign()
  @machine()
  static lt(x0: CrochetValue, y0: CrochetValue) {
    const x = cast(x0, CrochetInteger);
    const y = cast(y0, CrochetInteger);

    return from_bool(x.value < y.value);
  }

  @foreign()
  @machine()
  static lte(x0: CrochetValue, y0: CrochetValue) {
    const x = cast(x0, CrochetInteger);
    const y = cast(y0, CrochetInteger);

    return from_bool(x.value <= y.value);
  }

  @foreign()
  @machine()
  static gt(x0: CrochetValue, y0: CrochetValue) {
    const x = cast(x0, CrochetInteger);
    const y = cast(y0, CrochetInteger);

    return from_bool(x.value > y.value);
  }

  @foreign()
  @machine()
  static gte(x0: CrochetValue, y0: CrochetValue) {
    const x = cast(x0, CrochetInteger);
    const y = cast(y0, CrochetInteger);

    return from_bool(x.value >= y.value);
  }

  @foreign()
  @machine()
  static range(min0: CrochetValue, max0: CrochetValue) {
    const min = cast(min0, CrochetInteger);
    const max = cast(max0, CrochetInteger);

    return new CrochetStream(
      Array.from(
        { length: Number(max.value - min.value) + 1 },
        (_, i) => new CrochetInteger(min.value + BigInt(i))
      )
    );
  }

  @foreign()
  @machine()
  static power(x0: CrochetValue, p0: CrochetValue) {
    const x = cast(x0, CrochetInteger);
    const p = cast(p0, CrochetInteger);

    return new CrochetInteger(x.value ** p.value);
  }

  @foreign()
  @machine()
  static sqrt(x0: CrochetValue) {
    const x = cast(x0, CrochetInteger);

    return new CrochetInteger(BigInt(Math.floor(Math.sqrt(Number(x.value)))));
  }
}
