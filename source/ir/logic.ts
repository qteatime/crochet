import { Pattern } from "./pattern";
import { Type } from "./type";
import { BasicBlock } from "./expression";

type Metadata = number;
type uint32 = number;

export enum PredicateTag {
  AND,
  OR,
  NOT,
  RELATION,
  SAMPLE_RELATION,
  SAMPLE_TYPE,
  CONSTRAIN,
  LET,
  TYPE,
  ALWAYS,
}

export type Predicate =
  | PAnd
  | POr
  | PNot
  | PRelation
  | PSampleRelation
  | PSampleType
  | PConstrained
  | PLet
  | PType
  | PAlways;

export abstract class PredicateBase {}

export class PAnd extends PredicateBase {
  readonly tag = PredicateTag.AND;

  constructor(
    readonly meta: Metadata,
    readonly left: Predicate,
    readonly right: Predicate
  ) {
    super();
  }
}

export class POr extends PredicateBase {
  readonly tag = PredicateTag.OR;

  constructor(
    readonly meta: Metadata,
    readonly left: Predicate,
    readonly right: Predicate
  ) {
    super();
  }
}

export class PNot extends PredicateBase {
  readonly tag = PredicateTag.NOT;

  constructor(readonly meta: Metadata, readonly pred: Predicate) {
    super();
  }
}

export class PRelation extends PredicateBase {
  readonly tag = PredicateTag.RELATION;

  constructor(
    readonly meta: Metadata,
    readonly relation: string,
    readonly patterns: Pattern[]
  ) {
    super();
  }
}

export class PSampleRelation extends PredicateBase {
  readonly tag = PredicateTag.SAMPLE_RELATION;

  constructor(
    readonly meta: Metadata,
    readonly size: uint32,
    readonly relation: string,
    readonly patterns: Pattern[]
  ) {
    super();
  }
}

export class PSampleType extends PredicateBase {
  readonly tag = PredicateTag.SAMPLE_TYPE;

  constructor(
    readonly meta: Metadata,
    readonly size: uint32,
    readonly name: string,
    readonly type: Type
  ) {
    super();
  }
}

export class PConstrained extends PredicateBase {
  readonly tag = PredicateTag.CONSTRAIN;

  constructor(
    readonly meta: Metadata,
    readonly predicate: Predicate,
    readonly constraint: BasicBlock
  ) {
    super();
  }
}

export class PLet extends PredicateBase {
  readonly tag = PredicateTag.LET;

  constructor(
    readonly meta: Metadata,
    readonly name: string,
    readonly value: BasicBlock
  ) {
    super();
  }
}

export class PType extends PredicateBase {
  readonly tag = PredicateTag.LET;

  constructor(
    readonly meta: Metadata,
    readonly name: string,
    readonly type: Type
  ) {
    super();
  }
}

export class PAlways extends PredicateBase {
  readonly tag = PredicateTag.ALWAYS;

  constructor(readonly meta: Metadata) {
    super();
  }
}
