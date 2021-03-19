import {
  foreign_namespace,
  foreign,
  machine,
  CrochetInterpolation,
  CrochetStream,
  InterpolationDynamic,
  CrochetText,
} from "../../runtime";

@foreign_namespace("crochet.native.interpolation")
export class InterpolationFfi {
  @foreign()
  @machine()
  static concat(a: CrochetInterpolation, b: CrochetInterpolation) {
    return new CrochetInterpolation(a.parts.concat(b.parts));
  }

  @foreign()
  @machine()
  static parts(a: CrochetInterpolation) {
    return new CrochetStream(a.parts.map((x) => x.to_part()));
  }

  @foreign()
  @machine()
  static holes(a: CrochetInterpolation) {
    return new CrochetStream(
      a.parts
        .filter((x) => x instanceof InterpolationDynamic)
        .map((x) => x.to_part())
    );
  }

  @foreign("static-text")
  @machine()
  static static_text(a: CrochetInterpolation) {
    return new CrochetText(a.parts.map((x) => x.to_static()).join(""));
  }
}

@foreign_namespace("crochet.text")
export class TextFfi {
  @foreign()
  @machine()
  static concat(a: CrochetText, b: CrochetText) {
    return new CrochetText(a.value + b.value);
  }
}
