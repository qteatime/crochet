import { Bag } from "../../utils/bag";
import { cast } from "../../utils/utils";
import { ConcreteRelation } from "../logic";
import { bfalse, CrochetStream, CrochetValue } from "../primitives";
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

export type Statement =
  | SFact
  | SForget
  | SExpression
  | SLet
  | SGoto
  | SCall
  | SSimulate;

interface IStatement {
  evaluate(state: State): Machine;
}

export class SFact implements IStatement {
  constructor(readonly name: string, readonly exprs: Expression[]) {}
  async *evaluate(state: State): Machine {
    const relation = cast(
      state.world.database.lookup(this.name),
      ConcreteRelation
    );
    const values = avalue(
      yield _push(run_all(this.exprs.map((x) => x.evaluate(state))))
    );
    relation.tree.insert(values);
    return bfalse;
  }
}

export class SForget implements IStatement {
  constructor(readonly name: string, readonly exprs: Expression[]) {}
  async *evaluate(state: State): Machine {
    const relation = cast(
      state.world.database.lookup(this.name),
      ConcreteRelation
    );
    const values = avalue(
      yield _push(run_all(this.exprs.map((x) => x.evaluate(state))))
    );
    relation.tree.remove(values);
    return bfalse;
  }
}

export class SExpression implements IStatement {
  constructor(readonly expr: Expression) {}
  async *evaluate(state: State): Machine {
    const result = cvalue(yield _push(this.expr.evaluate(state)));
    return result;
  }
}

export class SLet implements IStatement {
  constructor(readonly name: string, readonly expr: Expression) {}

  async *evaluate(state: State): Machine {
    let value = cvalue(yield _push(this.expr.evaluate(state)));
    if (state.env.has(this.name)) {
      value = cvalue(yield _throw(new ErrVariableAlreadyBound(this.name)));
    }
    state.env.define(this.name, value);
    return value;
  }
}

export class SBlock implements IStatement {
  constructor(readonly statements: Statement[]) {}
  async *evaluate(state: State): Machine {
    let result: CrochetValue = bfalse;
    for (const stmt of this.statements) {
      result = cvalue(yield _push(stmt.evaluate(state)));
    }
    return result;
  }
}

export class SGoto implements IStatement {
  constructor(readonly name: string) {}

  async *evaluate(state: State): Machine {
    const scene = state.world.scenes.lookup(this.name);
    const machine = scene.evaluate(state);
    return yield _jump(machine);
  }
}

export class SCall implements IStatement {
  constructor(readonly name: string) {}

  async *evaluate(state: State): Machine {
    const scene = state.world.scenes.lookup(this.name);
    const machine = scene.evaluate(state);
    return yield _mark(scene.name, machine);
  }
}

export class SSimulate implements IStatement {
  constructor(
    readonly context: string | null,
    readonly actors: Expression,
    readonly goal: Goal
  ) {}

  async *evaluate(state: State): Machine {
    const actors = cast(
      yield _push(this.actors.evaluate(state)),
      CrochetStream
    );
    const context = this.lookup_context(state.world);
    const signals = new Bag<string, Signal>("signal");
    const simulation = new Simulation(
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
