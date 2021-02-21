import { cast } from "../../utils/utils";
import { Predicate } from "../logic";
import {
  bfalse,
  btrue,
  CrochetInstance,
  CrochetInteger,
  CrochetRecord,
  CrochetStream,
  CrochetText,
  CrochetVariant,
  TCrochetEnum,
  TCrochetType,
  TCrochetUnion,
} from "../primitives";
import { ProcedureBranch } from "../primitives/procedure";
import {
  avalue,
  cvalue,
  ErrNoBranchMatched,
  ErrUndefinedVariable,
  Machine,
  run_all,
  _push,
  _throw,
} from "../run";
import { Environment, World } from "../world";

export type Expression =
  | EFalse
  | ETrue
  | EVariable
  | EText
  | EInteger
  | ESearch
  | EInvoke
  | ENew
  | ENewVariant
  | EGlobal;

interface IExpression {
  evaluate(world: World, env: Environment): Machine;
}

export class EFalse implements IExpression {
  async *evaluate(world: World, env: Environment): Machine {
    return bfalse;
  }
}
export class ETrue implements IExpression {
  async *evaluate(world: World, env: Environment): Machine {
    return btrue;
  }
}

export class EVariable implements IExpression {
  constructor(readonly name: string) {}

  async *evaluate(world: World, env: Environment): Machine {
    const value = env.lookup(this.name);
    if (value == null) {
      return cvalue(yield _throw(new ErrUndefinedVariable(this.name)));
    } else {
      return value;
    }
  }
}

export class EText implements IExpression {
  constructor(readonly value: string) {}
  async *evaluate(world: World, env: Environment): Machine {
    return new CrochetText(this.value);
  }
}

export class EInteger implements IExpression {
  constructor(readonly value: bigint) {}
  async *evaluate(world: World, env: Environment): Machine {
    return new CrochetInteger(this.value);
  }
}

export class ESearch implements IExpression {
  constructor(readonly predicate: Predicate) {}
  async *evaluate(world: World, env: Environment): Machine {
    const results = world.search(this.predicate);
    return new CrochetStream(
      results.map((x) => new CrochetRecord(x.boundValues))
    );
  }
}

export class EInvoke implements IExpression {
  constructor(readonly name: string, readonly args: Expression[]) {}
  async *evaluate(world: World, env: Environment): Machine {
    const args = avalue(
      yield _push(run_all(this.args.map((x) => x.evaluate(world, env))))
    );

    const procedure = world.get_procedure(this.name);
    const branch0 = procedure.select(args);
    let branch: ProcedureBranch;
    if (branch0 == null) {
      branch = cast(
        yield _throw(new ErrNoBranchMatched(procedure, args)),
        ProcedureBranch
      );
    } else {
      branch = branch0;
    }
    const result = cvalue(
      yield _push(branch.procedure.invoke(world, env, args))
    );
    return result;
  }
}

export class ENew implements IExpression {
  constructor(readonly name: string) {}

  async *evaluate(world: World, env: Environment) {
    const type = cast(world.get_type(this.name), TCrochetType);
    return new CrochetInstance(type);
  }
}

export class ENewVariant implements IExpression {
  constructor(readonly name: string, readonly variant: string) {}

  async *evaluate(world: World, env: Environment) {
    const type = cast(world.get_type(this.name), TCrochetEnum);
    return type.get_variant(this.variant);
  }
}

export class EGlobal implements IExpression {
  constructor(readonly name: string) {}

  async *evaluate(world: World, env: Environment) {
    return world.get_global(this.name);
  }
}
