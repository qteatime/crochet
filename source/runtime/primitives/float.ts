import { CrochetType, TCrochetAny, CrochetValue } from "./core";
import { CrochetInteger } from "./integer";

export class CrochetFloat extends CrochetValue {
  get type() {
    return TCrochetFloat.type;
  }

  constructor(readonly value: number) {
    super();
  }

  equals(other: CrochetValue): boolean {
    return (
      (other instanceof CrochetFloat && other.value === this.value) ||
      (other instanceof CrochetInteger && Number(other.value) === this.value)
    );
  }

  to_js() {
    return this.value;
  }

  to_text() {
    return this.value.toString();
  }
}

export class TCrochetFloat extends CrochetType {
  readonly parent = TCrochetAny.type;
  readonly type_name = "float-64bit";

  static type = new TCrochetFloat();
}
