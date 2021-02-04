export abstract class CrochetValue {
  abstract type: string;
  abstract equals(value: CrochetValue): boolean;
  abstract to_js(): any;
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
}

export class CrochetNothing extends CrochetValue {
  readonly type = "Nothing";

  equals(x: CrochetValue): boolean {
    return x instanceof CrochetNothing;
  }

  to_js() {
    return null;
  }
}

export class CrochetType extends CrochetValue {
  readonly type = "Type";

  constructor(readonly name: string) {
    super();
  }

  hasInstance(value: CrochetValue) {
    return (
      value === this || (value instanceof CrochetObject && value.klass === this)
    );
  }

  equals(x: CrochetValue): boolean {
    return x === this;
  }

  to_js() {
    return this;
  }
}

export class CrochetObject extends CrochetValue {
  readonly type = "Object";

  constructor(readonly klass: CrochetType) {
    super();
  }

  equals(x: CrochetValue): boolean {
    return x === this;
  }

  to_js() {
    return this;
  }
}

export class CrochetRecord extends CrochetValue {
  readonly type = "record";

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
    return this.values;
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
    return this.values;
  }
}

export const nothing = new CrochetNothing();
