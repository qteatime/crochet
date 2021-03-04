import { iter } from "../../utils";
import { gen } from "../../utils/utils";
import { CrochetText } from "./text";
import { CrochetType } from "./types";
import { CrochetValue } from "./value";

export class CrochetInterpolation extends CrochetValue {
  constructor(readonly parts: InteprolationPart[]) {
    super();
  }

  get type() {
    return TCrochetInterpolation.type;
  }

  equals(other: CrochetValue): boolean {
    return (
      other instanceof CrochetInterpolation &&
      iter(this.parts)
        .zip(gen(other.parts))
        .every(([x, y]) => x.equals(y))
    );
  }

  to_text(transparent?: boolean): string {
    const text = this.parts.map((x) => x.to_text(true)).join("");
    if (transparent) {
      return text;
    } else {
      return `"${text}"`;
    }
  }
}

export class TCrochetInterpolation extends CrochetType {
  get type_name() {
    return "interpolation";
  }

  accepts(x: any): boolean {
    return x instanceof CrochetInterpolation;
  }

  coerce(x: CrochetValue): CrochetValue | null {
    if (x instanceof CrochetInterpolation) {
      return x;
    } else if (x instanceof CrochetText) {
      return new CrochetInterpolation([new InterpolationStatic(x.value)]);
    } else {
      return new CrochetInterpolation([new InterpolationDynamic(x)]);
    }
  }

  static type = new TCrochetInterpolation();
}

export abstract class InteprolationPart {
  abstract equals(other: InteprolationPart): boolean;
  abstract to_text(transparent?: boolean): string;
  abstract to_part(): CrochetValue;
  abstract to_static(): string;
}

export class InterpolationStatic extends InteprolationPart {
  constructor(readonly text: string) {
    super();
  }
  equals(other: InteprolationPart): boolean {
    return other instanceof InterpolationStatic && other.text === this.text;
  }

  to_text() {
    return this.text;
  }

  to_part() {
    return new CrochetText(this.text);
  }

  to_static() {
    return this.text;
  }
}

export class InterpolationDynamic extends InteprolationPart {
  constructor(readonly value: CrochetValue) {
    super();
  }

  equals(other: InteprolationPart): boolean {
    return (
      other instanceof InterpolationDynamic && other.value.equals(this.value)
    );
  }

  to_text(transparent?: boolean) {
    return this.value.to_text(transparent);
  }

  to_part() {
    return this.value;
  }

  to_static() {
    return "_";
  }
}
