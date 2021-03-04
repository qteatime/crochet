import { iter } from "../../utils";
import { cast, every, gen, zip } from "../../utils/utils";
import { Machine } from "../vm";
import { Environment } from "../world";
import {
  CrochetRole,
  CrochetType,
  TCrochetEnum,
  TCrochetPartial,
  TCrochetType,
  tFalse,
  tInteger,
  tInterpolation,
  tRecord,
  tStream,
  tText,
  tTrue,
  tUnknown,
} from "./types";

export abstract class CrochetValue {
  abstract type: CrochetType;
  abstract has_role(role: CrochetRole): boolean;
  abstract equals(other: CrochetValue): boolean;
  abstract as_bool(): boolean;
  abstract to_js(): any;
  abstract to_text(transparent?: boolean): string;
}

export class True extends CrochetValue {
  get type() {
    return tTrue;
  }

  has_role(role: CrochetRole): boolean {
    return false;
  }

  equals(other: CrochetValue): boolean {
    return !(other instanceof False);
  }

  as_bool() {
    return true;
  }

  to_js() {
    return true;
  }

  to_text() {
    return "true";
  }
}

export class False extends CrochetValue {
  get type() {
    return tFalse;
  }

  has_role(role: CrochetRole): boolean {
    return false;
  }

  equals(other: CrochetValue): boolean {
    return other instanceof False;
  }

  as_bool() {
    return false;
  }

  to_js() {
    return false;
  }

  to_text() {
    return "false";
  }
}

export class CrochetText extends CrochetValue {
  get type() {
    return tText;
  }

  constructor(readonly value: string) {
    super();
  }

  has_role(role: CrochetRole): boolean {
    return false;
  }

  equals(other: CrochetValue): boolean {
    return other instanceof CrochetText && other.value === this.value;
  }

  as_bool() {
    return true;
  }

  to_js() {
    return this.value;
  }

  to_text(transparent?: boolean) {
    if (transparent) {
      return this.value;
    } else {
      return `"${this.value.replace(/"/g, '\\"')}"`;
    }
  }
}

export class CrochetInteger extends CrochetValue {
  get type() {
    return tInteger;
  }

  constructor(readonly value: bigint) {
    super();
  }

  has_role(role: CrochetRole): boolean {
    return false;
  }

  equals(other: CrochetValue): boolean {
    return other instanceof CrochetInteger && other.value === this.value;
  }

  as_bool() {
    return true;
  }

  to_js() {
    return this.value;
  }

  to_text() {
    return this.value.toString();
  }
}

export class CrochetStream extends CrochetValue {
  get type() {
    return tStream;
  }

  constructor(readonly values: CrochetValue[]) {
    super();
  }

  has_role(role: CrochetRole): boolean {
    return false;
  }

  equals(other: CrochetValue): boolean {
    return (
      other instanceof CrochetStream &&
      other.values.length === this.values.length &&
      every(zip(other.values, this.values), ([a, b]) => a.equals(b))
    );
  }

  as_bool() {
    return this.values.length > 0;
  }

  to_js() {
    return this.values.map((x) => x.to_js());
  }

  to_text() {
    return `[${this.values.map((x) => x.to_text()).join(", ")}]`;
  }
}

export class CrochetRecord extends CrochetValue {
  get type() {
    return tRecord;
  }

  constructor(readonly values: Map<string, CrochetValue>) {
    super();
  }

  has_role(role: CrochetRole): boolean {
    return false;
  }

  equals(other: CrochetValue) {
    if (!(other instanceof CrochetRecord)) {
      return false;
    }
    const keys = new Set(this.values.keys());
    const other_keys = [...other.values.keys()];
    if (keys.size !== other_keys.length) {
      return false;
    }
    for (const key of other_keys) {
      if (!keys.has(key)) {
        return false;
      }
      if (!this.values.get(key)?.equals(other.values.get(key)!)) {
        return false;
      }
    }
    return true;
  }

  to_js() {
    const result = new Map();
    for (const [k, v] of this.values) {
      result.set(k, v.to_js());
    }
    return result;
  }

  as_bool() {
    return true;
  }

  to_text() {
    return `[${[...this.values.entries()]
      .map(([k, v]) => `${k} -> ${v.to_text()}`)
      .join(", ")}]`;
  }
}

export class CrochetInstance extends CrochetValue {
  constructor(readonly type: TCrochetType, readonly id: bigint) {
    super();
  }

  has_role(role: CrochetRole): boolean {
    return this.type.roles.has(role);
  }

  equals(other: CrochetValue): boolean {
    return <any>other === this;
  }

  as_bool(): boolean {
    return true;
  }

  to_js() {
    return this;
  }

  to_text() {
    return `<${this.type.type_name}#${this.id}>`;
  }
}

export class CrochetVariant extends CrochetValue {
  constructor(
    readonly type: TCrochetEnum,
    readonly tag: string,
    readonly roles: Set<CrochetRole>
  ) {
    super();
  }

  has_role(role: CrochetRole): boolean {
    return this.roles.has(role);
  }

  equals(other: CrochetValue): boolean {
    return (
      other instanceof CrochetVariant &&
      other.type === this.type &&
      other.tag === this.tag
    );
  }

  as_bool(): boolean {
    return true;
  }

  to_js() {
    return this;
  }

  to_text() {
    return `${this.type.type_name}.${this.tag}`;
  }
}

export class CrochetUnknown extends CrochetValue {
  get type() {
    return tUnknown;
  }

  constructor(readonly value: unknown) {
    super();
    if (value instanceof CrochetUnknown) {
      throw new Error(`internal: double-wrapping an unknown value`);
    }
  }

  has_role(role: CrochetRole): boolean {
    return false;
  }

  equals(other: CrochetValue): boolean {
    return other === this;
  }

  as_bool() {
    return true;
  }

  to_js() {
    if (this.value instanceof CrochetValue) {
      return this.value.to_js();
    } else {
      return this.value;
    }
  }

  to_text() {
    return `<unknown>`;
  }
}

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

  has_role(role: CrochetRole): boolean {
    return false;
  }

  equals(other: CrochetValue): boolean {
    return other === this;
  }

  as_bool(): boolean {
    return true;
  }
  to_js() {
    return this;
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
      throw new Error(`Invalid arity`);
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

export class CrochetInterpolation extends CrochetValue {
  constructor(readonly parts: InteprolationPart[]) {
    super();
  }

  get type() {
    return tInterpolation;
  }

  has_role(role: CrochetRole): boolean {
    return false;
  }

  equals(other: CrochetValue): boolean {
    return (
      other instanceof CrochetInterpolation &&
      iter(this.parts)
        .zip(gen(other.parts))
        .every(([x, y]) => x.equals(y))
    );
  }

  as_bool(): boolean {
    return true;
  }

  to_js() {
    return this;
  }

  to_text(transparent?: boolean): string {
    const text = this.parts.map((x) => x.to_text(true)).join("");
    if (transparent) {
      return text;
    } else {
      return `"${text}"`;
    }
  }
}

export abstract class InteprolationPart {
  abstract equals(other: InteprolationPart): boolean;
  abstract to_text(transparent?: boolean): string;
}

export class InterpolationStatic extends InteprolationPart {
  constructor(readonly text: string) {
    super();
  }
  equals(other: InteprolationPart): boolean {
    return other instanceof InterpolationStatic && other.text === this.text;
  }

  to_text() {
    return this.text;
  }
}

export class InterpolationDynamic extends InteprolationPart {
  constructor(readonly value: CrochetValue) {
    super();
  }
  equals(other: InteprolationPart): boolean {
    return (
      other instanceof InterpolationDynamic && other.value.equals(this.value)
    );
  }
  to_text(transparent?: boolean) {
    return this.value.to_text(transparent);
  }
}

export const btrue = new True();
export const bfalse = new False();
