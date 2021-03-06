import { stat } from "fs";
import ts = require("typescript");
import { cast } from "../../utils/utils";
import { Predicate, UnificationEnvironment } from "../logic";
import {
  apply,
  CrochetInstance,
  CrochetInteger,
  CrochetInterpolation,
  CrochetPartial,
  CrochetRecord,
  CrochetStream,
  CrochetText,
  CrochetValue,
  False,
  InteprolationPart,
  InterpolationDynamic,
  InterpolationStatic,
  invoke,
  PartialConcrete,
  PartialHole,
  PartialValue,
  safe_cast,
  Selection,
  TAnyCrochetPartial,
  TCrochetStream,
  TCrochetType,
  True,
} from "../primitives";
import {
  avalue,
  cvalue,
  ErrNoConversionAvailable,
  ErrUndefinedVariable,
  ErrUnexpectedType,
  Machine,
  run_all,
  State,
  _push,
  _throw,
} from "../vm";
import { Environment } from "../world";
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
  | EGlobal
  | ESelf
  | EList
  | ERecord
  | ECast
  | EProject
  | EForall
  | EBlock
  | EPartial
  | EApplyPartial
  | EMatchSearch
  | ECondition;

interface IExpression {
  evaluate(state: State): Machine;
}

export class EFalse implements IExpression {
  async *evaluate(state: State): Machine {
    return False.instance;
  }
}
export class ETrue implements IExpression {
  async *evaluate(state: State): Machine {
    return True.instance;
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
  constructor(readonly name: string, readonly data: Expression[]) {}

  async *evaluate(state: State): Machine {
    const type = cast(state.world.types.lookup(this.name), TCrochetType);
    const values = avalue(
      yield _push(run_all(this.data.map((x) => x.evaluate(state))))
    );
    return type.instantiate(values);
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
    try {
      return object.projection.project(this.field);
    } catch (error) {
      return yield _throw(error);
    }
  }
}

export class EProjectMany implements IExpression {
  constructor(readonly object: Expression, readonly fields: Selection[]) {}

  async *evaluate(state: State): Machine {
    const object = cvalue(yield _push(this.object.evaluate(state)));
    try {
      return object.selection.select(this.fields);
    } catch (error) {
      return yield _throw(error);
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
      yield _push(safe_cast(stream0, TCrochetStream.type)),
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
    const fn = cast(
      yield _push(safe_cast(fn0, TAnyCrochetPartial.type)),
      CrochetPartial
    );
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

export class EInterpolate implements IExpression {
  constructor(readonly parts: EInterpolationPart[]) {}

  async *evaluate(state: State): Machine {
    const values = (yield _push(
      run_all(this.parts.map((x) => x.evaluate(state)))
    )) as InteprolationPart[];
    return new CrochetInterpolation(values);
  }
}

export type EInterpolationPart = EInterpolateStatic | EInterpolateDynamic;

export class EInterpolateStatic {
  constructor(readonly text: string) {}

  async *evaluate(state: State): Machine {
    return new InterpolationStatic(this.text);
  }
}

export class EInterpolateDynamic {
  constructor(readonly expr: Expression) {}

  async *evaluate(state: State): Machine {
    return new InterpolationDynamic(
      cvalue(yield _push(this.expr.evaluate(state)))
    );
  }
}

export class EMatchSearch implements IExpression {
  constructor(readonly cases: MatchSearchCase[]) {}

  async *evaluate(state: State): Machine {
    for (const kase of this.cases) {
      const results = kase.search(state);
      if (results.length !== 0) {
        const machines = results.map((uenv) => {
          const new_env = new Environment(state.env, state.env.raw_receiver);
          new_env.define_all(uenv.boundValues);
          const new_state = state.with_env(new_env);
          return kase.body.evaluate(new_state);
        });
        const values = avalue(yield _push(run_all(machines)));
        return new CrochetStream(values);
      }
    }
    return new CrochetStream([]);
  }
}
export class MatchSearchCase {
  constructor(readonly predicate: Predicate, readonly body: SBlock) {}

  search(state: State) {
    return state.world.search(this.predicate);
  }
}

export class ECondition implements IExpression {
  constructor(readonly cases: ConditionCase[]) {}

  async *evaluate(state: State): Machine {
    for (const kase of this.cases) {
      const valid = cvalue(yield _push(kase.test.evaluate(state)));
      if (valid.as_bool()) {
        return cvalue(yield _push(kase.body.evaluate(state)));
      }
    }
    return False.instance;
  }
}

export class ConditionCase {
  constructor(readonly test: Expression, readonly body: SBlock) {}
}
