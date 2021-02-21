import { Predicate } from "../logic";
import {
  bfalse,
  btrue,
  CrochetRecord,
  CrochetStream,
  CrochetText,
} from "../primitives";
import { ProcedureBranch } from "../primitives/procedure";
import {
  ErrNoBranchMatched,
  ErrUndefinedVariable,
  Machine,
  run_all,
  _push,
  _throw,
} from "../run";
import { Environment, World } from "../world";

export type Expression = EFalse | ETrue | EVariable | EText | ESearch | EInvoke;

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
      return yield _throw(new ErrUndefinedVariable(this.name));
    } else {
      return value;
    }
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
    return new CrochetStream(
      results.map((x) => new CrochetRecord(x.boundValues))
    );
  }
}

export class EInvoke implements IExpression {
  constructor(readonly name: string, readonly args: Expression[]) {}
  async *evaluate(world: World, env: Environment): Machine {
    const args0 = (yield _push(
      run_all(this.args.map((x) => x.evaluate(world, env)))
    )) as CrochetStream;
    const args = args0.values;

    const procedure = world.get_procedure(this.name);
    const branch0 = procedure.select(args);
    let branch: ProcedureBranch;
    if (branch0 == null) {
      branch = (yield _throw(new ErrNoBranchMatched(procedure, args))) as any;
    } else {
      branch = branch0;
    }
    const result = yield _push(branch.procedure.invoke(world, env, args));
    return result;
  }
}
