import {
  foreign,
  foreign_namespace,
  machine,
} from "../../world/ffi-decorators";
import { from_bool } from "../core-ops";
import { CrochetValue } from "../value";

@foreign_namespace("crochet.core")
export class Core {
  @foreign()
  @machine()
  static band(x: CrochetValue, y: CrochetValue) {
    return from_bool(x.as_bool() && y.as_bool());
  }

  @foreign()
  @machine()
  static bor(x: CrochetValue, y: CrochetValue) {
    return from_bool(x.as_bool() || y.as_bool());
  }

  @foreign()
  @machine()
  static bnot(x: CrochetValue) {
    return from_bool(!x.as_bool());
  }

  @foreign()
  @machine()
  static eq(x: CrochetValue, y: CrochetValue) {
    return from_bool(x.equals(y));
  }

  @foreign()
  @machine()
  static not_eq(x: CrochetValue, y: CrochetValue) {
    return from_bool(!x.equals(y));
  }
}
