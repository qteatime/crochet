import { Type } from "./type";
import { BasicBlock } from "./expression";

type Metadata = number;

export enum DeclarationTag {
  COMMAND = 1, // meta, name types body
  TYPE, // meta, name, parent, fields
  SEAL, // meta, type
  TEST, // meta, name, body
  OPEN, // meta, namespace
  DEFINE, // meta name body
}

export type Declaration = true;

abstract class BaseDeclaration {}

export class DCommand extends BaseDeclaration {
  readonly tag = DeclarationTag.COMMAND;

  constructor(
    readonly meta: Metadata,
    readonly documentation: string,
    readonly name: string,
    readonly types: Type[],
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
    readonly name: string,
    readonly parent: Type,
    readonly fields: [string, Type][]
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
