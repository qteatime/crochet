import { die } from "../vm";
import { CrochetType, TCrochetAny } from "./types";
import { CrochetValue } from "./value";

export class CrochetUnknown extends CrochetValue {
  get type() {
    return TCrochetUnknown.type;
  }

  constructor(readonly value: unknown) {
    super();
    if (value instanceof CrochetUnknown) {
      throw die(`double-wrapping an unknown value`);
    }
  }

  equals(other: CrochetValue): boolean {
    return other === this;
  }

  to_js() {
    if (this.value instanceof CrochetValue) {
      return this.value.to_js();
    } else {
      return this.value;
    }
  }

  to_text() {
    return `<unknown>`;
  }
}

export class TCrochetUnknown extends CrochetType {
  readonly parent = TCrochetAny.type;
  readonly type_name = "unknown";

  coerce(x: CrochetValue): CrochetValue | null {
    if (x instanceof CrochetUnknown) {
      return x;
    } else {
      return new CrochetUnknown(x);
    }
  }

  static type = new TCrochetUnknown();
}
