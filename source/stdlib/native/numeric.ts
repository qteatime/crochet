import {
  CrochetInteger,
  CrochetFloat,
  foreign,
  foreign_namespace,
  from_bool,
  machine,
} from "../../runtime";

@foreign_namespace("crochet.native.integer")
export class IntegerFfi {
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

@foreign_namespace("crochet.native.float")
export class FloatFfi {
  @foreign()
  @machine()
  static add(x: CrochetFloat, y: CrochetFloat) {
    return new CrochetFloat(x.value + y.value);
  }

  @foreign()
  @machine()
  static sub(x: CrochetFloat, y: CrochetFloat) {
    return new CrochetFloat(x.value - y.value);
  }

  @foreign()
  @machine()
  static mul(x: CrochetFloat, y: CrochetFloat) {
    return new CrochetFloat(x.value * y.value);
  }

  @foreign()
  @machine()
  static div(x: CrochetFloat, y: CrochetFloat) {
    return new CrochetFloat(x.value / y.value);
  }

  @foreign()
  @machine()
  static rem(x: CrochetFloat, y: CrochetFloat) {
    return new CrochetFloat(x.value % y.value);
  }

  @foreign()
  @machine()
  static lt(x: CrochetFloat, y: CrochetFloat) {
    return from_bool(x.value < y.value);
  }

  @foreign()
  @machine()
  static lte(x: CrochetFloat, y: CrochetFloat) {
    return from_bool(x.value <= y.value);
  }

  @foreign()
  @machine()
  static gt(x: CrochetFloat, y: CrochetFloat) {
    return from_bool(x.value > y.value);
  }

  @foreign()
  @machine()
  static gte(x: CrochetFloat, y: CrochetFloat) {
    return from_bool(x.value >= y.value);
  }
}
