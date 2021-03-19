import {
  CrochetType,
  TCrochetAny,
  foreign,
  foreign_namespace,
  foreign_type,
  machine,
  CrochetValue,
  from_bool,
  TCrochetUnknown,
  TCrochetTrue,
  TCrochetFalse,
  TCrochetBoolean,
} from "../../runtime";

@foreign_namespace("crochet.native.core")
export class CoreFfi {
  @foreign_type("any")
  get type_any(): CrochetType {
    return TCrochetAny.type;
  }

  @foreign_type("unknown")
  get type_unknown(): CrochetType {
    return TCrochetUnknown.type;
  }

  @foreign_type("true")
  get type_true(): CrochetType {
    return TCrochetTrue.type;
  }

  @foreign_type("false")
  get type_false(): CrochetType {
    return TCrochetFalse.type;
  }

  @foreign_type("boolean")
  get type_boolean(): CrochetType {
    return TCrochetBoolean.type;
  }

  @foreign()
  @machine()
  static band(x: CrochetValue, y: CrochetValue) {
    return from_bool(x.as_bool() && y.as_bool());
  }

  @foreign()
  @machine()
  static bor(x: CrochetValue, y: CrochetValue) {
    return from_bool(x.as_bool() || y.as_bool());
  }

  @foreign()
  @machine()
  static bnot(x: CrochetValue) {
    return from_bool(!x.as_bool());
  }

  @foreign()
  @machine()
  static eq(x: CrochetValue, y: CrochetValue) {
    return from_bool(x.equals(y));
  }

  @foreign()
  @machine()
  static not_eq(x: CrochetValue, y: CrochetValue) {
    return from_bool(!x.equals(y));
  }
}
