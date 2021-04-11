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
  EText,
  Expression,
} from "./expression";
import { generated_node } from "./meta";

export class SimpleInterpolation<T> {
  constructor(readonly parts: SimpleInterpolationPart<T>[]) {}

  interpolate(f: (_: T) => CrochetValue) {
    return new CrochetInterpolation(this.parts.map((x) => x.evaluate(f)));
  }

  to_expression() {
    if (this.has_dynamic_parts()) {
      return new EInterpolate(
        generated_node,
        this.parts.map((x) => x.to_expression())
      );
    } else {
      return new EText(generated_node, this.static_text());
    }
  }

  has_dynamic_parts() {
    return this.parts.some((x) => x instanceof SIPDynamic);
  }

  static_text() {
    return this.parts.map((x) => x.static_text()).join("");
  }

  optimise() {
    if (this.parts.length === 0) {
      return this;
    } else {
      const [hd, ...tl] = this.parts;
      const result = tl.reduce(
        (prev, b) => {
          const merged = prev.now.merge(b);
          if (merged != null) {
            return { now: merged, list: prev.list };
          } else {
            prev.list.push(prev.now);
            return { now: b, list: prev.list };
          }
        },
        { now: hd, list: [] as SimpleInterpolationPart<T>[] }
      );
      const list = result.list;
      list.push(result.now);
      return new SimpleInterpolation(list);
    }
  }
}

export abstract class SimpleInterpolationPart<T> {
  abstract evaluate(f: (_: T) => CrochetValue): InteprolationPart;
  abstract to_expression(): EInterpolationPart;
  abstract static_text(): string;
  abstract merge(
    x: SimpleInterpolationPart<T>
  ): SimpleInterpolationPart<T> | null;
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

  static_text() {
    return this.text;
  }

  merge(x: SimpleInterpolationPart<T>): SimpleInterpolationPart<T> | null {
    if (x instanceof SIPStatic) {
      return new SIPStatic<T>(this.text + x.text);
    } else {
      return null;
    }
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

  static_text() {
    return "[_]";
  }

  merge(x: SimpleInterpolationPart<T>): SimpleInterpolationPart<T> | null {
    return null;
  }
}
