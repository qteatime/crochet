import {
  foreign,
  foreign_namespace,
  machine,
} from "../../world/ffi-decorators";
import { CrochetInterpolation } from "../value";

@foreign_namespace("crochet.interpolation")
export class Interpolation {
  @foreign()
  @machine()
  static concat(a: CrochetInterpolation, b: CrochetInterpolation) {
    return new CrochetInterpolation(a.parts.concat(b.parts));
  }
}
