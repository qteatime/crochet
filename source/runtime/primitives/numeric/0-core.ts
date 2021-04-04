import { CrochetType, TCrochetAny } from "../0-core";

export class TCrochetNumeric extends CrochetType {
  readonly type_name = "numeric";
  readonly parent = TCrochetAny.type;
  static type = new TCrochetNumeric();
}

export class TCrochetIntegral extends CrochetType {
  readonly type_name = "integral";
  readonly parent = TCrochetNumeric.type;
  static type = new TCrochetIntegral();
}

export class TCrochetFractional extends CrochetType {
  readonly type_name = "fractional";
  readonly parent = TCrochetNumeric.type;
  static type = new TCrochetFractional();
}
