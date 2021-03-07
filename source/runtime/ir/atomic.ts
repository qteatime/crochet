import { cast } from "../../utils";
import {
  CrochetInterpolation,
  CrochetValue,
  InteprolationPart,
  InterpolationDynamic,
  InterpolationStatic,
} from "../primitives";
import {
  EInterpolate,
  EInterpolateDynamic,
  EInterpolateStatic,
  EInterpolationPart,
  Expression,
} from "./expression";

export class SimpleInterpolation<T> {
  constructor(readonly parts: SimpleInterpolationPart<T>[]) {}

  interpolate(f: (_: T) => CrochetValue) {
    return new CrochetInterpolation(this.parts.map((x) => x.evaluate(f)));
  }

  to_expression() {
    return new EInterpolate(this.parts.map((x) => x.to_expression()));
  }
}

export abstract class SimpleInterpolationPart<T> {
  abstract evaluate(f: (_: T) => CrochetValue): InteprolationPart;
  abstract to_expression(): EInterpolationPart;
}

export class SIPStatic<T> extends SimpleInterpolationPart<T> {
  constructor(readonly text: string) {
    super();
  }

  evaluate(f: (_: T) => CrochetValue) {
    return new InterpolationStatic(this.text);
  }

  to_expression() {
    return new EInterpolateStatic(this.text);
  }
}

export class SIPDynamic<T> extends SimpleInterpolationPart<T> {
  constructor(readonly value: T) {
    super();
  }

  evaluate(f: (_: T) => CrochetValue) {
    return new InterpolationDynamic(f(this.value));
  }

  to_expression() {
    return new EInterpolateDynamic(cast(this.value, Expression));
  }
}
