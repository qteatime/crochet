import { CrochetType, TCrochetAny } from "./types";
import { CrochetValue } from "./value";

export class CrochetText extends CrochetValue {
  get type() {
    return TCrochetText.type;
  }

  constructor(readonly value: string) {
    super();
  }

  equals(other: CrochetValue): boolean {
    return other instanceof CrochetText && other.value === this.value;
  }

  to_js() {
    return this.value;
  }

  to_text(transparent?: boolean) {
    if (transparent) {
      return this.value;
    } else {
      return `"${this.value.replace(/"/g, '\\"')}"`;
    }
  }
}

export class TCrochetText extends CrochetType {
  readonly parent = TCrochetAny.type;
  readonly type_name = "text";

  static type = new TCrochetText();
}
