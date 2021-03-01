import {
  foreign,
  foreign_namespace,
  machine,
} from "../../world/ffi-decorators";
import { CrochetText } from "../value";

@foreign_namespace("crochet.text")
export class Text {
  @foreign()
  @machine()
  static concat(a: CrochetText, b: CrochetText) {
    return new CrochetText(a.value + b.value);
  }
}
