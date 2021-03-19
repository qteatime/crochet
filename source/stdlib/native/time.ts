import { CrochetInteger, False, State } from "../../runtime";
import { foreign, foreign_namespace } from "../../runtime/world/ffi-decorators";
import { delay } from "../../utils";

@foreign_namespace("crochet.native.time")
export class TimeFfi {
  @foreign("sleep")
  static async *sleep(state: State, ms: CrochetInteger) {
    await delay(Number(ms.value));
    return False.instance;
  }
}
