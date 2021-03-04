import { CrochetType } from "./types";
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
  readonly type_name = "text";

  accepts(x: any) {
    return x instanceof CrochetText;
  }

  static type = new TCrochetText();
}
