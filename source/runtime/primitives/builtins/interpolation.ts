import {
  foreign,
  foreign_namespace,
  machine,
} from "../../world/ffi-decorators";
import { CrochetInterpolation, InterpolationDynamic } from "../interpolation";
import { CrochetStream } from "../stream";
import { CrochetText } from "../text";

@foreign_namespace("crochet.interpolation")
export class Interpolation {
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
