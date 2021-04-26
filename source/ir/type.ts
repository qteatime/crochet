type Metadata = number;

export enum TypeTag {
  ANY = 1,
  UNKNOWN,
  LOCAL, // meta, name
  LOCAL_STATIC, // meta, name
}

export type Type = StaticType | LocalType | AnyType | UnknownType;
export type AnyStaticType = StaticType;

export abstract class BaseType {}

export class AnyType extends BaseType {
  readonly tag = TypeTag.ANY;
}

export class UnknownType extends BaseType {
  readonly tag = TypeTag.UNKNOWN;
}

export class StaticType extends BaseType {
  readonly tag = TypeTag.LOCAL_STATIC;

  constructor(readonly meta: Metadata, readonly name: string) {
    super();
  }
}

export class LocalType extends BaseType {
  readonly tag = TypeTag.LOCAL;

  constructor(readonly meta: Metadata, readonly name: string) {
    super();
  }
}
