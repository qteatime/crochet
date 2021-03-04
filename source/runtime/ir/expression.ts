import ts = require("typescript");
import { cast } from "../../utils/utils";
import { Predicate } from "../logic";
import {
  apply,
  bfalse,
  btrue,
  CrochetInstance,
  CrochetInteger,
  CrochetPartial,
  CrochetRecord,
  CrochetStream,
  CrochetText,
  CrochetValue,
  invoke,
  PartialConcrete,
  PartialHole,
  PartialValue,
  partial_holes,
  Record,
  safe_cast,
  Stream,
  tAnyPartial,
  TCrochetEnum,
  TCrochetType,
  TCrochetUnion,
  tRecord,
  tStream,
} from "../primitives";
import { ProcedureBranch } from "../primitives/procedure";
import {
  avalue,
  cvalue,
  ErrInvalidArity,
  ErrNoBranchMatched,
  ErrNoConversionAvailable,
  ErrUndefinedVariable,
  ErrUnexpectedType,
  Machine,
  run_all,
  State,
  _push,
  _throw,
} from "../vm";
import { Environment, World } from "../world";
import { SBlock, Statement } from "./statement";
import { Type } from "./type";

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
  | EGlobal
  | ESelf
  | EList
  | ERecord
  | ECast
  | EProject
  | EForall
  | EBlock
  | EPartial
  | EApplyPartial;

interface IExpression {
  evaluate(state: State): Machine;
}

export class EFalse implements IExpression {
  async *evaluate(state: State): Machine {
    return bfalse;
  }
}
export class ETrue implements IExpression {
  async *evaluate(state: State): Machine {
    return btrue;
  }
}

export class EVariable implements IExpression {
  constructor(readonly name: string) {}

  async *evaluate(state: State): Machine {
    const value = state.env.lookup(this.name);
    if (value == null) {
      return cvalue(yield _throw(new ErrUndefinedVariable(this.name)));
    } else {
      return value;
    }
  }
}

export class EText implements IExpression {
  constructor(readonly value: string) {}
  async *evaluate(state: State): Machine {
    return new CrochetText(this.value);
  }
}

export class EInteger implements IExpression {
  constructor(readonly value: bigint) {}
  async *evaluate(state: State): Machine {
    return new CrochetInteger(this.value);
  }
}

export class ESearch implements IExpression {
  constructor(readonly predicate: Predicate) {}
  async *evaluate(state: State): Machine {
    const results = state.database.search(state, this.predicate);
    return new CrochetStream(
      results.map((x) => new CrochetRecord(x.boundValues))
    );
  }
}

export class EInvoke implements IExpression {
  constructor(readonly name: string, readonly args: Expression[]) {}

  async *evaluate(state: State): Machine {
    const args = avalue(
      yield _push(run_all(this.args.map((x) => x.evaluate(state))))
    );

    return yield _push(invoke(state, this.name, args));
  }
}

export class ENew implements IExpression {
  constructor(readonly name: string) {}

  async *evaluate(state: State) {
    const type = cast(state.world.types.lookup(this.name), TCrochetType);
    return type.instantiate();
  }
}

export class ENewVariant implements IExpression {
  constructor(readonly name: string, readonly variant: string) {}

  async *evaluate(state: State) {
    const type = cast(state.world.types.lookup(this.name), TCrochetEnum);
    return type.get_variant(this.variant);
  }
}

export class EGlobal implements IExpression {
  constructor(readonly name: string) {}

  async *evaluate(state: State) {
    return state.world.globals.lookup(this.name);
  }
}

export class ESelf implements IExpression {
  async *evaluate(state: State) {
    return state.env.receiver;
  }
}

export class EList implements IExpression {
  constructor(readonly values: Expression[]) {}

  async *evaluate(state: State): Machine {
    const values = avalue(
      yield _push(run_all(this.values.map((x) => x.evaluate(state))))
    );
    return new CrochetStream(values);
  }
}

export class ERecord implements IExpression {
  constructor(readonly pairs: { key: string; value: Expression }[]) {}
  async *evaluate(state: State): Machine {
    const map = new Map<string, CrochetValue>();
    for (const pair of this.pairs) {
      const value = cvalue(yield _push(pair.value.evaluate(state)));
      map.set(pair.key, value);
    }
    return new CrochetRecord(map);
  }
}

export class ECast implements IExpression {
  constructor(readonly type: Type, readonly value: Expression) {}

  async *evaluate(state: State): Machine {
    const type = this.type.realise(state.world);
    const value0 = cvalue(yield _push(this.value.evaluate(state)));
    const value = type.coerce(value0);
    if (value != null) {
      return value;
    } else {
      return yield _throw(new ErrNoConversionAvailable(type, value0));
    }
  }
}

export class EProject implements IExpression {
  constructor(readonly object: Expression, readonly field: string) {}

  async *evaluate(state: State): Machine {
    const object = cvalue(yield _push(this.object.evaluate(state)));
    if (object instanceof CrochetRecord) {
      return yield _push(Record.at_m(state, object, this.field));
    } else if (object instanceof CrochetStream) {
      return yield _push(Stream.project(state, object, this.field));
    } else {
      return _throw(
        new ErrUnexpectedType(new TCrochetUnion(tRecord, tStream), object)
      );
    }
  }
}

type Projection = { key: string; alias: string };

export class EProjectMany implements IExpression {
  constructor(readonly object: Expression, readonly fields: Projection[]) {}

  async *evaluate(state: State): Machine {
    const object = cvalue(yield _push(this.object.evaluate(state)));
    if (object instanceof CrochetRecord) {
      return yield _push(Record.select(state, object, this.fields));
    } else if (object instanceof CrochetStream) {
      return yield _push(Stream.select(state, object, this.fields));
    } else {
      return _throw(
        new ErrUnexpectedType(new TCrochetUnion(tRecord, tStream), object)
      );
    }
  }
}

export class EForall implements IExpression {
  constructor(
    readonly stream: Expression,
    readonly name: string,
    readonly code: Expression
  ) {}

  async *evaluate(state: State): Machine {
    const stream0 = cvalue(yield _push(this.stream.evaluate(state)));
    const stream = cast(
      yield _push(safe_cast(stream0, tStream)),
      CrochetStream
    );
    const results: CrochetValue[] = [];
    for (const x of stream.values) {
      const env = new Environment(state.env, state.env.raw_receiver);
      env.define(this.name, x);
      const value = cvalue(
        yield _push(this.code.evaluate(state.with_env(env)))
      );
      results.push(value);
    }
    return new CrochetStream(results);
  }
}

export class EBlock implements IExpression {
  constructor(readonly body: Statement[]) {}

  evaluate(state: State): Machine {
    return new SBlock(this.body).evaluate(state);
  }
}

export class EPartial implements IExpression {
  constructor(readonly name: string, readonly values: PartialExpr[]) {}

  async *evaluate(state: State): Machine {
    const values = (yield _push(
      run_all(this.values.map((x) => x.evaluate(state)))
    )) as unknown[];
    return new CrochetPartial(
      this.name,
      state.env,
      values.map((x) => cast(x, PartialValue))
    );
  }
}

export class EApplyPartial implements IExpression {
  constructor(readonly partial: Expression, readonly values: PartialExpr[]) {}

  async *evaluate(state: State): Machine {
    const fn0 = cvalue(yield _push(this.partial.evaluate(state)));
    const fn = cast(yield _push(safe_cast(fn0, tAnyPartial)), CrochetPartial);
    const values0 = (yield _push(
      run_all(this.values.map((x) => x.evaluate(state)))
    )) as unknown[];
    const values = values0.map((x) => cast(x, PartialValue));

    return yield _push(apply(state, fn, values));
  }
}

export type PartialExpr = EPartialHole | EPartialConcrete;

interface IPartialExpr {
  evaluate(state: State): Machine;
}

export class EPartialHole implements IPartialExpr {
  async *evaluate(state: State): Machine {
    return new PartialHole();
  }
}

export class EPartialConcrete implements IPartialExpr {
  constructor(readonly expr: Expression) {}

  async *evaluate(state: State): Machine {
    const value = cvalue(yield _push(this.expr.evaluate(state)));
    return new PartialConcrete(value);
  }
}
