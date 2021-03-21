import { Bag } from "../../utils/bag";
import { cast } from "../../utils/utils";
import { ConcreteRelation } from "../logic";
import {
  CrochetInstance,
  CrochetStream,
  CrochetValue,
  False,
} from "../primitives";
import {
  avalue,
  cvalue,
  ErrVariableAlreadyBound,
  Machine,
  run_all,
  State,
  _jump,
  _mark,
  _push,
  _throw,
} from "../vm";
import { Goal, Signal, Simulation } from "../simulation";
import { Environment, World } from "../world";
import { Expression } from "./expression";
import { Type } from "./type";

export abstract class Statement {
  abstract evaluate(state: State): Machine;
}

export class SFact extends Statement {
  constructor(readonly name: string, readonly exprs: Expression[]) {
    super();
  }
  async *evaluate(state: State): Machine {
    const relation = cast(
      state.world.database.lookup(this.name),
      ConcreteRelation
    );
    const values = avalue(
      yield _push(run_all(this.exprs.map((x) => x.evaluate(state))))
    );
    relation.tree.insert(values);
    return False.instance;
  }
}

export class SForget extends Statement {
  constructor(readonly name: string, readonly exprs: Expression[]) {
    super();
  }
  async *evaluate(state: State): Machine {
    const relation = cast(
      state.world.database.lookup(this.name),
      ConcreteRelation
    );
    const values = avalue(
      yield _push(run_all(this.exprs.map((x) => x.evaluate(state))))
    );
    relation.tree.remove(values);
    return False.instance;
  }
}

export class SExpression extends Statement {
  constructor(readonly expr: Expression) {
    super();
  }
  async *evaluate(state: State): Machine {
    const result = cvalue(yield _push(this.expr.evaluate(state)));
    return result;
  }
}

export class SLet extends Statement {
  constructor(readonly name: string, readonly expr: Expression) {
    super();
  }

  async *evaluate(state: State): Machine {
    let value = cvalue(yield _push(this.expr.evaluate(state)));
    if (state.env.has(this.name)) {
      value = cvalue(yield _throw(new ErrVariableAlreadyBound(this.name)));
    }
    state.env.define(this.name, value);
    return value;
  }
}

export class SBlock extends Statement {
  constructor(readonly statements: Statement[]) {
    super();
  }
  async *evaluate(state: State): Machine {
    let result: CrochetValue = False.instance;
    for (const stmt of this.statements) {
      result = cvalue(yield _push(stmt.evaluate(state)));
    }
    return result;
  }
}

export class SGoto extends Statement {
  constructor(readonly name: string) {
    super();
  }

  async *evaluate(state: State): Machine {
    const scene = state.world.scenes.lookup(this.name);
    const machine = scene.evaluate(state);
    return yield _jump(machine);
  }
}

export class SCall extends Statement {
  constructor(readonly name: string) {
    super();
  }

  async *evaluate(state: State): Machine {
    const scene = state.world.scenes.lookup(this.name);
    const machine = scene.evaluate(state);
    return yield _push(machine);
  }
}

export class SSimulate extends Statement {
  constructor(
    readonly context: string | null,
    readonly actors: Expression,
    readonly goal: Goal,
    readonly signals: Signal[]
  ) {
    super();
  }

  async *evaluate(state: State): Machine {
    const actors = cast(
      yield _push(this.actors.evaluate(state)),
      CrochetStream
    );
    const context = this.lookup_context(state.world);
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

  lookup_context(world: World) {
    if (this.context == null) {
      return world.global_context;
    } else {
      return world.contexts.lookup(this.context);
    }
  }
}

export class SRegister extends Statement {
  constructor(readonly expr: Expression) {
    super();
  }

  async *evaluate(state: State): Machine {
    const value0 = cvalue(yield _push(this.expr.evaluate(state)));
    const value = cast(value0, CrochetInstance);
    value.type.register_instance(value);
    return value;
  }
}
