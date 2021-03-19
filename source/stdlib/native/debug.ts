import { CrochetText, CrochetValue, False } from "../../runtime";
import {
  foreign,
  foreign_namespace,
  machine,
} from "../../runtime/world/ffi-decorators";

@foreign_namespace("crochet.native.debug")
export class DebugFfi {
  @foreign("inspect")
  @machine()
  static inspect(value: CrochetValue) {
    console.log(">>", value.to_text());
    return False.instance;
  }

  @foreign("representation")
  @machine()
  static representation(value: CrochetValue) {
    return new CrochetText(value.to_text());
  }
}
