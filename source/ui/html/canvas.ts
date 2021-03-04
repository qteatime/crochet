import { CrochetType, CrochetValue } from "../../runtime";
import { HTMLStyle } from "./props";

export class THTMLCanvas extends CrochetType {
  get type_name() {
    return "html-canvas";
  }

  accepts(x: any): boolean {
    return x instanceof HTMLCanvas;
  }

  coerce(x: CrochetValue): CrochetValue | null {
    if (this.accepts(x)) {
      return x;
    } else {
      return null;
    }
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
