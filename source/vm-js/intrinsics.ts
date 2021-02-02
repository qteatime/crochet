export abstract class CrochetValue { }

export class CrochetText extends CrochetValue {
  constructor(readonly value: string) {
    super();
  }
}

export class CrochetInteger extends CrochetValue {
  constructor(readonly value: bigint) {
    super();
  }
}

export class CrochetFloat extends CrochetValue {
  constructor(readonly value: number) {
    super();
  }
}

export class CrochetBoolean extends CrochetValue {
  constructor(readonly value: boolean) {
    super();
  }
}

