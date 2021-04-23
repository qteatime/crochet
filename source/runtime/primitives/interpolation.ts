import { iter } from "../../utils";
import { gen } from "../../utils/utils";
import {
  SimpleInterpolation,
  SimpleInterpolationPart,
  SIPDynamic,
  SIPStatic,
} from "../ir";
import { CrochetType, TCrochetAny, CrochetValue } from "./0-core";
import { CrochetStaticText, CrochetText } from "./text";

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

  normalize() {
    const parts = this.parts.map((x) => x.to_simple_part());
    return new SimpleInterpolation(parts).optimise().interpolate((x) => x);
  }
}

export class TCrochetInterpolation extends CrochetType {
  readonly parent = TCrochetAny.type;
  get type_name() {
    return "interpolation";
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
  abstract to_simple_part(): SimpleInterpolationPart<CrochetValue>;
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
    return new CrochetStaticText(this.text);
  }

  to_static() {
    return this.text;
  }

  to_simple_part() {
    return new SIPStatic<CrochetValue>(this.text);
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
    return `[${this.value.to_text(transparent)}]`;
  }

  to_part() {
    return this.value;
  }

  to_static() {
    return "_";
  }

  to_simple_part() {
    return new SIPDynamic(this.value);
  }
}
