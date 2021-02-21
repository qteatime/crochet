import { every, zip } from "../../utils/utils";

export abstract class CrochetValue {
  abstract type_name: string;
  abstract equals(other: CrochetValue): boolean;
  abstract as_bool(): boolean;
  abstract to_js(): any;
}

export type CrochetType =
  | typeof True
  | typeof False
  | typeof CrochetText
  | typeof CrochetRecord
  | typeof CrochetStream;

export class True extends CrochetValue {
  get type_name() {
    return "True";
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
}

export class False extends CrochetValue {
  get type_name() {
    return "False";
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
}

export class CrochetText extends CrochetValue {
  get type_name() {
    return "Text";
  }

  constructor(readonly value: string) {
    super();
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
}

export class CrochetStream extends CrochetValue {
  get type_name() {
    return "Stream";
  }

  constructor(readonly values: CrochetValue[]) {
    super();
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
}

export class CrochetRecord extends CrochetValue {
  get type_name() {
    return "Record";
  }

  constructor(readonly values: Map<string, CrochetValue>) {
    super();
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
}

export const btrue = new True();
export const bfalse = new False();
