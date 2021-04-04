import {
  foreign_namespace,
  foreign,
  machine,
  CrochetInterpolation,
  CrochetStream,
  InterpolationDynamic,
  CrochetText,
  CrochetValue,
  from_bool,
  CrochetInteger,
} from "../../runtime";
import { cast } from "../../utils";

@foreign_namespace("crochet.core:interpolation")
export class InterpolationFfi {
  @foreign()
  @machine()
  static concat(a0: CrochetValue, b0: CrochetValue) {
    const a = cast(a0, CrochetInterpolation);
    const b = cast(b0, CrochetInterpolation);

    return new CrochetInterpolation(a.parts.concat(b.parts));
  }

  @foreign()
  @machine()
  static parts(a0: CrochetValue) {
    const a = cast(a0, CrochetInterpolation);

    return new CrochetStream(a.parts.map((x) => x.to_part()));
  }

  @foreign()
  @machine()
  static holes(a0: CrochetValue) {
    const a = cast(a0, CrochetInterpolation);

    return new CrochetStream(
      a.parts
        .filter((x) => x instanceof InterpolationDynamic)
        .map((x) => x.to_part())
    );
  }

  @foreign("static-text")
  @machine()
  static static_text(a0: CrochetValue) {
    const a = cast(a0, CrochetInterpolation);

    return new CrochetText(a.parts.map((x) => x.to_static()).join(""));
  }

  @foreign()
  @machine()
  static normalise(x0: CrochetValue) {
    const a = cast(x0, CrochetInterpolation);
    return a.normalize();
  }
}

@foreign_namespace("crochet.core:text")
export class TextFfi {
  @foreign()
  @machine()
  static concat(a0: CrochetValue, b0: CrochetValue) {
    const a = cast(a0, CrochetText);
    const b = cast(b0, CrochetText);

    return new CrochetText(a.value + b.value);
  }

  @foreign()
  @machine()
  static lines(x0: CrochetValue) {
    const x = cast(x0, CrochetText);
    return new CrochetStream(
      x.value.split(/\r\n|\r|\n/).map((x) => new CrochetText(x))
    );
  }

  @foreign("code-points")
  @machine()
  static code_points(x0: CrochetValue) {
    const x = cast(x0, CrochetText);
    const points = [];
    for (const point of x.value) {
      points.push(new CrochetInteger(BigInt(point.codePointAt(0))));
    }
    return new CrochetStream(points);
  }

  @foreign("from-code-points")
  @machine()
  static from_code_points(x0: CrochetValue) {
    const x = cast(x0, CrochetStream);
    const points = x.values.map((a) => Number(cast(a, CrochetInteger).value));
    const text = String.fromCodePoint(...points);
    return new CrochetText(text);
  }
}

export default [TextFfi, InterpolationFfi];
