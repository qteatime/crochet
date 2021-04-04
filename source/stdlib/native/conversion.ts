import {
  CrochetFloat,
  CrochetInteger,
  CrochetValue,
  foreign,
  foreign_namespace,
  machine,
} from "../../runtime";
import { cast } from "../../utils";

@foreign_namespace("crochet.core:conversion")
export class ConversionFfi {
  @foreign("integer-to-float")
  @machine()
  static integer_to_float(x0: CrochetValue) {
    const x = cast(x0, CrochetInteger);
    return new CrochetFloat(Number(x.value));
  }

  @foreign("float-to-integer")
  @machine()
  static float_to_integer(x0: CrochetValue) {
    const x = cast(x0, CrochetFloat);
    return new CrochetInteger(BigInt(x.value));
  }
}

export default [ConversionFfi];
