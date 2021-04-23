import { CrochetType, TCrochetAny, CrochetValue } from "./0-core";

export class CrochetText extends CrochetValue {
  get type(): CrochetType {
    return TCrochetBaseText.type;
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

  to_json() {
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

export class CrochetStaticText extends CrochetText {
  get type(): CrochetType {
    return TCrochetStaticText.type;
  }
}

export class TCrochetBaseText extends CrochetType {
  readonly parent = TCrochetAny.type;
  readonly type_name = "text";

  static type = new TCrochetBaseText();
}

export class TCrochetStaticText extends CrochetType {
  readonly parent = TCrochetBaseText.type;
  readonly type_name = "text";

  static type = new TCrochetStaticText();
}
