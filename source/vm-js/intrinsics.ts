export abstract class CrochetValue {
  abstract type: string;
  abstract equals(value: CrochetValue): boolean;
}

export class CrochetText extends CrochetValue {
  readonly type = "Text";

  constructor(readonly value: string) {
    super();
  }

  equals(x: CrochetValue): boolean {
    return x instanceof CrochetText && x.value === this.value;
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
}

export class CrochetFloat extends CrochetValue {
  readonly type = "Float";

  constructor(readonly value: number) {
    super();
  }

  equals(x: CrochetValue): boolean {
    return x instanceof CrochetFloat && x.value === this.value;
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
}

export class CrochetNothing extends CrochetValue {
  readonly type = "Nothing";

  equals(x: CrochetValue): boolean {
    return x instanceof CrochetNothing;
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
}

export class CrochetObject extends CrochetValue {
  readonly type = "Object";

  constructor(readonly klass: CrochetType) {
    super();
  }

  equals(x: CrochetValue): boolean {
    return x === this;
  }
}

export const nothing = new CrochetNothing();
