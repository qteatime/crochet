import { bfalse, CrochetStream } from "../primitives";
import { Machine, run_all, _push, _return } from "../run";
import { Environment, World } from "../world";
import { Expression } from "./expression";

export type Statement = SFact | SForget | SExpression | SReturn;

interface IStatement {
  evaluate(world: World, env: Environment): Machine;
}

export class SFact implements IStatement {
  constructor(readonly name: string, readonly exprs: Expression[]) {}
  async *evaluate(world: World, env: Environment) {
    const relation = world.get_relation(this.name);
    const values: CrochetStream = yield _push(run_all(this.exprs.map(x => x.evaluate(world, env))));
    relation.insert(values.values);
    return bfalse;
  }
}

export class SForget implements IStatement {
  constructor(readonly name: string, readonly exprs: Expression[]) {}
  async *evaluate(world: World, env: Environment) {
    const relation = world.get_relation(this.name);
    const values: CrochetStream = yield _push(run_all(this.exprs.map(x => x.evaluate(world, env))));
    relation.remove(values.values);
    return bfalse;
  }
}

export class SExpression implements IStatement {
  constructor(readonly expr: Expression) {}
  async *evaluate(world: World, env: Environment) {
    const result = yield _push(this.expr.evaluate(world, env));
    return result;
  }
}

export class SReturn implements IStatement {
  constructor(readonly expr: Expression) {}
  async *evaluate(world: World, env: Environment) {
    const value = yield _push(this.expr.evaluate(world, env));
    yield _return(value);
    return bfalse;
  }
}

export class SBlock implements IStatement {
  constructor(readonly statements: Statement[]) {}
  async *evaluate(world: World, env: Environment) {
    for (const stmt of this.statements) {
      yield _push(stmt.evaluate(world, env));
    }
    return bfalse;
  }
}
