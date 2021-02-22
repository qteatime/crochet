import { cast } from "../../utils/utils";
import { ConcreteRelation } from "../logic";
import { bfalse, CrochetStream, CrochetValue } from "../primitives";
import {
  avalue,
  cvalue,
  ErrVariableAlreadyBound,
  Machine,
  run_all,
  _mark,
  _push,
  _throw,
} from "../run";
import { Environment, World } from "../world";
import { Expression } from "./expression";

export type Statement = SFact | SForget | SExpression | SLet;

interface IStatement {
  evaluate(world: World, env: Environment): Machine;
}

export class SFact implements IStatement {
  constructor(readonly name: string, readonly exprs: Expression[]) {}
  async *evaluate(world: World, env: Environment): Machine {
    const relation = cast(world.database.lookup(this.name), ConcreteRelation);
    const values = avalue(
      yield _push(run_all(this.exprs.map((x) => x.evaluate(world, env))))
    );
    relation.tree.insert(values);
    return bfalse;
  }
}

export class SForget implements IStatement {
  constructor(readonly name: string, readonly exprs: Expression[]) {}
  async *evaluate(world: World, env: Environment): Machine {
    const relation = cast(world.database.lookup(this.name), ConcreteRelation);
    const values = avalue(
      yield _push(run_all(this.exprs.map((x) => x.evaluate(world, env))))
    );
    relation.tree.remove(values);
    return bfalse;
  }
}

export class SExpression implements IStatement {
  constructor(readonly expr: Expression) {}
  async *evaluate(world: World, env: Environment): Machine {
    const result = cvalue(yield _push(this.expr.evaluate(world, env)));
    return result;
  }
}

export class SLet implements IStatement {
  constructor(readonly name: string, readonly expr: Expression) {}

  async *evaluate(world: World, env: Environment): Machine {
    let value = cvalue(yield _push(this.expr.evaluate(world, env)));
    if (env.has(this.name)) {
      value = cvalue(yield _throw(new ErrVariableAlreadyBound(this.name)));
    }
    env.define(this.name, value);
    return value;
  }
}

export class SBlock implements IStatement {
  constructor(readonly statements: Statement[]) {}
  async *evaluate(world: World, env: Environment) {
    let result: CrochetValue = bfalse;
    for (const stmt of this.statements) {
      result = cvalue(yield _push(stmt.evaluate(world, env)));
    }
    return result;
  }
}
