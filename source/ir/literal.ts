export enum LiteralTag {
  NOTHING = 1,
  TRUE,
  FALSE,
  INTEGER,
  FLOAT_64,
  TEXT,
}

export type Literal =
  | LiteralNothing
  | LiteralFalse
  | LiteralTrue
  | LiteralInteger
  | LiteralFloat64
  | LiteralText;

export abstract class BaseLiteral {
  abstract tag: LiteralTag;
}

export class LiteralNothing extends BaseLiteral {
  readonly tag = LiteralTag.NOTHING;
}

export class LiteralTrue extends BaseLiteral {
  readonly tag = LiteralTag.TRUE;
}

export class LiteralFalse extends BaseLiteral {
  readonly tag = LiteralTag.FALSE;
}

export class LiteralInteger extends BaseLiteral {
  readonly tag = LiteralTag.INTEGER;

  constructor(readonly value: bigint) {
    super();
  }
}

export class LiteralFloat64 extends BaseLiteral {
  readonly tag = LiteralTag.FLOAT_64;

  constructor(readonly value: number) {
    super();
  }
}

export class LiteralText extends BaseLiteral {
  readonly tag = LiteralTag.TEXT;

  constructor(readonly value: string) {
    super();
  }
}
