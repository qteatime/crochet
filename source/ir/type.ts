type Metadata = number;

export enum TypeTag {
  LOCAL = 1, // meta, name
  LOCAL_STATIC, // meta, name
}

export type Type = StaticType | LocalType;
export type AnyStaticType = StaticType;

export abstract class BaseType {}

export class StaticType extends BaseType {
  readonly tag = TypeTag.LOCAL_STATIC;

  constructor(readonly meta: Metadata, readonly name: string) {
    super();
  }
}

export class LocalType extends BaseType {
  readonly tag = TypeTag.LOCAL;

  constructor(readonly name: string) {
    super();
  }
}
