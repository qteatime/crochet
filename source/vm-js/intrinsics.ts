export abstract class CrochetValue {
  abstract type: string;
}

export class CrochetText extends CrochetValue {
  readonly type = "Text";

  constructor(readonly value: string) {
    super();
  }
}

export class CrochetInteger extends CrochetValue {
  readonly type = "Integer";

  constructor(readonly value: bigint) {
    super();
  }
}

export class CrochetFloat extends CrochetValue {
  readonly type = "Float";

  constructor(readonly value: number) {
    super();
  }
}

export class CrochetBoolean extends CrochetValue {
  readonly type = "Boolean";

  constructor(readonly value: boolean) {
    super();
  }
}

export class CrochetNothing extends CrochetValue {
  readonly type = "Nothing";
}

export const nothing = new CrochetNothing();
