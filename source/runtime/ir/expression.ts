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
  CrochetThunk,
  CrochetValue,
  False,
  from_bool,
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
} from "../vm";
import { Environment } from "../world";
import { SBlock, Statement } from "./statement";
import { Type } from "./type";

export abstract class Expression {
  abstract evaluate(state: State): Machine;
}

export class EFalse extends Expression {
  *evaluate(state: State): Machine {
    return False.instance;
  }
}
export class ETrue extends Expression {
  *evaluate(state: State): Machine {
    return True.instance;
  }
}

export class EVariable extends Expression {
  constructor(readonly name: string) {
    super();
  }

  *evaluate(state: State): Machine {
    const value = state.env.try_lookup(this.name);
    if (value == null) {
      throw new ErrUndefinedVariable(this.name);
    } else {
      return value;
    }
  }
}

export class EText extends Expression {
  constructor(readonly value: string) {
    super();
  }

  *evaluate(state: State): Machine {
    return new CrochetText(this.value);
  }
}

export class EInteger extends Expression {
  constructor(readonly value: bigint) {
    super();
  }

  *evaluate(state: State): Machine {
    return new CrochetInteger(this.value);
  }
}

export class ESearch extends Expression {
  constructor(readonly predicate: Predicate) {
    super();
  }

  *evaluate(state: State): Machine {
    const env = UnificationEnvironment.empty();
    const results = state.database.search(state, this.predicate, env);
    return new CrochetStream(
      results.map((x) => new CrochetRecord(x.boundValues))
    );
  }
}

export class EInvoke extends Expression {
  constructor(readonly name: string, readonly args: Expression[]) {
    super();
  }

  *evaluate(state: State): Machine {
    const args = avalue(
      yield _push(run_all(this.args.map((x) => x.evaluate(state))))
    );

    return yield _push(invoke(state, this.name, args));
  }
}

export class ENew extends Expression {
  constructor(readonly name: string, readonly data: Expression[]) {
    super();
  }

  *evaluate(state: State): Machine {
    const type = cast(state.world.types.lookup(this.name), TCrochetType);
    const values = avalue(
      yield _push(run_all(this.data.map((x) => x.evaluate(state))))
    );
    return type.instantiate(values);
  }
}

export class EGlobal extends Expression {
  constructor(readonly name: string) {
    super();
  }

  *evaluate(state: State) {
    return state.world.globals.lookup(this.name);
  }
}

export class ESelf extends Expression {
  *evaluate(state: State) {
    return state.env.receiver;
  }
}

export class EList extends Expression {
  constructor(readonly values: Expression[]) {
    super();
  }

  *evaluate(state: State): Machine {
    const values = avalue(
      yield _push(run_all(this.values.map((x) => x.evaluate(state))))
    );
    return new CrochetStream(values);
  }
}

export class ERecord extends Expression {
  constructor(readonly pairs: { key: string; value: Expression }[]) {
    super();
  }

  *evaluate(state: State): Machine {
    const map = new Map<string, CrochetValue>();
    for (const pair of this.pairs) {
      const value = cvalue(yield _push(pair.value.evaluate(state)));
      map.set(pair.key, value);
    }
    return new CrochetRecord(map);
  }
}

export class ECast extends Expression {
  constructor(readonly type: Type, readonly value: Expression) {
    super();
  }

  *evaluate(state: State): Machine {
    const type = this.type.realise(state.world);
    const value0 = cvalue(yield _push(this.value.evaluate(state)));
    const value = type.coerce(value0);
    if (value != null) {
      return value;
    } else {
      throw new ErrNoConversionAvailable(type, value0);
    }
  }
}

export class EProject extends Expression {
  constructor(readonly object: Expression, readonly field: string) {
    super();
  }

  *evaluate(state: State): Machine {
    const object = cvalue(yield _push(this.object.evaluate(state)));
    return object.projection.project(this.field);
  }
}

export class EProjectMany extends Expression {
  constructor(readonly object: Expression, readonly fields: Selection[]) {
    super();
  }

  *evaluate(state: State): Machine {
    const object = cvalue(yield _push(this.object.evaluate(state)));
    return object.selection.select(this.fields);
  }
}

export abstract class ForallExpr {
  abstract evaluate(state: State, results: CrochetValue[]): Machine;
}

export class ForallMap extends ForallExpr {
  constructor(
    readonly name: string,
    readonly stream: Expression,
    readonly body: ForallExpr
  ) {
    super();
  }

  *evaluate(state: State, results: CrochetValue[]): Machine {
    const stream0 = cvalue(yield _push(this.stream.evaluate(state)));
    const stream = cast(
      yield _push(safe_cast(stream0, TCrochetStream.type)),
      CrochetStream
    );
    for (const x of stream.values) {
      const env = state.env.clone();
      env.define(this.name, x);
      const newState = state.with_env(env);
      yield* this.body.evaluate(newState, results);
    }
    return False.instance;
  }
}

export class ForallDo extends ForallExpr {
  constructor(readonly body: Expression) {
    super();
  }

  *evaluate(state: State, results: CrochetValue[]): Machine {
    const value = cvalue(yield _push(this.body.evaluate(state)));
    results.push(value);
    return False.instance;
  }
}

export class ForallIf extends ForallExpr {
  constructor(readonly condition: Expression, readonly body: ForallExpr) {
    super();
  }

  *evaluate(state: State, results: CrochetValue[]): Machine {
    const condition = cvalue(yield _push(this.condition.evaluate(state)));
    if (condition.as_bool()) {
      yield* this.body.evaluate(state, results);
    }
    return False.instance;
  }
}

export class EForall extends Expression {
  constructor(readonly expr: ForallExpr) {
    super();
  }

  *evaluate(state: State): Machine {
    const results: CrochetValue[] = [];
    yield* this.expr.evaluate(state, results);
    return new CrochetStream(results);
  }

  *evaluate_stream(state: State, expr: Expression) {}
}

export class EBlock extends Expression {
  constructor(readonly body: Statement[]) {
    super();
  }

  evaluate(state: State): Machine {
    return new SBlock(this.body).evaluate(state);
  }
}

export class EPartial extends Expression {
  constructor(readonly name: string, readonly values: PartialExpr[]) {
    super();
  }

  *evaluate(state: State): Machine {
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

export class EApplyPartial extends Expression {
  constructor(readonly partial: Expression, readonly values: PartialExpr[]) {
    super();
  }

  *evaluate(state: State): Machine {
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

export abstract class PartialExpr {
  abstract evaluate(state: State): Machine;
}

export class EPartialHole extends PartialExpr {
  *evaluate(state: State): Machine {
    return new PartialHole();
  }
}

export class EPartialConcrete extends PartialExpr {
  constructor(readonly expr: Expression) {
    super();
  }

  *evaluate(state: State): Machine {
    const value = cvalue(yield _push(this.expr.evaluate(state)));
    return new PartialConcrete(value);
  }
}

export class EInterpolate extends Expression {
  constructor(readonly parts: EInterpolationPart[]) {
    super();
  }

  *evaluate(state: State): Machine {
    const values = (yield _push(
      run_all(this.parts.map((x) => x.evaluate(state)))
    )) as InteprolationPart[];
    return new CrochetInterpolation(values);
  }
}

export type EInterpolationPart = EInterpolateStatic | EInterpolateDynamic;

export class EInterpolateStatic {
  constructor(readonly text: string) {}

  *evaluate(state: State): Machine {
    return new InterpolationStatic(this.text);
  }
}

export class EInterpolateDynamic {
  constructor(readonly expr: Expression) {}

  *evaluate(state: State): Machine {
    return new InterpolationDynamic(
      cvalue(yield _push(this.expr.evaluate(state)))
    );
  }
}

export class EMatchSearch extends Expression {
  constructor(readonly cases: MatchSearchCase[]) {
    super();
  }

  *evaluate(state: State): Machine {
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
    const env = UnificationEnvironment.empty();
    return state.database.search(state, this.predicate, env);
  }
}

export class ECondition extends Expression {
  constructor(readonly cases: ConditionCase[]) {
    super();
  }

  *evaluate(state: State): Machine {
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

export class EHasType extends Expression {
  constructor(readonly value: Expression, readonly type: Type) {
    super();
  }

  *evaluate(state: State): Machine {
    const value = cvalue(yield _push(this.value.evaluate(state)));
    const type = this.type.realise(state.world);
    return from_bool(type.accepts(value));
  }
}

export class EHasRole extends Expression {
  constructor(readonly value: Expression, readonly role: string) {
    super();
  }

  *evaluate(state: State): Machine {
    const value = cvalue(yield _push(this.value.evaluate(state)));
    const role = state.world.roles.lookup(this.role);
    return from_bool(value.has_role(role));
  }
}

export class ELazy extends Expression {
  constructor(readonly value: Expression) {
    super();
  }

  *evaluate(state: State): Machine {
    return new CrochetThunk(this.value, state.env);
  }
}

export class EForce extends Expression {
  constructor(readonly value: Expression) {
    super();
  }

  *evaluate(state: State): Machine {
    const value = cvalue(yield _push(this.value.evaluate(state)));
    if (value instanceof CrochetThunk) {
      return cvalue(yield _push(value.force(state)));
    } else {
      return value;
    }
  }
}
