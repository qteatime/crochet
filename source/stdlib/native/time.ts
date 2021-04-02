import {
  CrochetInteger,
  CrochetValue,
  False,
  Machine,
  State,
  _await,
} from "../../runtime";
import { foreign, foreign_namespace } from "../../runtime/world/ffi-decorators";
import { cast, delay } from "../../utils";

@foreign_namespace("crochet.time:time")
export class TimeFfi {
  @foreign("sleep")
  static *sleep(state: State, ms0: CrochetValue): Machine {
    const ms = cast(ms0, CrochetInteger);
    yield _await(delay(Number(ms.value)));
    return False.instance;
  }
}
