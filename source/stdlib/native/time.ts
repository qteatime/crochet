import {
  CrochetInteger,
  CrochetNothing,
  False,
  ForeignInterface,
  _await,
} from "../../runtime";
import { delay } from "../../utils";
import { ForeignNamespace } from "../ffi-def";

export function time_ffi(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.time:time").defmachine(
    "sleep",
    [CrochetInteger],
    function* (_, ms) {
      yield _await(delay(Number(ms.value)));
      return CrochetNothing.instance;
    }
  );
}

export default [time_ffi];
