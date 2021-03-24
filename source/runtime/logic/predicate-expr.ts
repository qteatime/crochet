import { cast } from "../../utils";
import {
  CrochetInteger,
  CrochetRecord,
  CrochetStream,
  CrochetValue,
} from "../primitives";
import { State } from "../vm";
import { Predicate } from "./predicate";
import { do_bin_op, BinOp } from "./primitives";
import { UnificationEnvironment } from "./unification";

export abstract class PredicateExpr {
  abstract evaluate(state: State, env: UnificationEnvironment): CrochetValue;
}

export class PEValue extends PredicateExpr {
  constructor(readonly value: CrochetValue) {
    super();
  }

  evaluate(state: State, env: UnificationEnvironment) {
    return this.value;
  }
}

export class PEVariable extends PredicateExpr {
  constructor(readonly name: string) {
    super();
  }

  evaluate(state: State, env: UnificationEnvironment) {
    return env.try_lookup(this.name) ?? state.env.lookup(this.name);
  }
}

export class PEGlobal extends PredicateExpr {
  constructor(readonly name: string) {
    super();
  }

  evaluate(state: State, env: UnificationEnvironment) {
    return state.world.globals.lookup(this.name);
  }
}

export class PESelf extends PredicateExpr {
  evaluate(state: State, env: UnificationEnvironment) {
    return state.env.receiver;
  }
}

export class PEProject extends PredicateExpr {
  constructor(readonly expr: PredicateExpr, readonly name: string) {
    super();
  }

  evaluate(state: State, env: UnificationEnvironment) {
    return this.expr.evaluate(state, env).projection.project(this.name);
  }
}

export class PEBinOp extends PredicateExpr {
  constructor(
    readonly op: BinOp,
    readonly left: PredicateExpr,
    readonly right: PredicateExpr
  ) {
    super();
  }

  evaluate(state: State, env: UnificationEnvironment) {
    const left = this.left.evaluate(state, env);
    const right = this.right.evaluate(state, env);
    return do_bin_op(this.op, left, right);
  }
}

export class PECount extends PredicateExpr {
  constructor(readonly predicate: Predicate) {
    super();
  }

  evaluate(state: State, env: UnificationEnvironment) {
    return new CrochetInteger(
      BigInt(state.database.search(state, this.predicate, env).length)
    );
  }
}

export class PESet extends PredicateExpr {
  constructor(readonly predicate: Predicate) {
    super();
  }

  evaluate(state: State, env: UnificationEnvironment) {
    const newEnv = state.env.extend_with_unification(env);
    const newState = state.with_env(newEnv);
    const uenv = UnificationEnvironment.empty();

    return new CrochetStream(
      state.database
        .search(newState, this.predicate, uenv)
        .map((x) => new CrochetRecord(x.boundValues))
    );
  }
}
