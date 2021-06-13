import { Type } from "./type";
import { Literal } from "./literal";

type Metadata = number;
type uint32 = number;

export enum PatternTag {
  HAS_TYPE,
  GLOBAL,
  STATIC_TYPE,
  VARIABLE,
  SELF,
  WILDCARD,
  LITERAL,
}

export type Pattern =
  | TypePattern
  | GlobalPattern
  | VariablePattern
  | SelfPattern
  | WildcardPattern
  | LiteralPattern
  | StaticTypePattern;

export abstract class PatternBase {}

export class TypePattern extends PatternBase {
  readonly tag = PatternTag.HAS_TYPE;

  constructor(
    readonly meta: Metadata,
    readonly type: Type,
    readonly pattern: Pattern
  ) {
    super();
  }
}

export class LiteralPattern extends PatternBase {
  readonly tag = PatternTag.LITERAL;

  constructor(readonly meta: Metadata, readonly literal: Literal) {
    super();
  }
}

export class GlobalPattern extends PatternBase {
  readonly tag = PatternTag.GLOBAL;

  constructor(readonly meta: Metadata, readonly name: string) {
    super();
  }
}

export class SelfPattern extends PatternBase {
  readonly tag = PatternTag.SELF;

  constructor(readonly meta: Metadata) {
    super();
  }
}

export class VariablePattern extends PatternBase {
  readonly tag = PatternTag.VARIABLE;

  constructor(readonly meta: Metadata, readonly name: string) {
    super();
  }
}

export class WildcardPattern extends PatternBase {
  readonly tag = PatternTag.WILDCARD;

  constructor(readonly meta: Metadata) {
    super();
  }
}

export class StaticTypePattern extends PatternBase {
  readonly tag = PatternTag.STATIC_TYPE;

  constructor(readonly meta: Metadata, readonly type: Type) {
    super();
  }
}
