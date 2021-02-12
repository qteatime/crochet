import { Operation } from "../ir/operations";
import { Activation, Environment } from "./environment";

export abstract class CrochetValue {
  abstract type: string;
  abstract equals(value: CrochetValue): boolean;
  abstract to_js(): any;
  abstract to_text(): any;
}

export class CrochetText extends CrochetValue {
  readonly type = "Text";

  constructor(readonly value: string) {
    super();
  }

  equals(x: CrochetValue): boolean {
    return x instanceof CrochetText && x.value === this.value;
  }

  to_js() {
    return this.value;
  }

  to_text() {
    return this.value;
  }
}

export class CrochetInteger extends CrochetValue {
  readonly type = "Integer";

  constructor(readonly value: bigint) {
    super();
  }

  equals(x: CrochetValue): boolean {
    return x instanceof CrochetInteger && x.value === this.value;
  }

  to_js() {
    return this.value;
  }

  to_text() {
    return this.value.toString();
  }
}

export class CrochetFloat extends CrochetValue {
  readonly type = "Float";

  constructor(readonly value: number) {
    super();
  }

  equals(x: CrochetValue): boolean {
    return x instanceof CrochetFloat && x.value === this.value;
  }

  to_js() {
    return this.value;
  }

  to_text() {
    return this.value.toString();
  }
}

export class CrochetBoolean extends CrochetValue {
  readonly type = "Boolean";

  constructor(readonly value: boolean) {
    super();
  }

  equals(x: CrochetValue): boolean {
    return x instanceof CrochetBoolean && x.value === this.value;
  }

  to_js() {
    return this.value;
  }

  to_text() {
    return this.value.toString();
  }
}

export class CrochetNothing extends CrochetValue {
  readonly type = "Nothing";

  equals(x: CrochetValue): boolean {
    return x instanceof CrochetNothing;
  }

  to_js() {
    return null;
  }

  to_text() {
    return "<nothing>";
  }
}

export class CrochetActor extends CrochetValue {
  readonly type = "Actor";

  constructor(readonly name: string, readonly roles: Set<string>) {
    super();
  }

  equals(x: CrochetValue): boolean {
    return x === this;
  }

  has_role(x: string): boolean {
    return this.roles.has(x);
  }

  to_js() {
    return this;
  }

  to_text() {
    return `#${this.name}`;
  }
}

export class CrochetRecord extends CrochetValue {
  readonly type = "Record";

  constructor(readonly values: Map<string, CrochetValue>) {
    super();
  }

  equals(x: CrochetValue): boolean {
    if (!(x instanceof CrochetRecord)) {
      return false;
    }
    const keys = new Set(this.values.keys());
    const other_keys = [...x.values.keys()];
    if (keys.size !== other_keys.length) {
      return false;
    }
    for (const key of other_keys) {
      if (!keys.has(key)) {
        return false;
      }
      if (!this.values.get(key)?.equals(x.values.get(key)!)) {
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

  to_text() {
    const pairs = [...this.values.entries()].map(
      ([k, v]) => `${k} => ${v.to_text()}`
    );
    return `{${pairs.join(", ")}}`;
  }
}

export class CrochetStream extends CrochetValue {
  readonly type = "stream";

  constructor(readonly values: CrochetValue[]) {
    super();
  }

  equals(x: CrochetValue): boolean {
    if (!(x instanceof CrochetStream)) {
      return false;
    }
    if (x.values.length !== this.values.length) {
      return false;
    }
    for (let i = 0; i < x.values.length; ++i) {
      if (!x.values[i].equals(this.values[i])) {
        return false;
      }
    }
    return true;
  }

  to_js() {
    return this.values.map((x) => x.to_js());
  }

  to_text() {
    return `[${this.values.map((x) => x.to_text()).join(", ")}]`;
  }
}

export class CrochetBlock extends CrochetValue {
  readonly type = "block";

  constructor(
    readonly env: Environment,
    readonly parameters: string[],
    readonly body: Operation[]
  ) {
    super();
  }

  equals(x: CrochetValue): boolean {
    return x === this;
  }

  to_js() {
    return this;
  }

  to_text() {
    return `<block {...}>`;
  }
}

export const nothing = new CrochetNothing();
