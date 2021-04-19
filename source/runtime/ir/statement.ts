import { Bag } from "../../utils/bag";
import { cast } from "../../utils/utils";
import { ConcreteRelation } from "../logic";
import {
  CrochetInstance,
  CrochetNothing,
  CrochetTuple,
  CrochetValue,
  False,
} from "../primitives";
import {
  avalue,
  cvalue,
  ErrArbitrary,
  ErrVariableAlreadyBound,
  Machine,
  run_all,
  run_all_exprs,
  State,
  _jump,
  _mark,
  _push,
  _push_expr,
} from "../vm";
import { AnyContext, Context, Goal, Signal, Simulation } from "../simulation";
import { Environment, World } from "../world";
import { EVariable, Expression } from "./expression";
import { Type } from "./type";
import { Meta } from "../../generated/crochet-grammar";
import { generated_node, Metadata } from "./meta";

export abstract class Statement {
  abstract evaluate(state: State): Machine;
  abstract get position(): Metadata;
}

export class SFact extends Statement {
  constructor(
    readonly position: Metadata,
    readonly name: string,
    readonly exprs: Expression[]
  ) {
    super();
  }

  *evaluate(state: State): Machine {
    const relation = cast(
      state.world.database.lookup(this.name),
      ConcreteRelation
    );
    const values = avalue(yield _push(run_all_exprs(this.exprs, state)));
    relation.tree.insert(values);
    return CrochetNothing.instance;
  }
}

export class SForget extends Statement {
  constructor(
    readonly position: Metadata,
    readonly name: string,
    readonly exprs: Expression[]
  ) {
    super();
  }

  *evaluate(state: State): Machine {
    const relation = cast(
      state.world.database.lookup(this.name),
      ConcreteRelation
    );
    const values = avalue(yield _push(run_all_exprs(this.exprs, state)));
    relation.tree.remove(values);
    return CrochetNothing.instance;
  }
}

export class SExpression extends Statement {
  constructor(readonly position: Metadata, readonly expr: Expression) {
    super();
  }

  *evaluate(state: State): Machine {
    const result = cvalue(yield _push_expr(this.expr, state));
    return result;
  }
}

export class SLet extends Statement {
  constructor(
    readonly position: Metadata,
    readonly name: string,
    readonly expr: Expression
  ) {
    super();
  }

  *evaluate(state: State): Machine {
    const value = cvalue(yield _push_expr(this.expr, state));
    if (state.env.has(this.name)) {
      throw new ErrVariableAlreadyBound(this.name);
    }
    state.env.define(this.name, value);
    return value;
  }
}

export class SBlock extends Statement {
  constructor(readonly position: Metadata, readonly statements: Statement[]) {
    super();
  }

  *evaluate(state: State): Machine {
    let result: CrochetValue = CrochetNothing.instance;
    for (const stmt of this.statements) {
      result = cvalue(yield _push_expr(stmt, state));
    }
    return result;
  }
}

export class SGoto extends Statement {
  constructor(readonly position: Metadata, readonly name: string) {
    super();
  }

  *evaluate(state: State): Machine {
    const scene = state.world.scenes.lookup(this.name);
    const machine = scene.evaluate(state);
    return yield _jump(machine);
  }
}

export class SCall extends Statement {
  constructor(readonly position: Metadata, readonly name: string) {
    super();
  }

  *evaluate(state: State): Machine {
    const scene = state.world.scenes.lookup(this.name);
    const machine = scene.evaluate(state);
    return yield _push(machine);
  }
}

export abstract class SimulateContext {
  abstract realise(state: State): Context;
}

export class SCAny extends SimulateContext {
  realise(state: State) {
    return AnyContext.instance;
  }
}

export class SCNamed extends SimulateContext {
  constructor(readonly name: string) {
    super();
  }

  realise(state: State) {
    return state.world.contexts.lookup(this.name);
  }
}

export class SSimulate extends Statement {
  constructor(
    readonly position: Metadata,
    readonly context: SimulateContext,
    readonly actors: Expression,
    readonly goal: Goal,
    readonly signals: Signal[]
  ) {
    super();
  }

  *evaluate(state: State): Machine {
    const actors = cast(yield _push_expr(this.actors, state), CrochetTuple);
    const context = this.context.realise(state);
    const signals = new Bag<string, Signal>("signal");
    for (const signal of this.signals) {
      signals.add(signal.name, signal);
    }
    const simulation = new Simulation(
      state.env,
      actors.values,
      context,
      this.goal,
      signals
    );
    return yield _push(simulation.run(state));
  }
}

export class SRegister extends Statement {
  constructor(readonly position: Metadata, readonly expr: Expression) {
    super();
  }

  *evaluate(state: State): Machine {
    const value0 = cvalue(yield _push_expr(this.expr, state));
    const value = cast(value0, CrochetInstance);
    value.type.register_instance(value);
    return value;
  }
}

let asserts = 0;
export class SAssert extends Statement {
  private id = ++asserts;

  constructor(readonly position: Metadata, readonly expr: Expression) {
    super();
  }

  *evaluate(state0: State): Machine {
    const env = state0.env.clone();
    const subexprs = [];
    for (const e of this.expr.sub_expressions) {
      subexprs.push(cvalue(yield _push_expr(e, state0)));
    }
    const vars: string[] = [];
    for (let i = 0; i < subexprs.length; ++i) {
      const name = `$assert_${this.id}_${i}`;
      env.define(name, subexprs[i]);
      vars.push(name);
    }
    let i = 0;
    const expr = this.expr.map_subexpressions(
      (_) => new EVariable(generated_node, vars[i++])
    );
    const state = state0.with_env(env);

    const value = cvalue(yield _push_expr(expr, state));
    if (!value.as_bool()) {
      console.log(subexprs);
      const report = subexprs
        .map((x, i) => `  - ${x.to_debug_text()}`)
        .join("\n");
      throw new ErrArbitrary(
        "assertion-failed",
        `${this.position.source_slice}\nWith values:\n${report}`
      );
    }
    return value;
  }
}
