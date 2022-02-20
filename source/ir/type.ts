type Metadata = number;

export enum TypeTag {
  ANY = 1,
  UNKNOWN,
  GLOBAL, // meta, namespace, name
  GLOBAL_STATIC,
  LOCAL, // meta, name
  LOCAL_STATIC, // meta, name
}

export type Type =
  | GlobalStaticType
  | LocalStaticType
  | GlobalType
  | LocalType
  | AnyType
  | UnknownType;
export type StaticType = GlobalStaticType | LocalStaticType;

export abstract class BaseType {}

export class AnyType extends BaseType {
  readonly tag = TypeTag.ANY;
}

export class UnknownType extends BaseType {
  readonly tag = TypeTag.UNKNOWN;
}

export class LocalStaticType extends BaseType {
  readonly tag = TypeTag.LOCAL_STATIC;

  constructor(readonly meta: Metadata, readonly name: string) {
    super();
  }
}

export class GlobalStaticType extends BaseType {
  readonly tag = TypeTag.GLOBAL_STATIC;

  constructor(
    readonly meta: Metadata,
    readonly namespace: string,
    readonly name: string
  ) {
    super();
  }
}

export class GlobalType extends BaseType {
  readonly tag = TypeTag.GLOBAL;

  constructor(
    readonly meta: Metadata,
    readonly namespace: string,
    readonly name: string
  ) {
    super();
  }
}

export class LocalType extends BaseType {
  readonly tag = TypeTag.LOCAL;

  constructor(readonly meta: Metadata, readonly name: string) {
    super();
  }
}

export enum TypeConstraintTag {
  TYPE,
  WITH_TRAIT,
}

export type TypeConstraint = TypeConstraintType | TypeConstraintWithTrait;

abstract class BaseConstraint {
  abstract tag: TypeConstraintTag;
}

export class TypeConstraintType extends BaseConstraint {
  readonly tag = TypeConstraintTag.TYPE;

  constructor(readonly meta: Metadata, readonly type: Type) {
    super();
  }
}

export class TypeConstraintWithTrait extends BaseConstraint {
  readonly tag = TypeConstraintTag.WITH_TRAIT;

  constructor(
    readonly meta: Metadata,
    readonly type: TypeConstraint,
    readonly traits: Trait[]
  ) {
    super();
  }
}

export enum TraitTag {
  LOCAL,
  GLOBAL,
}

export type Trait = LocalTrait | GlobalTrait;

abstract class BaseTrait {
  abstract tag: TraitTag;
}

export class LocalTrait extends BaseTrait {
  readonly tag = TraitTag.LOCAL;

  constructor(readonly meta: Metadata, readonly name: string) {
    super();
  }
}

export class GlobalTrait extends BaseTrait {
  readonly tag = TraitTag.GLOBAL;

  constructor(
    readonly meta: Metadata,
    readonly namespace: string,
    readonly name: string
  ) {
    super();
  }
}
