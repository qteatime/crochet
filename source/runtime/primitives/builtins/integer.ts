import {
  foreign,
  foreign_namespace,
  machine,
} from "../../world/ffi-decorators";
import { from_bool } from "../core-ops";
import { CrochetInteger } from "../integer";

@foreign_namespace("crochet.integer")
export class Integer {
  @foreign()
  @machine()
  static add(x: CrochetInteger, y: CrochetInteger) {
    return new CrochetInteger(x.value + y.value);
  }

  @foreign()
  @machine()
  static sub(x: CrochetInteger, y: CrochetInteger) {
    return new CrochetInteger(x.value - y.value);
  }

  @foreign()
  @machine()
  static mul(x: CrochetInteger, y: CrochetInteger) {
    return new CrochetInteger(x.value * y.value);
  }

  @foreign()
  @machine()
  static div(x: CrochetInteger, y: CrochetInteger) {
    return new CrochetInteger(x.value / y.value);
  }

  @foreign()
  @machine()
  static rem(x: CrochetInteger, y: CrochetInteger) {
    return new CrochetInteger(x.value % y.value);
  }

  @foreign()
  @machine()
  static lt(x: CrochetInteger, y: CrochetInteger) {
    return from_bool(x.value < y.value);
  }

  @foreign()
  @machine()
  static lte(x: CrochetInteger, y: CrochetInteger) {
    return from_bool(x.value <= y.value);
  }

  @foreign()
  @machine()
  static gt(x: CrochetInteger, y: CrochetInteger) {
    return from_bool(x.value > y.value);
  }

  @foreign()
  @machine()
  static gte(x: CrochetInteger, y: CrochetInteger) {
    return from_bool(x.value >= y.value);
  }
}
