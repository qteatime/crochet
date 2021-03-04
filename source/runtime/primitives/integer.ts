import { CrochetType } from "./types";
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
  readonly type_name = "integer";

  accepts(x: any) {
    return x instanceof CrochetInteger;
  }

  static type = new TCrochetInteger();
}
