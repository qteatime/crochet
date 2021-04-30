import { cast } from "../../utils/utils";
import { Expression } from "../ir";
import { cvalue, ErrArbitrary, Machine, State, _push, _push_expr } from "../vm";
import { Environment } from "../world";
import { CrochetType, TCrochetAny, CrochetValue } from "./0-core";

export class CrochetThunk extends CrochetValue {
  get type() {
    return TCrochetThunk.type;
  }

  private value: null | CrochetValue = null;
  constructor(readonly expr: Expression, readonly env: Environment) {
    super();
  }

  *force(state0: State) {
    if (this.value != null) {
      return this.value;
    } else {
      const state = state0.with_env(this.env);
      const value = cvalue(yield _push_expr(this.expr, state));
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

  get is_forced() {
    return this.value != null;
  }

  get forced_value() {
    if (this.value == null) {
      throw new ErrArbitrary(
        "unevaluated-thunk",
        `Trying to get a value from an unevaluated thunk`
      );
    }
    return this.value;
  }
}

export class TCrochetThunk extends CrochetType {
  readonly parent = TCrochetAny.type;
  readonly type_name = "thunk";

  static type = new TCrochetThunk();
}
