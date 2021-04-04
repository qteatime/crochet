import { cast } from "../../utils/utils";
import { die } from "../vm";
import { Environment } from "../world";
import { CrochetType, TCrochetAny, CrochetValue } from "./core";

export class CrochetPartial extends CrochetValue {
  readonly type: TCrochetPartial;

  constructor(
    readonly name: string,
    readonly env: Environment,
    readonly values: PartialValue[]
  ) {
    super();
    this.type = new TCrochetPartial(name);
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
    return TAnyCrochetPartial.type;
  }

  constructor(readonly name: string) {
    super();
  }

  get type_name() {
    return `<partial ${this.name}>`;
  }
}

export class TAnyCrochetPartial extends CrochetType {
  readonly parent = TCrochetAny.type;

  get type_name() {
    return "<partial>";
  }

  static type = new TAnyCrochetPartial();
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
