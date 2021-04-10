import { cast, zip } from "../../utils/utils";
import { Expression, Meta } from "../ir";
import {
  cvalue,
  die,
  ErrInvalidArity,
  Machine,
  State,
  _mark,
  _push,
} from "../vm";
import { Environment } from "../world";
import { CrochetType, TCrochetAny, CrochetValue } from "./0-core";

export class CrochetPartial extends CrochetValue {
  readonly type: TCrochetPartial;

  constructor(
    readonly name: string,
    readonly env: Environment,
    readonly values: PartialValue[]
  ) {
    super();
    this.type = new TCrochetPartial(name, partial_holes(this.values));
  }

  equals(other: CrochetValue): boolean {
    return other === this;
  }

  to_text(): string {
    return `<partial ${this.name}>`;
  }

  merge(candidates: PartialValue[]) {
    const values = this.values.slice();
    let current_index = 0;
    let candidate_index = 0;

    while (
      candidate_index < candidates.length &&
      current_index < values.length
    ) {
      const candidate = candidates[candidate_index];
      const current = values[current_index];

      if (current instanceof PartialConcrete) {
        current_index += 1;
      } else if (current instanceof PartialHole) {
        values[current_index] = candidate;
        candidate_index += 1;
        current_index += 1;
      }
    }

    if (candidate_index < candidates.length) {
      throw die(`Invalid arity`);
    } else {
      return new CrochetPartial(this.name, this.env, values);
    }
  }

  get is_saturated() {
    return this.values.every((x) => x instanceof PartialConcrete);
  }

  get arity() {
    return partial_holes(this.values);
  }

  get concrete_args() {
    return this.values.map((x) => cast(x, PartialConcrete).value);
  }
}

export class TCrochetPartial extends CrochetType {
  get parent() {
    return TFunctionWithArity.for_arity(this.arity);
  }

  constructor(readonly name: string, readonly arity: number) {
    super();
  }

  get type_name() {
    return `<partial ${this.name}>`;
  }
}

export class CrochetLambda extends CrochetValue {
  constructor(
    readonly env: Environment,
    readonly parameters: string[],
    readonly body: Expression
  ) {
    super();
  }

  get arity() {
    return this.parameters.length;
  }

  get type() {
    return TFunctionWithArity.for_arity(this.parameters.length);
  }

  get full_name() {
    return `(anonymous function)`;
  }

  *apply(state0: State, args: CrochetValue[]): Machine {
    const env = this.env.clone();
    if (args.length !== this.parameters.length) {
      throw new Error(
        `invalid number of arguments ${args.length} for ${this.type.type_name}`
      );
    }
    for (const [k, v] of zip(this.parameters, args)) {
      env.define(k, v);
    }
    const state = state0.with_env(env);
    const machine = this.body.evaluate(state);
    const value = cvalue(yield _mark(this.full_name, machine));
    return value;
  }
}

export class TAnyFunction extends CrochetType {
  readonly parent = TCrochetAny.type;

  get type_name() {
    return "<function>";
  }

  static type = new TAnyFunction();
}

export class TFunctionWithArity extends CrochetType {
  constructor(readonly parent: CrochetType, readonly arity: number) {
    super();
  }

  get type_name() {
    const holes = Array.from({ length: this.arity }, () => "_");
    return `<function(${holes.join(", ")})>`;
  }

  static types = Array.from({ length: 10 }, (_, i) => i).map(
    (x) => new TFunctionWithArity(TAnyFunction.type, x)
  );

  static for_arity(n: number) {
    const type = TFunctionWithArity.types[n];
    if (type == null) {
      throw new Error(`Undefined arity ${n}`);
    }
    return type;
  }
}

export function partial_holes(values: PartialValue[]) {
  return values.filter((x) => x instanceof PartialHole).length;
}

export abstract class PartialValue {}
export class PartialHole extends PartialValue {}
export class PartialConcrete extends PartialValue {
  constructor(readonly value: CrochetValue) {
    super();
  }
}
