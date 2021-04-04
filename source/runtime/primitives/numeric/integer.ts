import { TCrochetIntegral } from "./0-core";
import { CrochetType, CrochetValue } from "../0-core";

export class CrochetInteger extends CrochetValue {
  get type() {
    return TCrochetInteger.type;
  }

  constructor(readonly value: bigint) {
    super();
  }

  equals(other: CrochetValue): boolean {
    return other instanceof CrochetInteger && other.value === this.value;
  }

  to_js() {
    return this.value;
  }

  to_text() {
    return this.value.toString();
  }
}

export class TCrochetInteger extends CrochetType {
  readonly parent = TCrochetIntegral.type;
  readonly type_name = "integer";

  static type = new TCrochetInteger();
}
