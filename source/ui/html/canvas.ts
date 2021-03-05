import { CrochetType, CrochetValue } from "../../runtime";
import { HTMLStyle } from "./props";

export class THTMLCanvas extends CrochetType {
  readonly parent = null;

  get type_name() {
    return "html-canvas";
  }
}

export class HTMLCanvas extends CrochetValue {
  constructor(readonly style: HTMLStyle) {
    super();
  }

  get type() {
    return tHtmlCanvas;
  }

  equals(other: CrochetValue): boolean {
    return other === this;
  }

  to_text(transparent?: boolean): string {
    return "<html-canvas>";
  }
}

export const tHtmlCanvas = new THTMLCanvas();
