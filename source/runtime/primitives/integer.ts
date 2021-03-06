import { CrochetType, TCrochetAny } from "./types";
import { CrochetValue } from "./value";

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
  readonly parent = TCrochetAny.type;
  readonly type_name = "integer";

  static type = new TCrochetInteger();
}