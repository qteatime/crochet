import { Trait, Type, TypeConstraint } from "./type";
import { BasicBlock, HandlerCase } from "./expression";
import { Predicate } from "./logic";

type Metadata = number;

export enum DeclarationTag {
  COMMAND = 1, // meta, name params types body
  TYPE, // meta, name, parent, fields
  SEAL, // meta, type
  TEST, // meta, name, body
  OPEN, // meta, namespace
  DEFINE, // meta name body
  PRELUDE, // meta body
  RELATION,
  ACTION,
  WHEN,
  CONTEXT,
  FOREIGN_TYPE,
  EFFECT,
  TRAIT,
  IMPLEMENT_TRAIT,
}

export enum Visibility {
  LOCAL,
  GLOBAL,
}

export type Declaration =
  | DCommand
  | DType
  | DSeal
  | DTest
  | DDefine
  | DOpen
  | DPrelude
  | DRelation
  | DAction
  | DContext
  | DWhen
  | DForeignType
  | DEffect
  | DTrait
  | DImplementTrait;

abstract class BaseDeclaration {
  abstract tag: DeclarationTag;
}

export class DCommand extends BaseDeclaration {
  readonly tag = DeclarationTag.COMMAND;

  constructor(
    readonly meta: Metadata,
    readonly documentation: string,
    readonly name: string,
    readonly parameters: string[],
    readonly types: TypeConstraint[],
    readonly body: BasicBlock
  ) {
    super();
  }
}

export class DType extends BaseDeclaration {
  readonly tag = DeclarationTag.TYPE;

  constructor(
    readonly meta: Metadata,
    readonly documentation: string,
    readonly visibility: Visibility,
    readonly name: string,
    readonly parent: TypeConstraint,
    readonly fields: string[],
    readonly types: TypeConstraint[]
  ) {
    super();
  }
}

export class DSeal extends BaseDeclaration {
  readonly tag = DeclarationTag.SEAL;

  constructor(readonly meta: Metadata, readonly name: string) {
    super();
  }
}

export class DTest extends BaseDeclaration {
  readonly tag = DeclarationTag.TEST;

  constructor(
    readonly meta: Metadata,
    readonly name: string,
    readonly body: BasicBlock
  ) {
    super();
  }
}

export class DDefine extends BaseDeclaration {
  readonly tag = DeclarationTag.DEFINE;

  constructor(
    readonly meta: Metadata,
    readonly documentation: string,
    readonly visibility: Visibility,
    readonly name: string,
    readonly body: BasicBlock
  ) {
    super();
  }
}

export class DOpen extends BaseDeclaration {
  readonly tag = DeclarationTag.OPEN;

  constructor(readonly meta: Metadata, readonly namespace: string) {
    super();
  }
}

export class DPrelude extends BaseDeclaration {
  readonly tag = DeclarationTag.PRELUDE;

  constructor(readonly meta: Metadata, readonly body: BasicBlock) {
    super();
  }
}

export enum RelationMultiplicity {
  ONE = 1,
  MANY,
}

export class RelationType {
  constructor(
    readonly meta: Metadata,
    readonly multiplicity: RelationMultiplicity
  ) {}
}

export class DRelation extends BaseDeclaration {
  readonly tag = DeclarationTag.RELATION;

  constructor(
    readonly meta: Metadata,
    readonly documentation: string,
    readonly name: string,
    readonly type: RelationType[]
  ) {
    super();
  }
}

export class DAction extends BaseDeclaration {
  readonly tag = DeclarationTag.ACTION;

  constructor(
    readonly meta: Metadata,
    readonly documentation: string,
    readonly context: string | null,
    readonly name: string,
    readonly actor: TypeConstraint,
    readonly parameter: string,
    readonly rank_function: BasicBlock,
    readonly predicate: Predicate,
    readonly body: BasicBlock
  ) {
    super();
  }
}

export class DWhen extends BaseDeclaration {
  readonly tag = DeclarationTag.WHEN;

  constructor(
    readonly meta: Metadata,
    readonly documentation: string,
    readonly context: string | null,
    readonly predicate: Predicate,
    readonly body: BasicBlock
  ) {
    super();
  }
}

export class DContext extends BaseDeclaration {
  readonly tag = DeclarationTag.CONTEXT;

  constructor(
    readonly meta: Metadata,
    readonly documentation: string,
    readonly name: string
  ) {
    super();
  }
}

export class DForeignType extends BaseDeclaration {
  readonly tag = DeclarationTag.FOREIGN_TYPE;

  constructor(
    readonly meta: Metadata,
    readonly documentation: string,
    readonly visibility: Visibility,
    readonly name: string,
    readonly target: string
  ) {
    super();
  }
}

export class DEffect extends BaseDeclaration {
  readonly tag = DeclarationTag.EFFECT;

  constructor(
    readonly meta: Metadata,
    readonly documentation: string,
    readonly name: string,
    readonly cases: EffectCase[]
  ) {
    super();
  }
}

export class EffectCase {
  constructor(
    readonly meta: Metadata,
    readonly documentation: string,
    readonly name: string,
    readonly parameters: string[],
    readonly types: TypeConstraint[]
  ) {}
}

export class DTrait extends BaseDeclaration {
  readonly tag = DeclarationTag.TRAIT;

  constructor(
    readonly meta: Metadata,
    readonly documentation: string,
    readonly name: string
  ) {
    super();
  }
}

export class DImplementTrait extends BaseDeclaration {
  readonly tag = DeclarationTag.IMPLEMENT_TRAIT;

  constructor(
    readonly meta: Metadata,
    readonly trait: Trait,
    readonly type: Type
  ) {
    super();
  }
}
