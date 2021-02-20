import { Predicate } from "../logic";
import { bfalse, btrue, CrochetRecord, CrochetStream, CrochetText } from "../primitives";
import { Machine } from "../run";
import { Environment, World } from "../world";

export type Expression = EFalse | ETrue | EVariable | EText | ESearch;

interface IExpression {
  evaluate(world: World, env: Environment): Machine;
}

export class EFalse implements IExpression {
  async *evaluate(world: World, env: Environment) {
    return bfalse;
  }
}
export class ETrue implements IExpression {
  async *evaluate(world: World, env: Environment) {
    return btrue;
  }
}

export class EVariable implements IExpression {
  constructor(readonly name: string) {}

  async *evaluate(world: World, env: Environment) {
    const value = env.lookup(this.name);
    if (value == null) {
      throw new Error(`Undefined variable ${this.name}`);
    }

    return value;
  }
}

export class EText implements IExpression {
  constructor(readonly value: string) {}
  async *evaluate(world: World, env: Environment) {
    return new CrochetText(this.value);
  }
}

export class ESearch implements IExpression {
  constructor(readonly predicate: Predicate) {}
  async *evaluate(world: World, env: Environment) {
    const results = world.search(this.predicate);
    return new CrochetStream(results.map(x => new CrochetRecord(x.boundValues)));
  }
}