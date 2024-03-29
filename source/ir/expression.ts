import { Literal } from "./literal";
import { StaticType, Trait, Type, TypeConstraint } from "./type";
import { Predicate } from "./logic";
import { SimulationGoal } from "./goal";

type Metadata = number;
type uint32 = number;

export enum OpTag {
  DROP = 1,
  DUPLICATE,
  DIG,

  LET, // meta name (value)

  PUSH_VARIABLE, // meta name
  PUSH_SELF, // meta
  PUSH_GLOBAL, // meta
  PUSH_LITERAL, // meta
  PUSH_RETURN, // meta
  PUSH_LIST, // meta arity (value...)
  PUSH_NEW, // meta type arity (value...)
  PUSH_NEW_NAMED, // meta type fields... (value...)
  PUSH_STATIC_TYPE, // meta name

  PUSH_RECORD, // meta key... (value...)
  PROJECT_STATIC, // meta key (object)
  EXTEND_INSTANCE, // meta type fields... (base) (value...)
  EXTEND_RECORD, // meta key... (base) (value...)

  INTERPOLATE, // meta parts (value...)

  PUSH_LAZY, // meta expr
  FORCE, // meta

  PUSH_LAMBDA, // meta param... body
  INVOKE_FOREIGN, // meta name arity (value...)
  INVOKE, // meta name arity (value...)
  APPLY, // meta arity (value...)
  RETURN, // meta (expr)
  PUSH_PARTIAL, // meta name

  ASSERT, // meta tag message
  BRANCH, // meta consequent alternate
  TYPE_TEST, // meta type
  TRAIT_TEST, // meta trait
  INTRINSIC_EQUAL, // meta (left right)
  REGISTER_INSTANCE, // meta (value)

  SEARCH,
  MATCH_SEARCH,
  FACT,
  FORGET,
  SIMULATE,

  HANDLE,
  PERFORM,
  CONTINUE_WITH,
}

export enum AssertType {
  PRECONDITION = 1,
  POSTCONDITION,
  RETURN_TYPE,
  ASSERT,
  UNREACHABLE,
}

export class BasicBlock {
  constructor(readonly ops: Op[]) {}
}

export type Op =
  | Drop
  | Duplicate
  | Dig
  | Let
  | PushVariable
  | PushSelf
  | PushGlobal
  | PushLiteral
  | PushReturn
  | PushList
  | PushNew
  | PushNewNamed
  | PushStaticType
  | PushRecord
  | ExtendRecord
  | ExtendInstance
  | ProjectStatic
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
  | TypeTest
  | TraitTest
  | IntrinsicEqual
  | RegisterInstance
  | Search
  | MatchSearch
  | Fact
  | Forget
  | Simulate
  | Handle
  | Perform
  | ContinueWith;

export abstract class BaseOp {
  abstract tag: OpTag;
  abstract meta: Metadata | null;
}

export class Drop extends BaseOp {
  readonly tag = OpTag.DROP;

  constructor(readonly meta: Metadata) {
    super();
  }
}

export class Duplicate extends BaseOp {
  readonly tag = OpTag.DUPLICATE;

  constructor(readonly meta: Metadata) {
    super();
  }
}

export class Dig extends BaseOp {
  readonly tag = OpTag.DIG;

  constructor(readonly meta: Metadata, readonly offset: number) {
    super();
  }
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

  constructor(readonly meta: Metadata, readonly name: string) {
    super();
  }
}

export class PushLiteral extends BaseOp {
  readonly tag = OpTag.PUSH_LITERAL;
  readonly meta = null;

  constructor(readonly value: Literal) {
    super();
  }
}

export class PushReturn extends BaseOp {
  readonly tag = OpTag.PUSH_RETURN;

  constructor(readonly meta: Metadata) {
    super();
  }
}

export class PushList extends BaseOp {
  readonly tag = OpTag.PUSH_LIST;

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

export class PushNewNamed extends BaseOp {
  readonly tag = OpTag.PUSH_NEW_NAMED;

  constructor(
    readonly meta: Metadata,
    readonly type: Type,
    readonly fields: string[]
  ) {
    super();
  }
}

export class ExtendInstance extends BaseOp {
  readonly tag = OpTag.EXTEND_INSTANCE;

  constructor(
    readonly meta: Metadata,
    readonly type: Type,
    readonly fields: string[]
  ) {
    super();
  }
}

export class PushStaticType extends BaseOp {
  readonly tag = OpTag.PUSH_STATIC_TYPE;

  constructor(readonly meta: Metadata, readonly type: Type) {
    super();
  }
}

export class PushRecord extends BaseOp {
  readonly tag = OpTag.PUSH_RECORD;

  constructor(readonly meta: Metadata, readonly keys: string[]) {
    super();
  }
}

export class ExtendRecord extends BaseOp {
  readonly tag = OpTag.EXTEND_RECORD;

  constructor(readonly meta: Metadata, readonly keys: string[]) {
    super();
  }
}

export class ProjectStatic extends BaseOp {
  readonly tag = OpTag.PROJECT_STATIC;

  constructor(readonly meta: Metadata, readonly key: string) {
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

  constructor(readonly meta: Metadata, readonly parts: (string | null)[]) {
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

  constructor(
    readonly meta: Metadata,
    readonly name: string,
    readonly arity: number
  ) {
    super();
  }
}

export class Assert extends BaseOp {
  readonly tag = OpTag.ASSERT;

  constructor(
    readonly meta: Metadata,
    readonly kind: AssertType,
    readonly assert_tag: string,
    readonly message: string,
    readonly expression: null | [string, string[]]
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

export class TraitTest extends BaseOp {
  readonly tag = OpTag.TRAIT_TEST;

  constructor(readonly meta: Metadata, readonly trait: Trait) {
    super();
  }
}

export class IntrinsicEqual extends BaseOp {
  readonly tag = OpTag.INTRINSIC_EQUAL;

  constructor(readonly meta: Metadata) {
    super();
  }
}

export class RegisterInstance extends BaseOp {
  readonly tag = OpTag.REGISTER_INSTANCE;

  constructor(readonly meta: Metadata) {
    super();
  }
}

export class Search extends BaseOp {
  readonly tag = OpTag.SEARCH;

  constructor(readonly meta: Metadata, readonly predicate: Predicate) {
    super();
  }
}

export class MatchSearch extends BaseOp {
  readonly tag = OpTag.MATCH_SEARCH;

  constructor(
    readonly meta: Metadata,
    readonly block: BasicBlock,
    readonly alternate: BasicBlock
  ) {
    super();
  }
}

export class Fact extends BaseOp {
  readonly tag = OpTag.FACT;

  constructor(
    readonly meta: Metadata,
    readonly relation: string,
    readonly arity: uint32
  ) {
    super();
  }
}

export class Forget extends BaseOp {
  readonly tag = OpTag.FORGET;

  constructor(
    readonly meta: Metadata,
    readonly relation: string,
    readonly arity: uint32
  ) {
    super();
  }
}

export class SimulationSignal {
  constructor(
    readonly meta: Metadata,
    readonly parameters: string[],
    readonly name: string,
    readonly body: BasicBlock
  ) {}
}

export class Simulate extends BaseOp {
  readonly tag = OpTag.SIMULATE;

  constructor(
    readonly meta: Metadata,
    readonly context: string | null,
    readonly goal: SimulationGoal,
    readonly signals: SimulationSignal[]
  ) {
    super();
  }
}

export class Handle extends BaseOp {
  readonly tag = OpTag.HANDLE;

  constructor(
    readonly meta: Metadata,
    readonly body: BasicBlock,
    readonly handlers: HandlerCase[]
  ) {
    super();
  }
}

export type HandlerCase = HandlerCaseUse | HandlerCaseOn;

export abstract class BaseHandlerCase {
  abstract readonly tag: HandlerCaseTag;
}

export enum HandlerCaseTag {
  USE,
  ON,
}

export class HandlerCaseUse extends BaseHandlerCase {
  readonly tag = HandlerCaseTag.USE;

  constructor(
    readonly meta: Metadata,
    readonly name: string,
    readonly arity: number,
    readonly values: BasicBlock
  ) {
    super();
  }
}

export class HandlerCaseOn extends BaseHandlerCase {
  readonly tag = HandlerCaseTag.ON;

  constructor(
    readonly meta: Metadata,
    readonly effect: string,
    readonly variant: string,
    readonly parameters: string[],
    readonly block: BasicBlock
  ) {
    super();
  }
}

export class Perform extends BaseOp {
  readonly tag = OpTag.PERFORM;

  constructor(
    readonly meta: Metadata,
    readonly effect: string,
    readonly variant: string,
    readonly arity: number
  ) {
    super();
  }
}

export class ContinueWith extends BaseOp {
  readonly tag = OpTag.CONTINUE_WITH;

  constructor(readonly meta: Metadata) {
    super();
  }
}
