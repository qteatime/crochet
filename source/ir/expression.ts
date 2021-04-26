import { Literal } from "./literal";
import { AnyStaticType, StaticType, Type } from "./type";

type Metadata = number;
type uint32 = number;

export enum OpTag {
  LET = 1, // meta name (value)

  PUSH_VARIABLE, // meta name
  PUSH_SELF, // meta
  PUSH_GLOBAL, // meta
  PUSH_LITERAL, // meta
  PUSH_RETURN, // meta
  PUSH_TUPLE, // meta arity (value...)
  PUSH_NEW, // meta type arity (value...)
  PUSH_STATIC_TYPE, // meta name

  PUSH_RECORD, // meta key... (value...)
  RECORD_AT_PUT, // meta (key value)
  PROJECT, // meta key

  INTERPOLATE, // meta arity static holes

  PUSH_LAZY, // meta expr
  FORCE, // meta

  PUSH_LAMBDA, // meta param... body
  INVOKE_FOREIGN, // meta name arity
  INVOKE, // meta name arity
  APPLY, // meta arity
  RETURN, // meta expr
  PUSH_PARTIAL, // meta name

  ASSERT, // meta tag message
  BRANCH, // meta consequent alternate
  TYPE_TEST, // meta type
}

export class BasicBlock {
  constructor(readonly ops: Op[]) {}
}

export type Op =
  | Let
  | PushVariable
  | PushSelf
  | PushGlobal
  | PushLiteral
  | PushReturn
  | PushTuple
  | PushNew
  | PushStaticType
  | PushRecord
  | RecordAtPut
  | Project
  | PushLazy
  | Force
  | Interpolate
  | PushLambda
  | InvokeForeign
  | Invoke
  | Apply
  | Return
  | PushPartial
  | Assert
  | Branch
  | TypeTest;

export abstract class BaseOp {
  abstract tag: OpTag;
}

export class Let extends BaseOp {
  readonly tag = OpTag.LET;

  constructor(readonly meta: Metadata, readonly name: string) {
    super();
  }
}

export class PushVariable extends BaseOp {
  readonly tag = OpTag.PUSH_VARIABLE;

  constructor(readonly meta: Metadata, readonly name: string) {
    super();
  }
}

export class PushSelf extends BaseOp {
  readonly tag = OpTag.PUSH_SELF;

  constructor(readonly meta: Metadata) {
    super();
  }
}

export class PushGlobal extends BaseOp {
  readonly tag = OpTag.PUSH_GLOBAL;

  constructor(readonly meta: Metadata) {
    super();
  }
}

export class PushLiteral extends BaseOp {
  readonly tag = OpTag.PUSH_LITERAL;

  constructor(readonly meta: Metadata, readonly value: Literal) {
    super();
  }
}

export class PushReturn extends BaseOp {
  readonly tag = OpTag.PUSH_RETURN;

  constructor(readonly meta: Metadata) {
    super();
  }
}

export class PushTuple extends BaseOp {
  readonly tag = OpTag.PUSH_TUPLE;

  constructor(readonly meta: Metadata, readonly arity: uint32) {
    super();
  }
}

export class PushNew extends BaseOp {
  readonly tag = OpTag.PUSH_NEW;

  constructor(
    readonly meta: Metadata,
    readonly type: Type,
    readonly arity: uint32
  ) {
    super();
  }
}

export class PushStaticType extends BaseOp {
  readonly tag = OpTag.PUSH_STATIC_TYPE;

  constructor(readonly meta: Metadata, readonly name: AnyStaticType) {
    super();
  }
}

export class PushRecord extends BaseOp {
  readonly tag = OpTag.PUSH_RECORD;

  constructor(readonly meta: Metadata, readonly keys: string) {
    super();
  }
}

export class RecordAtPut extends BaseOp {
  readonly tag = OpTag.RECORD_AT_PUT;

  constructor(readonly meta: Metadata) {
    super();
  }
}

export class Project extends BaseOp {
  readonly tag = OpTag.PROJECT;

  constructor(readonly meta: Metadata) {
    super();
  }
}

export class PushLazy extends BaseOp {
  readonly tag = OpTag.PUSH_LAZY;

  constructor(readonly meta: Metadata, readonly body: BasicBlock) {
    super();
  }
}

export class Force extends BaseOp {
  readonly tag = OpTag.FORCE;

  constructor(readonly meta: Metadata) {
    super();
  }
}

export class Interpolate extends BaseOp {
  readonly tag = OpTag.INTERPOLATE;

  constructor(
    readonly meta: Metadata,
    readonly arity: uint32,
    readonly parts: (string | null)[]
  ) {
    super();
  }
}

export class PushLambda extends BaseOp {
  readonly tag = OpTag.PUSH_LAMBDA;

  constructor(
    readonly meta: Metadata,
    readonly parameters: string[],
    readonly body: BasicBlock
  ) {
    super();
  }
}

export class InvokeForeign extends BaseOp {
  readonly tag = OpTag.INVOKE_FOREIGN;

  constructor(
    readonly meta: Metadata,
    readonly name: string,
    readonly arity: uint32
  ) {
    super();
  }
}

export class Invoke extends BaseOp {
  readonly tag = OpTag.INVOKE;

  constructor(
    readonly meta: Metadata,
    readonly name: string,
    readonly arity: uint32
  ) {
    super();
  }
}

export class Apply extends BaseOp {
  readonly tag = OpTag.APPLY;

  constructor(readonly meta: Metadata, readonly arity: uint32) {
    super();
  }
}

export class Return extends BaseOp {
  readonly tag = OpTag.RETURN;

  constructor(readonly meta: Metadata) {
    super();
  }
}

export class PushPartial extends BaseOp {
  readonly tag = OpTag.PUSH_PARTIAL;

  constructor(readonly meta: Metadata, readonly name: string) {
    super();
  }
}

export class Assert extends BaseOp {
  readonly tag = OpTag.ASSERT;

  constructor(
    readonly meta: Metadata,
    readonly assert_tag: string,
    readonly message: string
  ) {
    super();
  }
}

export class Branch extends BaseOp {
  readonly tag = OpTag.BRANCH;

  constructor(
    readonly meta: Metadata,
    readonly consequent: BasicBlock,
    readonly alternate: BasicBlock
  ) {
    super();
  }
}

export class TypeTest extends BaseOp {
  readonly tag = OpTag.TYPE_TEST;

  constructor(readonly meta: Metadata, readonly type: Type) {
    super();
  }
}
