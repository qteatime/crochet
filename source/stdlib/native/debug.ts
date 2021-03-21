import {
  CrochetText,
  CrochetThunk,
  CrochetValue,
  cvalue,
  False,
  State,
  _push,
} from "../../runtime";
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

  @foreign("time")
  static async *time(state: State, thunk: CrochetThunk, message: CrochetText) {
    const start = new Date().getTime();
    const value = cvalue(yield _push(thunk.force(state)));
    const end = new Date().getTime();
    console.log(`>> ${message.value} (${end - start}ms)`);
    return value;
  }
}
