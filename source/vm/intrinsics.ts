import * as IR from "../ir";
import { unreachable, zip } from "../utils/utils";
import { XorShift } from "../utils/xorshift";
import { Namespace, PassthroughNamespace } from "./namespaces";
// Only imported so callbacks get the correct type here
import type { Pattern } from "./logic/unification";
import type { CrochetTrace } from "./tracing/trace";
import { hash, isImmutable } from "immutable";

export type Primitive = boolean | null | bigint | number;

//#region Base values
export enum Tag {
  NOTHING = 0,
  INTEGER,
  FLOAT_64,
  TEXT,
  TRUE,
  FALSE,
  INTERPOLATION,
  LIST,
  RECORD,
  INSTANCE,
  LAMBDA,
  NATIVE_LAMBDA,
  PARTIAL,
  THUNK,
  CELL,
  TYPE,
  ACTION,
  ACTION_CHOICE,
  UNKNOWN,
  PROTECTED,
}

export type PayloadType = {
  [Tag.NOTHING]: null;
  [Tag.INTEGER]: bigint;
  [Tag.FLOAT_64]: number;
  [Tag.TEXT]: string;
  [Tag.TRUE]: null;
  [Tag.FALSE]: null;
  [Tag.INTERPOLATION]: (string | CrochetValue)[];
  [Tag.LIST]: CrochetValue[];
  [Tag.RECORD]: Map<string, CrochetValue>;
  [Tag.INSTANCE]: CrochetValue[];
  [Tag.PARTIAL]: CrochetPartial;
  [Tag.LAMBDA]: CrochetLambda;
  [Tag.NATIVE_LAMBDA]: CrochetNativeLambda;
  [Tag.THUNK]: CrochetThunk;
  [Tag.CELL]: CrochetCell;
  [Tag.TYPE]: CrochetType;
  [Tag.ACTION]: BoundAction;
  [Tag.ACTION_CHOICE]: ActionChoice;
  [Tag.UNKNOWN]: unknown;
  [Tag.PROTECTED]: CrochetProtectedValue;
};

export interface ActionChoice {
  score: number;
  action: Action;
  env: Environment;
}

export interface BoundAction {
  action: Action;
  env: Environment;
}

export class CrochetValue<T extends Tag = Tag> {
  constructor(
    readonly tag: T,
    readonly type: CrochetType,
    readonly payload: PayloadType[T]
  ) {}

  equals(that: CrochetValue<Tag>): boolean {
    return equals(this, that);
  }

  hashCode() {
    return 0; // FIXME: implement proper hash codes here
  }
}

export class CrochetLambda {
  constructor(
    readonly env: Environment,
    readonly parameters: string[],
    readonly body: IR.BasicBlock
  ) {}
}

export class CrochetNativeLambda {
  constructor(
    readonly arity: number,
    readonly handlers: HandlerStack,
    readonly fn: (...args: CrochetValue[]) => Machine<CrochetValue>
  ) {}
}

export class CrochetPartial {
  constructor(
    readonly module: CrochetModule,
    readonly name: string,
    readonly arity: number
  ) {}
}

export class CrochetCell {
  constructor(public value: CrochetValue) {}
}

export class CrochetCapturedContext {
  constructor(readonly state: State) {}
}

export class CrochetThunk {
  public value: CrochetValue | null = null;
  constructor(readonly env: Environment, readonly body: IR.BasicBlock) {}
}

export class CrochetProtectedValue {
  public protected_by = new Set<CrochetCapability>();
  constructor(readonly value: CrochetValue) {}
}

export class CrochetTrait {
  readonly implemented_by = new Set<CrochetType>();
  readonly protected_by = new Set<CrochetCapability>();

  constructor(
    readonly module: CrochetModule | null,
    readonly name: string,
    readonly documentation: string,
    readonly meta: IR.Metadata | null
  ) {}
}

export class CrochetType {
  public sealed = false;
  readonly layout: Map<string, number>;
  readonly sub_types: CrochetType[] = [];
  readonly traits = new Set<CrochetTrait>();
  readonly protected_by = new Set<CrochetCapability>();

  constructor(
    readonly module: CrochetModule | null,
    readonly name: string,
    readonly documentation: string,
    readonly parent: CrochetType | null,
    readonly fields: string[],
    readonly types: CrochetTypeConstraint[],
    readonly is_static: boolean,
    readonly meta: IR.Metadata | null
  ) {
    this.layout = new Map(this.fields.map((k, i) => [k, i]));
  }
}

export class CrochetTypeConstraint {
  constructor(readonly type: CrochetType, readonly traits: CrochetTrait[]) {}
}

export class CrochetCapability {
  readonly protecting = new Set<any>();

  constructor(
    readonly module: CrochetModule | null,
    readonly name: string,
    readonly documentation: string,
    readonly meta: IR.Metadata | null
  ) {}

  get full_name() {
    const pkg = this.module?.pkg;
    if (!pkg) {
      return this.name;
    } else {
      return `${pkg.name}/${this.name}`;
    }
  }
}
//#endregion

//#region Core operations
export function equals(left: CrochetValue, right: CrochetValue): boolean {
  if (left.tag !== right.tag) {
    return false;
  }

  switch (left.tag) {
    case Tag.NOTHING:
    case Tag.TRUE:
    case Tag.FALSE:
      return left.tag === right.tag;

    case Tag.INTEGER: {
      return left.payload === right.payload;
    }

    case Tag.FLOAT_64: {
      return left.payload === right.payload;
    }

    case Tag.PARTIAL: {
      const l = left as CrochetValue<Tag.PARTIAL>;
      const r = right as CrochetValue<Tag.PARTIAL>;

      return (
        l.payload.module === r.payload.module &&
        l.payload.name === r.payload.name
      );
    }

    case Tag.TEXT: {
      return left.payload === right.payload;
    }

    case Tag.INTERPOLATION: {
      const l = left as CrochetValue<Tag.INTERPOLATION>;
      const r = right as CrochetValue<Tag.INTERPOLATION>;

      if (l.payload.length !== r.payload.length) {
        return false;
      }
      for (const [a, b] of zip(l.payload, r.payload)) {
        if (typeof a === "string" && typeof b === "string") {
          if (a !== b) return false;
        } else if (a instanceof CrochetValue && b instanceof CrochetValue) {
          if (!equals(a, b)) return false;
        } else {
          return false;
        }
      }
      return true;
    }

    case Tag.LIST: {
      const l = left as CrochetValue<Tag.LIST>;
      const r = right as CrochetValue<Tag.LIST>;

      if (l.payload.length !== r.payload.length) {
        return false;
      }
      for (const [a, b] of zip(l.payload, r.payload)) {
        if (!equals(a, b)) return false;
      }
      return true;
    }

    case Tag.RECORD: {
      const l = left as CrochetValue<Tag.RECORD>;
      const r = right as CrochetValue<Tag.RECORD>;

      if (l.payload.size !== r.payload.size) {
        return false;
      }

      for (const [k, v] of l.payload.entries()) {
        const rv = r.payload.get(k);
        if (rv == null || !equals(v, rv)) {
          return false;
        }
      }
      return true;
    }

    default:
      return left === right;
  }
}
//#endregion

//#region Commands
export class CrochetCommand {
  readonly branches: CrochetCommandBranch[] = [];
  readonly versions: CrochetCommandBranch[][] = [];

  constructor(readonly name: string, readonly arity: number) {}
}

export class CrochetCommandBranch {
  constructor(
    readonly module: CrochetModule,
    readonly env: Environment,
    readonly name: string,
    readonly documentation: string,
    readonly parameters: string[],
    readonly types: CrochetTypeConstraint[],
    readonly body: IR.BasicBlock,
    readonly meta: IR.Metadata | null
  ) {}

  get arity() {
    return this.types.length;
  }
}

export enum NativeTag {
  NATIVE_SYNCHRONOUS,
  NATIVE_MACHINE,
}

export type Machine<T> = Generator<NativeSignal, T, CrochetValue>;

export type NativePayload = {
  [NativeTag.NATIVE_SYNCHRONOUS]: (...args: CrochetValue[]) => CrochetValue;
  [NativeTag.NATIVE_MACHINE]: (
    ...args: CrochetValue[]
  ) => Machine<CrochetValue>;
};

export class NativeFunction<T extends NativeTag = NativeTag> {
  constructor(
    readonly tag: T,
    readonly name: string,
    readonly pkg: CrochetPackage,
    readonly payload: NativePayload[T]
  ) {}
}
//#endregion

//#region Metadata
export class Metadata {
  constructor(
    readonly source: string,
    readonly table: Map<number, IR.Interval>
  ) {}
}
//#endregion

//#region World
export class CrochetTest {
  constructor(
    readonly module: CrochetModule,
    readonly env: Environment,
    readonly title: string,
    readonly body: IR.BasicBlock
  ) {}
}

export class CrochetPrelude {
  constructor(readonly env: Environment, readonly body: IR.BasicBlock) {}
}

export class CrochetWorld {
  readonly commands = new Namespace<CrochetCommand>(null, null);
  readonly types = new Namespace<CrochetType>(null, null);
  readonly traits = new Namespace<CrochetTrait>(null, null);
  readonly definitions = new Namespace<CrochetValue>(null, null);
  readonly relations = new Namespace<CrochetRelation>(null, null);
  readonly native_types = new Namespace<CrochetType>(null, null);
  readonly native_functions = new Namespace<NativeFunction>(null, null);
  readonly actions = new Namespace<Action>(null, null);
  readonly contexts = new Namespace<CrochetContext>(null, null);
  readonly capabilities = new Namespace<CrochetCapability>(null, null);
  readonly global_context = new GlobalContext();
  readonly prelude: CrochetPrelude[] = [];
  readonly tests: CrochetTest[] = [];
  readonly packages = new Map<string, CrochetPackage>();
}

export class CrochetPackage {
  readonly missing_traits: Namespace<CrochetTrait>;
  readonly missing_types: Namespace<CrochetType>;
  readonly missing_capabilities: Namespace<CrochetCapability>;
  readonly types: PassthroughNamespace<CrochetType>;
  readonly traits: PassthroughNamespace<CrochetTrait>;
  readonly definitions: PassthroughNamespace<CrochetValue>;
  readonly relations: PassthroughNamespace<CrochetRelation>;
  readonly native_functions: Namespace<NativeFunction>;
  readonly actions: PassthroughNamespace<Action>;
  readonly contexts: PassthroughNamespace<CrochetContext>;
  readonly capabilities: PassthroughNamespace<CrochetCapability>;
  readonly dependencies = new Set<string>();
  readonly granted_capabilities = new Set<CrochetCapability>();

  constructor(
    readonly world: CrochetWorld,
    readonly name: string,
    readonly filename: string
  ) {
    this.missing_traits = new Namespace(null, null, null);
    this.missing_types = new Namespace(null, null, null);
    this.missing_capabilities = new Namespace(null, null, null);
    this.types = new PassthroughNamespace(world.types, name);
    this.traits = new PassthroughNamespace(world.traits, name);
    this.definitions = new PassthroughNamespace(world.definitions, name);
    this.native_functions = new Namespace(world.native_functions, name);
    this.relations = new PassthroughNamespace(world.relations, name);
    this.actions = new PassthroughNamespace(world.actions, name);
    this.contexts = new PassthroughNamespace(world.contexts, name);
    this.capabilities = new PassthroughNamespace(world.capabilities, name);
  }
}

export class CrochetModule {
  readonly missing_types: Namespace<CrochetType>;
  readonly types: Namespace<CrochetType>;
  readonly definitions: Namespace<CrochetValue>;
  readonly relations: Namespace<CrochetRelation>;
  readonly actions: Namespace<Action>;
  readonly contexts: Namespace<CrochetContext>;
  readonly traits: Namespace<CrochetTrait>;
  readonly open_prefixes: Set<string>;

  constructor(
    readonly pkg: CrochetPackage,
    readonly filename: string,
    readonly metadata: Metadata | null
  ) {
    this.open_prefixes = new Set();
    this.open_prefixes.add("crochet.core");
    this.missing_types = new Namespace(pkg.missing_types, null, null);
    this.types = new Namespace(pkg.types, pkg.name, this.open_prefixes);
    this.definitions = new Namespace(
      pkg.definitions,
      pkg.name,
      this.open_prefixes
    );
    this.relations = new Namespace(pkg.relations, pkg.name, this.open_prefixes);
    this.actions = new Namespace(pkg.actions, pkg.name, this.open_prefixes);
    this.contexts = new Namespace(pkg.contexts, pkg.name, this.open_prefixes);
    this.traits = new Namespace(pkg.traits, pkg.name, this.open_prefixes);
  }
}
//#endregion

//#region Relations
export enum RelationTag {
  CONCRETE,
  PROCEDURAL,
}

export type RelationPayload = {
  [RelationTag.CONCRETE]: ConcreteRelation;
  [RelationTag.PROCEDURAL]: ProceduralRelation;
};

export class CrochetRelation<T extends RelationTag = RelationTag> {
  constructor(
    readonly tag: T,
    readonly name: string,
    readonly documentation: string,
    readonly payload: RelationPayload[T]
  ) {}
}

export class ConcreteRelation {
  constructor(
    readonly module: CrochetModule,
    readonly meta: number,
    readonly type: TreeType,
    public tree: Tree
  ) {}
}

export class ProceduralRelation {
  constructor(
    readonly search: (env: Environment, patterns: Pattern[]) => Environment[],
    readonly sample:
      | null
      | ((env: Environment, patterns: Pattern[], size: number) => Environment[])
  ) {}
}

export class Pair {
  constructor(readonly value: CrochetValue, public tree: Tree) {}
}

export enum TreeTag {
  ONE,
  MANY,
  END,
}

export type TreeType = TTOne | TTMany | TTEnd;

export class TTOne {
  readonly tag = TreeTag.ONE;
  constructor(readonly next: TreeType) {}
}

export class TTMany {
  readonly tag = TreeTag.MANY;
  constructor(readonly next: TreeType) {}
}

export class TTEnd {
  readonly tag = TreeTag.END;
}

export const type_end = new TTEnd();

export type Tree = TreeOne | TreeMany | TreeEnd;

export abstract class TreeBase {
  abstract tag: TreeTag;
}

export class TreeOne extends TreeBase {
  readonly tag = TreeTag.ONE;
  public value: Pair | null = null;
  constructor(readonly type: TreeType) {
    super();
  }
}

export class TreeMany extends TreeBase {
  readonly tag = TreeTag.MANY;
  public table = new CMap<Tree>();
  constructor(readonly type: TreeType) {
    super();
  }
}
export class TreeEnd extends TreeBase {
  readonly tag = TreeTag.END;
  constructor() {
    super();
  }
}

export const tree_end = new TreeEnd();
//#endregion

//#region Simulation
export class Action {
  readonly fired = new Set<CrochetValue>();

  constructor(
    readonly type: CrochetType,
    readonly meta: number,
    readonly module: CrochetModule,
    readonly name: string,
    readonly documentation: string,
    readonly actor_type: CrochetTypeConstraint,
    readonly self_parameter: string,
    readonly predicate: IR.Predicate,
    readonly rank_function: IR.BasicBlock,
    readonly body: IR.BasicBlock
  ) {}
}

export class When {
  constructor(
    readonly meta: number,
    readonly module: CrochetModule,
    readonly documentation: string,
    readonly predicate: IR.Predicate,
    readonly body: IR.BasicBlock
  ) {}
}

export type Context = CrochetContext | GlobalContext;

export enum ContextTag {
  LOCAL,
  GLOBAL,
}

export class GlobalContext {
  readonly tag = ContextTag.GLOBAL;
  readonly actions: Action[] = [];
  readonly events: When[] = [];
}

export class CrochetContext {
  readonly tag = ContextTag.LOCAL;
  readonly actions: Action[] = [];
  readonly events: When[] = [];

  constructor(
    readonly meta: number,
    readonly module: CrochetModule,
    readonly name: string,
    readonly documentation: string
  ) {}
}

export class SimulationSignal {
  constructor(
    readonly meta: number,
    readonly name: string,
    readonly parameters: string[],
    readonly body: IR.BasicBlock,
    readonly module: CrochetModule
  ) {}
}

export class SimulationState {
  public rounds: bigint = 0n;
  public acted = new Set<CrochetValue>();
  public turn: CrochetValue | null = null;

  constructor(
    readonly state: State,
    readonly module: CrochetModule,
    readonly env: Environment,
    readonly random: XorShift,
    readonly actors: CrochetValue[],
    readonly context: Context,
    readonly goal: IR.SimulationGoal,
    readonly signals: Namespace<SimulationSignal>
  ) {}
}

//#endregion

//#region Evaluation
export class Environment {
  readonly bindings = new Map<string, CrochetValue>();

  constructor(
    readonly parent: Environment | null,
    readonly raw_receiver: CrochetValue | null,
    readonly raw_module: CrochetModule | null,
    readonly raw_continuation: CrochetActivation | null
  ) {}

  define(name: string, value: CrochetValue): boolean {
    if (this.bindings.has(name)) {
      return false;
    }
    this.bindings.set(name, value);
    return true;
  }

  has(name: string) {
    return this.bindings.has(name);
  }

  try_lookup(name: string): CrochetValue | null {
    const value = this.bindings.get(name);
    if (value != null) {
      return value;
    } else if (this.parent != null) {
      return this.parent.try_lookup(name);
    } else {
      return null;
    }
  }
}

export class State {
  constructor(
    readonly universe: Universe,
    public activation: Activation,
    readonly random: XorShift
  ) {}
}

export class HandlerStack {
  public activation: CrochetActivation | null = null;

  constructor(
    readonly parent: HandlerStack | null,
    readonly handlers: Handler[]
  ) {}
}

export class Handler {
  constructor(
    readonly guard: CrochetType,
    readonly parameters: string[],
    readonly env: Environment,
    readonly body: IR.BasicBlock
  ) {}
}

export enum ContinuationTag {
  RETURN,
  DONE,
  TAP,
}

export type Continuation =
  | ContinuationDone
  | ContinuationReturn
  | ContinuationTap;

export class ContinuationReturn {
  readonly tag = ContinuationTag.RETURN;
}

export class ContinuationDone {
  readonly tag = ContinuationTag.DONE;
}

export class ContinuationTap {
  readonly tag = ContinuationTag.TAP;

  constructor(
    readonly saved_state: State,
    readonly continuation: (
      previous: State,
      state: State,
      value: CrochetValue
    ) => State
  ) {}
}

export const _done = new ContinuationDone();
export const _return = new ContinuationReturn();

export class TraceSpan {
  constructor(
    readonly parent: TraceSpan | null,
    readonly location: ActivationLocation,
    readonly description: string
  ) {}
}

export enum ActivationTag {
  CROCHET_ACTIVATION,
  NATIVE_ACTIVATION,
}

export type Activation = CrochetActivation | NativeActivation;

export interface IActivation {
  tag: ActivationTag;
  parent: Activation | null;
  span: TraceSpan | null;
  continuation: Continuation;
  handlers: HandlerStack;
}

export type ActivationLocation =
  | CrochetLambda
  | CrochetCommandBranch
  | CrochetThunk
  | CrochetPrelude
  | CrochetTest
  | NativeFunction
  | SimulationSignal
  | null;

export class CrochetActivation implements IActivation {
  readonly tag = ActivationTag.CROCHET_ACTIVATION;
  public stack: CrochetValue[] = [];
  public block_stack: [number, IR.BasicBlock][] = [];
  private _return: CrochetValue | null = null;
  public instruction: number = 0;
  public span: TraceSpan | null;

  constructor(
    readonly parent: Activation | null,
    readonly location: ActivationLocation,
    readonly env: Environment,
    readonly continuation: Continuation,
    readonly handlers: HandlerStack,
    public block: IR.BasicBlock
  ) {
    if (parent != null) {
      this.span = parent.span;
    } else {
      this.span = null;
    }
  }

  get current(): IR.Op | null {
    if (this.instruction < 0 || this.instruction > this.block.ops.length) {
      return null;
    }

    return this.block.ops[this.instruction];
  }

  next() {
    this.instruction += 1;
  }

  get return_value() {
    return this._return;
  }

  set_return_value(value: CrochetValue) {
    this._return = value;
  }

  push_block(b: IR.BasicBlock) {
    this.block_stack.push([this.instruction, this.block]);
    this.block = b;
    this.instruction = 0;
  }

  pop_block() {
    if (this.block_stack.length === 0) {
      throw new Error(`internal: pop_block() on empty stack`);
    }
    const [pc, block] = this.block_stack.pop()!;
    this.block = block;
    this.instruction = pc;
  }
}

export enum NativeSignalTag {
  INVOKE,
  APPLY,
  AWAIT,
  EVALUATE,
  JUMP,
  TRANSCRIPT_WRITE,
  WITH_SPAN,
  MAKE_CLOSURE,
  CURRENT_ACTIVATION,
  CURRENT_UNIVERSE,
}

export type NativeSignal =
  | NSInvoke
  | NSApply
  | NSAwait
  | NSEvaluate
  | NSJump
  | NSTranscriptWrite
  | NSMakeClosure
  | NSWithSpan
  | NSCurrentActivation
  | NSCurrentUniverse;

export abstract class NSBase {}

export class NSInvoke extends NSBase {
  readonly tag = NativeSignalTag.INVOKE;

  constructor(readonly name: string, readonly args: CrochetValue[]) {
    super();
  }
}

export class NSApply extends NSBase {
  readonly tag = NativeSignalTag.APPLY;

  constructor(readonly fn: CrochetValue, readonly args: CrochetValue[]) {
    super();
  }
}

export class NSWithSpan extends NSBase {
  readonly tag = NativeSignalTag.WITH_SPAN;

  constructor(
    readonly fn: (span: TraceSpan) => Machine<CrochetValue>,
    readonly description: string
  ) {
    super();
  }
}

export class NSMakeClosure extends NSBase {
  readonly tag = NativeSignalTag.MAKE_CLOSURE;

  constructor(
    readonly arity: number,
    readonly fn: (...args: CrochetValue[]) => Machine<CrochetValue>
  ) {
    super();
  }
}

export class NSCurrentActivation extends NSBase {
  readonly tag = NativeSignalTag.CURRENT_ACTIVATION;
}

export class NSCurrentUniverse extends NSBase {
  readonly tag = NativeSignalTag.CURRENT_UNIVERSE;
}

export class NSAwait extends NSBase {
  readonly tag = NativeSignalTag.AWAIT;

  constructor(readonly promise: Promise<CrochetValue>) {
    super();
  }
}

export class NSEvaluate extends NSBase {
  readonly tag = NativeSignalTag.EVALUATE;

  constructor(readonly env: Environment, readonly block: IR.BasicBlock) {
    super();
  }
}

export class NSJump extends NSBase {
  readonly tag = NativeSignalTag.JUMP;

  constructor(readonly activation: (parent: Activation) => Activation) {
    super();
  }
}

export class NSTranscriptWrite extends NSBase {
  readonly tag = NativeSignalTag.TRANSCRIPT_WRITE;

  constructor(
    readonly tag_name: CrochetValue,
    readonly message: CrochetValue | string
  ) {
    super();
  }
}

export type NativeLocation = NativeFunction | null;

export class NativeActivation implements IActivation {
  readonly tag = ActivationTag.NATIVE_ACTIVATION;
  public span: TraceSpan | null;

  constructor(
    readonly parent: Activation | null,
    readonly location: NativeLocation,
    readonly env: Environment,
    readonly routine: Machine<CrochetValue>,
    readonly handlers: HandlerStack,
    readonly continuation: Continuation
  ) {
    if (parent != null) {
      this.span = parent.span;
    } else {
      this.span = null;
    }
  }
}

export class Universe {
  readonly type_cache = new Map<CrochetType, CrochetType>();
  readonly reverse_type_cache = new Map<CrochetType, CrochetType>();
  readonly static_type_cache = new Map<CrochetType, CrochetValue>();
  readonly registered_instances = new Map<CrochetType, CrochetValue[]>();
  readonly nothing: CrochetValue;
  readonly true: CrochetValue;
  readonly false: CrochetValue;
  readonly integer_cache: CrochetValue[];
  readonly float_cache: CrochetValue[];
  readonly trusted_base = new Set<CrochetPackage>();

  constructor(
    readonly trace: CrochetTrace,
    readonly world: CrochetWorld,
    readonly random: XorShift,
    readonly types: {
      Any: CrochetType;
      Unknown: CrochetType;
      Protected: CrochetType;
      Nothing: CrochetType;
      True: CrochetType;
      False: CrochetType;
      Integer: CrochetType;
      Float_64: CrochetType;
      UnsafeArbitraryText: CrochetType;
      UntrustedText: CrochetType;
      Text: CrochetType;
      StaticText: CrochetType;
      DynamicText: CrochetType;
      Interpolation: CrochetType;
      Function: CrochetType[];
      NativeFunctions: CrochetType[];
      Thunk: CrochetType;
      Record: CrochetType;
      List: CrochetType;
      Enum: CrochetType;
      Type: CrochetType;
      Cell: CrochetType;
      Action: CrochetType;
      ActionChoice: CrochetType;
      Effect: CrochetType;
      Skeleton: {
        Node: CrochetType;
        Name: CrochetType;
        Literal: CrochetType;
        Dynamic: CrochetType;
        List: CrochetType;
        Interpolation: CrochetType;
      };
    }
  ) {
    this.nothing = new CrochetValue(Tag.NOTHING, types.Nothing, null);
    this.true = new CrochetValue(Tag.TRUE, types.True, null);
    this.false = new CrochetValue(Tag.FALSE, types.False, null);

    this.integer_cache = [];
    this.float_cache = [];
    for (let i = 0; i < 256; ++i) {
      this.integer_cache[i] = new CrochetValue(
        Tag.INTEGER,
        types.Integer,
        BigInt(i)
      );
      this.float_cache[i] = new CrochetValue(Tag.FLOAT_64, types.Float_64, i);
    }
  }

  make_integer(x: bigint) {
    if (x >= 0 && x < this.integer_cache.length) {
      return this.integer_cache[Number(x)];
    } else {
      return new CrochetValue(Tag.INTEGER, this.types.Integer, x);
    }
  }

  make_float_64(x: number) {
    if (Number.isInteger(x) && x >= 0 && x < this.float_cache.length) {
      return this.float_cache[x];
    } else {
      return new CrochetValue(Tag.FLOAT_64, this.types.Float_64, x);
    }
  }

  make_text(x: string) {
    return new CrochetValue(Tag.TEXT, this.types.Text, x);
  }
}
//#endregion

//#region Intrinsic supporting data structures
class CMapEntry<V> {
  constructor(readonly key: CrochetValue, public value: V) {}
}

function cmap_is_slow(v: CrochetValue) {
  switch (v.tag) {
    case Tag.INTERPOLATION:
    case Tag.LIST:
    case Tag.RECORD:
    case Tag.TEXT:
      return true;

    default:
      return false;
  }
}

function cmap_is_primitive(v: CrochetValue) {
  switch (v.tag) {
    case Tag.NOTHING:
    case Tag.INTEGER:
    case Tag.FLOAT_64:
    case Tag.TRUE:
    case Tag.FALSE:
      return true;

    default:
      return false;
  }
}

function cmap_get_primitive(v: CrochetValue): Primitive {
  switch (v.tag) {
    case Tag.TRUE:
      return true;
    case Tag.FALSE:
      return false;
    case Tag.NOTHING:
      return null;
    case Tag.INTEGER:
    case Tag.FLOAT_64:
      return v.payload as any;
    default:
      throw new Error(`Unsupported`);
  }
}

export class CMap<V> {
  private _types: {
    integer: CrochetType;
    float_64: CrochetType;
    true: CrochetValue;
    false: CrochetValue;
    nothing: CrochetValue;
  } = Object.create(null)!;
  private slow_entries: CMapEntry<V>[] = [];
  private table = new Map<CrochetValue | Primitive, V>();

  get(key: CrochetValue): V | undefined {
    if (cmap_is_slow(key)) {
      return this.get_slow(key);
    } else if (cmap_is_primitive(key)) {
      return this.table.get(cmap_get_primitive(key));
    } else {
      return this.table.get(key);
    }
  }

  private get_slow(key: CrochetValue): V | undefined {
    for (const entry of this.slow_entries) {
      if (equals(entry.key, key)) {
        return entry.value;
      }
    }
    return undefined;
  }

  has(key: CrochetValue): boolean {
    return this.get(key) !== undefined;
  }

  set(key: CrochetValue, value: V) {
    if (cmap_is_slow(key)) {
      this.set_slow(key, value);
    } else if (cmap_is_primitive(key)) {
      const prim = cmap_get_primitive(key);
      this.remember_type(prim, key);
      this.table.set(cmap_get_primitive(key), value);
    } else {
      this.table.set(key, value);
    }
  }

  private set_slow(key: CrochetValue, value: V) {
    for (const entry of this.slow_entries) {
      if (equals(entry.key, key)) {
        entry.value = value;
      }
    }
    this.slow_entries.push(new CMapEntry(key, value));
  }

  delete(key: CrochetValue) {
    if (cmap_is_slow(key)) {
      this.delete_slow(key);
    } else if (cmap_is_primitive(key)) {
      this.table.delete(cmap_get_primitive(key));
    } else {
      this.table.delete(key);
    }
  }

  private delete_slow(key: CrochetValue) {
    const new_entries = [];
    for (const entry of this.slow_entries) {
      if (!equals(entry.key, key)) {
        new_entries.push(entry);
      }
    }
    this.slow_entries = new_entries;
  }

  *entries(): Generator<[CrochetValue, V]> {
    for (const [k, v] of this.table.entries()) {
      yield [this.materialise_key(k), v];
    }
    for (const entry of this.slow_entries) {
      yield [entry.key, entry.value];
    }
  }

  *values() {
    for (const value of this.table.values()) {
      yield value;
    }
    for (const entry of this.slow_entries) {
      yield entry.value;
    }
  }

  *keys() {
    for (const key of this.table.keys()) {
      yield this.materialise_key(key);
    }
    for (const entry of this.slow_entries) {
      yield entry.key;
    }
  }

  private remember_type(primitive: Primitive, value: CrochetValue) {
    if (primitive === null) {
      if (this._types.nothing) return;
      this._types.nothing = value;
      return;
    }

    switch (typeof primitive) {
      case "bigint":
        if (this._types.integer) break;
        this._types.integer = value.type;
        break;

      case "number":
        if (this._types.float_64) break;
        this._types.float_64 = value.type;
        break;

      case "boolean":
        if (primitive) {
          if (this._types.true) break;
          this._types.true = value;
          break;
        } else {
          if (this._types.false) break;
          this._types.false = value;
          break;
        }

      default:
        throw unreachable(primitive, "unreachable");
    }
  }

  private materialise_key(key: CrochetValue | Primitive) {
    if (key instanceof CrochetValue) {
      return key;
    } else if (key === null) {
      return this._types.nothing;
    } else {
      switch (typeof key) {
        case "number":
          return new CrochetValue(Tag.FLOAT_64, this._types.float_64, key);
        case "bigint":
          return new CrochetValue(Tag.INTEGER, this._types.integer, key);
        case "boolean": {
          if (key) {
            return this._types.true;
          } else {
            return this._types.false;
          }
        }
        default:
          throw unreachable(key, "unreachable");
      }
    }
  }

  get size() {
    return this.table.size + this.slow_entries.length;
  }
}

//#endregion
