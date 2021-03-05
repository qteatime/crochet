import { CrochetValue, False } from "../../runtime";
import {
  foreign,
  foreign_namespace,
  machine,
} from "../../runtime/world/ffi-decorators";

@foreign_namespace("crochet.debug")
export class DebugFfi {
  @foreign("inspect")
  @machine()
  static inspect(value: CrochetValue) {
    console.log(">>", value.to_text());
    return False.instance;
  }
}
