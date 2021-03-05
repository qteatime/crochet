import { CrochetType, CrochetValue, TCrochetAny } from "../../runtime";

export class TCrochetHtml extends CrochetType {
  readonly parent = TCrochetAny.type;
  readonly type_name = "html-element";
  static type = new TCrochetHtml();
}

export class CrochetHtml extends CrochetValue {
  constructor(readonly value: HTMLElement) {
    super();
  }

  get type(): CrochetType {
    return TCrochetHtml.type;
  }

  equals(other: CrochetValue): boolean {
    return other === this;
  }

  to_text(transparent?: boolean): string {
    return "<html-element>";
  }
}

export class TCrochetMenu extends CrochetType {
  readonly parent = TCrochetHtml.type;
  readonly type_name = "html-menu";
  static type = new TCrochetMenu();
}

export class CrochetMenu extends CrochetHtml {
  constructor(
    readonly value: HTMLElement,
    readonly selected: Promise<CrochetValue>
  ) {
    super(value);
  }

  get type(): CrochetType {
    return TCrochetMenu.type;
  }

  equals(other: CrochetValue): boolean {
    return other === this;
  }

  to_text(transparent?: boolean): string {
    return "<html-menu>";
  }
}
