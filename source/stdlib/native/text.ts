import {
  foreign_namespace,
  foreign,
  machine,
  CrochetInterpolation,
  CrochetStream,
  InterpolationDynamic,
  CrochetText,
  CrochetValue,
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
}
