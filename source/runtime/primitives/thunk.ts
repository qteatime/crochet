import { Expression } from "../ir";
import { cvalue, State, _push } from "../vm";
import { Environment } from "../world";
import {
  foreign,
  foreign_namespace,
  foreign_type,
} from "../world/ffi-decorators";
import { CrochetType, TCrochetAny } from "./types";
import { CrochetValue } from "./value";

export class CrochetThunk extends CrochetValue {
  get type() {
    return TCrochetThunk.type;
  }

  private value: null | CrochetValue = null;
  constructor(readonly expr: Expression, readonly env: Environment) {
    super();
  }

  async *force(state0: State) {
    if (this.value != null) {
      return this.value;
    } else {
      const state = state0.with_env(this.env);
      const value = cvalue(yield _push(this.expr.evaluate(state)));
      this.value = value;
      return value;
    }
  }

  equals(other: CrochetValue): boolean {
    return other === this;
  }

  to_js() {
    return this;
  }

  to_text() {
    return "<thunk>";
  }
}

export class TCrochetThunk extends CrochetType {
  readonly parent = TCrochetAny.type;
  readonly type_name = "thunk";

  static type = new TCrochetThunk();
}

@foreign_namespace("crochet.native.thunk")
export class ThunkFfi {
  @foreign_type("thunk")
  get thunk_type(): CrochetType {
    return TCrochetThunk.type;
  }

  @foreign("force")
  async *force(state: State, thunk: CrochetThunk) {
    const value = cvalue(yield _push(thunk.force(state)));
    return value;
  }
}