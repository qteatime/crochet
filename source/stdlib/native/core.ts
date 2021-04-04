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
  TCrochetFloat,
  TCrochetInteger,
  TCrochetText,
  TCrochetInterpolation,
  TCrochetPartial,
  TAnyCrochetPartial,
  TCrochetRecord,
  TCrochetStream,
  TCrochetThunk,
  CrochetInstance,
  CrochetInteger,
  baseEnum,
  TCrochetNumeric,
  TCrochetIntegral,
  TCrochetFractional,
} from "../../runtime";
import { cast } from "../../utils";

@foreign_namespace("crochet.core:core")
export class CoreFfi {
  @foreign_type("any")
  static get type_any(): CrochetType {
    return TCrochetAny.type;
  }

  @foreign_type("unknown")
  static get type_unknown(): CrochetType {
    return TCrochetUnknown.type;
  }

  @foreign_type("true")
  static get type_true(): CrochetType {
    return TCrochetTrue.type;
  }

  @foreign_type("false")
  static get type_false(): CrochetType {
    return TCrochetFalse.type;
  }

  @foreign_type("boolean")
  static get type_boolean(): CrochetType {
    return TCrochetBoolean.type;
  }

  @foreign_type("numeric")
  static get type_numeric(): CrochetType {
    return TCrochetNumeric.type;
  }

  @foreign_type("integral")
  static get type_integral(): CrochetType {
    return TCrochetIntegral.type;
  }

  @foreign_type("fractional")
  static get type_fractional(): CrochetType {
    return TCrochetFractional.type;
  }

  @foreign_type("float")
  static get type_float(): CrochetType {
    return TCrochetFloat.type;
  }

  @foreign_type("integer")
  static get type_integer(): CrochetType {
    return TCrochetInteger.type;
  }

  @foreign_type("text")
  static get type_text(): CrochetType {
    return TCrochetText.type;
  }

  @foreign_type("interpolation")
  static get type_interpolation(): CrochetType {
    return TCrochetInterpolation.type;
  }

  @foreign_type("partial")
  static get type_partial(): CrochetType {
    return TAnyCrochetPartial.type;
  }

  @foreign_type("record")
  static get type_record(): CrochetType {
    return TCrochetRecord.type;
  }

  @foreign_type("stream")
  static get type_stream(): CrochetType {
    return TCrochetStream.type;
  }

  @foreign_type("enum")
  static get type_enum(): CrochetType {
    return baseEnum;
  }

  @foreign_type("thunk")
  static get type_thunk(): CrochetType {
    return TCrochetThunk.type;
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

  @foreign("not-eq")
  @machine()
  static not_eq(x: CrochetValue, y: CrochetValue) {
    return from_bool(x.not_equals(y));
  }
}

export default [CoreFfi];
