import { CrochetValue } from "../../../vm";

export enum ReprTag {
  TEXT,
  NUMBER,
  KEYWORD,
  STATIC_TEXT,
  LIST,
  MAP,
  INTERPOLATION,
  FLOW,
  STACK,
  BLOCK,
  CIRCULAR,
  TYPED,
  TAGGED,
  SPACE,
  SECRET,
}

export type Repr =
  | RText
  | RNumber
  | RKeyword
  | RStatic
  | RList
  | RMap
  | RInterpolation
  | RFlow
  | RStack
  | RBlock
  | RTyped
  | RCircular
  | RSpace
  | RTagged
  | RSecret;

export class RText {
  readonly tag = ReprTag.TEXT;
  constructor(readonly value: string) {}
}

export class RNumber {
  readonly tag = ReprTag.NUMBER;
  constructor(readonly value: bigint | number) {}
}

export class RKeyword {
  readonly tag = ReprTag.KEYWORD;
  constructor(readonly name: string) {}
}

export class RStatic {
  readonly tag = ReprTag.STATIC_TEXT;
  constructor(readonly text: string) {}
}

export class RList {
  readonly tag = ReprTag.LIST;
  constructor(readonly items: Repr[]) {}
}

export class RInterpolation {
  readonly tag = ReprTag.INTERPOLATION;
  constructor(readonly parts: Repr[]) {}
}

export class RFlow {
  readonly tag = ReprTag.FLOW;
  constructor(readonly items: Repr[]) {}
}

export class RBlock {
  readonly tag = ReprTag.BLOCK;
  constructor(readonly child: Repr) {}
}

export class RCircular {
  readonly tag = ReprTag.CIRCULAR;
  constructor(readonly value: CrochetValue) {}
}

export class RTyped {
  readonly tag = ReprTag.TYPED;
  constructor(readonly type: Repr, readonly value: Repr) {}
}

export class RMap {
  readonly tag = ReprTag.MAP;
  constructor(readonly items: [Repr, Repr][]) {}
}

export class RTagged {
  readonly tag = ReprTag.TAGGED;
  constructor(readonly tag_name: string, readonly value: Repr) {}
}

export class RSpace {
  readonly tag = ReprTag.SPACE;
}

export class RSecret {
  readonly tag = ReprTag.SECRET;
  constructor(readonly value: Repr) {}
}

export class RStack {
  readonly tag = ReprTag.STACK;
  constructor(readonly items: Repr[]) {}
}

export const space = new RSpace();
