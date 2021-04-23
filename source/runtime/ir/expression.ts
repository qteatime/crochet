import { Meta } from "../../generated/crochet-grammar";
import { cast } from "../../utils/utils";
import { Predicate, UnificationEnvironment } from "../logic";
import {
  apply,
  apply_partial,
  CrochetFloat,
  CrochetInstance,
  CrochetInteger,
  CrochetInterpolation,
  CrochetLambda,
  CrochetPartial,
  CrochetRecord,
  CrochetTuple,
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
  TAnyFunction,
  TCrochetTuple,
  TCrochetType,
  True,
  CrochetNothing,
  get_string,
  CrochetStaticText,
} from "../primitives";
import {
  avalue,
  cvalue,
  ErrArbitrary,
  ErrNoConversionAvailable,
  ErrUndefinedVariable,
  ErrUnexpectedType,
  Machine,
  run_all,
  run_all_exprs,
  State,
  _push,
  _push_expr,
} from "../vm";
import { Environment } from "../world";
import { Metadata } from "./meta";
import { SBlock, Statement } from "./statement";
import { Type } from "./type";

export abstract class Expression {
  abstract evaluate(state: State): Machine;

  get sub_expressions(): Expression[] {
    return [];
  }

  map_subexpressions(f: (_: Expression) => Expression): Expression {
    return this;
  }

  abstract get position(): Metadata;
}

export class EFalse extends Expression {
  constructor(readonly position: Metadata) {
    super();
  }

  *evaluate(state: State): Machine {
    return False.instance;
  }
}
export class ETrue extends Expression {
  constructor(readonly position: Metadata) {
    super();
  }

  *evaluate(state: State): Machine {
    return True.instance;
  }
}

export class EVariable extends Expression {
  constructor(readonly position: Metadata, readonly name: string) {
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
  constructor(readonly position: Metadata, readonly value: string) {
    super();
  }

  *evaluate(state: State): Machine {
    return new CrochetStaticText(this.value);
  }
}

export class EInteger extends Expression {
  constructor(readonly position: Metadata, readonly value: bigint) {
    super();
  }

  *evaluate(state: State): Machine {
    return new CrochetInteger(this.value);
  }
}

export class ESearch extends Expression {
  constructor(readonly position: Metadata, readonly predicate: Predicate) {
    super();
  }

  *evaluate(state: State): Machine {
    const env = UnificationEnvironment.empty();
    const results = state.database.search(state, this.predicate, env);
    return new CrochetTuple(
      results.map((x) => new CrochetRecord(x.boundValues))
    );
  }
}

export class EInvoke extends Expression {
  constructor(
    readonly position: Metadata,
    readonly name: string,
    readonly args: Expression[]
  ) {
    super();
  }

  *evaluate(state: State): Machine {
    const args = avalue(yield _push(run_all_exprs(this.args, state)));
    return yield _push(invoke(state, this.name, args));
  }

  get sub_expressions() {
    return this.args;
  }

  map_subexpressions(f: (_: Expression) => Expression) {
    return new EInvoke(this.position, this.name, this.args.map(f));
  }
}

export class ENew extends Expression {
  constructor(
    readonly position: Metadata,
    readonly name: string,
    readonly data: Expression[]
  ) {
    super();
  }

  *evaluate(state: State): Machine {
    const type = cast(state.env.module.lookup_type(this.name), TCrochetType);
    if (!type.module) {
      throw new ErrArbitrary(
        "no-new-capability",
        `The type ${type.name} does not provide a support constructing it with 'new'.`
      );
    }
    if (!state.env.raw_module) {
      throw new ErrArbitrary(
        "no-new-capability",
        `Types can only be constructed in the context of a module.`
      );
    }
    if (type.module.pkg.name !== state.env.raw_module.pkg.name) {
      throw new ErrArbitrary(
        "no-new-capability",
        `The type ${
          type.type_name
        } can only be directly constructed from its declaring package (${
          type.module?.pkg.name ?? "no package"
        })`
      );
    }
    const values = avalue(yield _push(run_all_exprs(this.data, state)));
    return type.instantiate(values);
  }

  get sub_expressions() {
    return this.data;
  }
}

export class EGlobal extends Expression {
  constructor(readonly position: Metadata, readonly name: string) {
    super();
  }

  *evaluate(state: State): Machine {
    return state.env.module.lookup_value(this.name);
  }
}

export class ESelf extends Expression {
  constructor(readonly position: Metadata) {
    super();
  }

  *evaluate(state: State): Machine {
    return state.env.receiver;
  }
}

export class EList extends Expression {
  constructor(readonly position: Metadata, readonly values: Expression[]) {
    super();
  }

  *evaluate(state: State): Machine {
    const values = avalue(yield _push(run_all_exprs(this.values, state)));
    return new CrochetTuple(values);
  }

  get sub_expressions() {
    return this.values;
  }
}

export abstract class RecordField {
  get expression(): Expression {
    throw new Error(`Unsupported`);
  }
  get name(): string {
    throw new Error(`Unsupported`);
  }
  abstract is_static: boolean;
}
export class RFStatic extends RecordField {
  constructor(readonly _name: string) {
    super();
  }
  get is_static() {
    return true;
  }
  get name() {
    return this._name;
  }
}
export class RFDynamic extends RecordField {
  constructor(readonly value: Expression) {
    super();
  }
  get is_static() {
    return false;
  }
  get expression() {
    return this.value;
  }
}

export class ERecord extends Expression {
  constructor(
    readonly position: Metadata,
    readonly pairs: { key: RecordField; value: Expression }[]
  ) {
    super();
  }

  *evaluate(state: State): Machine {
    const map = new Map<string, CrochetValue>();
    for (const pair of this.pairs) {
      const key = pair.key.is_static
        ? pair.key.name
        : get_string(cvalue(yield _push_expr(pair.key.expression, state)));
      const value = cvalue(yield _push_expr(pair.value, state));
      map.set(key, value);
    }
    return new CrochetRecord(map);
  }

  get sub_expressions() {
    return this.pairs.map((x) => x.value);
  }
}

export class EProject extends Expression {
  constructor(
    readonly position: Metadata,
    readonly object: Expression,
    readonly field: RecordField
  ) {
    super();
  }

  *evaluate(state: State): Machine {
    const object = cvalue(yield _push_expr(this.object, state));
    const key = this.field.is_static
      ? this.field.name
      : get_string(cvalue(yield _push_expr(this.field.expression, state)));
    return object.projection.project(key, state.env.raw_module);
  }

  get sub_expressions() {
    return [this.object];
  }
}

export class EProjectMany extends Expression {
  constructor(
    readonly position: Metadata,
    readonly object: Expression,
    readonly fields: { key: RecordField; alias: RecordField }[]
  ) {
    super();
  }

  *evaluate(state: State): Machine {
    const object = cvalue(yield _push_expr(this.object, state));
    const fields = [];
    for (const field of this.fields) {
      const key = field.key.is_static
        ? field.key.name
        : get_string(cvalue(yield _push_expr(field.key.expression, state)));
      const alias = field.alias.is_static
        ? field.alias.name
        : get_string(cvalue(yield _push_expr(field.alias.expression, state)));
      fields.push({ key, alias });
    }
    return object.selection.select(fields, state.env.raw_module);
  }

  get sub_expressions() {
    return [this.object];
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
    const stream0 = cvalue(yield _push_expr(this.stream, state));
    const stream = cast(
      yield _push(safe_cast(stream0, TCrochetTuple.type)),
      CrochetTuple
    );
    for (const x of stream.values) {
      const env = state.env.clone();
      env.define(this.name, x);
      const newState = state.with_env(env);
      yield* this.body.evaluate(newState, results);
    }
    return CrochetNothing.instance;
  }
}

export class ForallDo extends ForallExpr {
  constructor(readonly body: Expression) {
    super();
  }

  *evaluate(state: State, results: CrochetValue[]): Machine {
    const value = cvalue(yield _push_expr(this.body, state));
    results.push(value);
    return CrochetNothing.instance;
  }
}

export class ForallIf extends ForallExpr {
  constructor(readonly condition: Expression, readonly body: ForallExpr) {
    super();
  }

  *evaluate(state: State, results: CrochetValue[]): Machine {
    const condition = cvalue(yield _push_expr(this.condition, state));
    if (condition.as_bool()) {
      yield* this.body.evaluate(state, results);
    }
    return CrochetNothing.instance;
  }
}

export class EForall extends Expression {
  constructor(readonly position: Metadata, readonly expr: ForallExpr) {
    super();
  }

  *evaluate(state: State): Machine {
    const results: CrochetValue[] = [];
    yield* this.expr.evaluate(state, results);
    return new CrochetTuple(results);
  }

  *evaluate_stream(state: State, expr: Expression) {}
}

export class EBlock extends Expression {
  constructor(readonly position: Metadata, readonly body: Statement[]) {
    super();
  }

  evaluate(state: State): Machine {
    return new SBlock(this.position, this.body).evaluate(state);
  }
}

export class EPartial extends Expression {
  constructor(
    readonly position: Metadata,
    readonly name: string,
    readonly values: PartialExpr[]
  ) {
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

export class EApply extends Expression {
  constructor(
    readonly position: Metadata,
    readonly partial: Expression,
    readonly values: PartialExpr[]
  ) {
    super();
  }

  *evaluate(state: State): Machine {
    const fn0 = cvalue(yield _push_expr(this.partial, state));
    const values0 = (yield _push(
      run_all(this.values.map((x) => x.evaluate(state)))
    )) as unknown[];
    const values = values0.map((x) => cast(x, PartialValue));

    if (fn0 instanceof CrochetPartial) {
      return yield _push(apply_partial(state, fn0, values));
    } else if (fn0 instanceof CrochetLambda) {
      const args = values.map((x) => cast(x, PartialConcrete).value);
      return yield _push(fn0.apply(state, args));
    } else {
      throw new ErrArbitrary("invalid-type", `Expected a function`);
    }
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
    const value = cvalue(yield _push_expr(this.expr, state));
    return new PartialConcrete(value);
  }
}

export class EInterpolate extends Expression {
  constructor(
    readonly position: Metadata,
    readonly parts: EInterpolationPart[]
  ) {
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
    return new InterpolationDynamic(cvalue(yield _push_expr(this.expr, state)));
  }
}

export class EMatchSearch extends Expression {
  constructor(readonly position: Metadata, readonly cases: MatchSearchCase[]) {
    super();
  }

  *evaluate(state: State): Machine {
    for (const kase of this.cases) {
      const results = kase.search(state);
      if (results.length !== 0) {
        const values = [];
        for (const uenv of results) {
          const new_env = state.env.clone();
          new_env.define_all(uenv.boundValues);
          const new_state = state.with_env(new_env);
          const result = cvalue(yield _push_expr(kase.body, new_state));
          values.push(result);
        }
        return new CrochetTuple(values);
      }
    }
    return new CrochetTuple([]);
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
  constructor(readonly position: Metadata, readonly cases: ConditionCase[]) {
    super();
  }

  *evaluate(state: State): Machine {
    for (const kase of this.cases) {
      const valid = cvalue(yield _push_expr(kase.test, state));
      if (valid.as_bool()) {
        return cvalue(yield _push_expr(kase.body, state));
      }
    }
    return CrochetNothing.instance;
  }
}

export class ConditionCase {
  constructor(readonly test: Expression, readonly body: SBlock) {}
}

export class EHasType extends Expression {
  constructor(
    readonly position: Metadata,
    readonly value: Expression,
    readonly type: Type
  ) {
    super();
  }

  *evaluate(state: State): Machine {
    const value = cvalue(yield _push_expr(this.value, state));
    const type = this.type.realise(state);
    return from_bool(type.accepts(value));
  }
}

export class ELazy extends Expression {
  constructor(readonly position: Metadata, readonly value: Expression) {
    super();
  }

  *evaluate(state: State): Machine {
    return new CrochetThunk(this.value, state.env);
  }
}

export class EForce extends Expression {
  constructor(readonly position: Metadata, readonly value: Expression) {
    super();
  }

  *evaluate(state: State): Machine {
    const value = cvalue(yield _push_expr(this.value, state));
    if (value instanceof CrochetThunk) {
      return cvalue(yield _push(value.force(state)));
    } else {
      return value;
    }
  }
}

export class EReturn extends Expression {
  constructor(readonly position: Metadata) {
    super();
  }

  *evaluate(state: State): Machine {
    return state.env.lookup("contract:return");
  }
}

export class EStaticType extends Expression {
  constructor(readonly position: Metadata, readonly type: Type) {
    super();
  }

  *evaluate(state: State): Machine {
    const type = this.type.realise(state);
    return type.static_type;
  }
}

export class EFloat extends Expression {
  constructor(readonly position: Metadata, readonly value: number) {
    super();
  }

  *evaluate(state: State): Machine {
    return new CrochetFloat(this.value);
  }
}

export class ELambda extends Expression {
  constructor(
    readonly position: Metadata,
    readonly parameters: string[],
    readonly body: Expression
  ) {
    super();
  }

  *evaluate(state: State): Machine {
    return new CrochetLambda(state.env, this.parameters, this.body);
  }
}

export class EIntrinsicEqual extends Expression {
  constructor(
    readonly position: Metadata,
    readonly left: Expression,
    readonly right: Expression
  ) {
    super();
  }

  *evaluate(state: State): Machine {
    const left = cvalue(yield _push_expr(this.left, state));
    const right = cvalue(yield _push_expr(this.right, state));
    return from_bool(left.equals(right));
  }

  get sub_expressions() {
    return [this.left, this.right];
  }

  map_subexpressions(f: (_: Expression) => Expression) {
    return new EIntrinsicEqual(this.position, f(this.left), f(this.right));
  }
}

export class ENothing extends Expression {
  constructor(readonly position: Metadata) {
    super();
  }

  *evaluate(state: State): Machine {
    return CrochetNothing.instance;
  }
}
