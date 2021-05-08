import * as IR from "../ir";
import { BasicBlock } from "../ir";
import { XorShift } from "../utils/xorshift";
import { Namespace, PassthroughNamespace } from "./namespaces";

//#region Base values
export enum Tag {
  NOTHING = 0,
  INTEGER,
  FLOAT_64,
  TEXT,
  TRUE,
  FALSE,
  INTERPOLATION,
  TUPLE,
  RECORD,
  INSTANCE,
  LAMBDA,
  PARTIAL,
  THUNK,
  CELL,
  TYPE,
  UNKNOWN,
}

export type PayloadType = {
  [Tag.NOTHING]: null;
  [Tag.INTEGER]: bigint;
  [Tag.FLOAT_64]: number;
  [Tag.TEXT]: string;
  [Tag.TRUE]: null;
  [Tag.FALSE]: null;
  [Tag.INTERPOLATION]: (string | CrochetValue)[];
  [Tag.TUPLE]: CrochetValue[];
  [Tag.RECORD]: Map<string, CrochetValue>;
  [Tag.INSTANCE]: CrochetValue[];
  [Tag.PARTIAL]: CrochetPartial;
  [Tag.LAMBDA]: CrochetLambda;
  [Tag.THUNK]: CrochetThunk;
  [Tag.CELL]: CrochetCell;
  [Tag.TYPE]: CrochetType;
  [Tag.UNKNOWN]: unknown;
};

export class CrochetValue<T extends Tag = Tag> {
  constructor(
    readonly tag: T,
    readonly type: CrochetType,
    readonly payload: PayloadType[T]
  ) {}
}

export class CrochetLambda {
  constructor(
    readonly env: Environment,
    readonly parameters: string[],
    readonly body: IR.BasicBlock
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

export class CrochetThunk {
  public value: CrochetValue | null = null;
  constructor(readonly env: Environment, readonly body: BasicBlock) {}
}

export class CrochetType {
  public sealed = false;
  readonly layout: Map<string, number>;
  readonly sub_types: CrochetType[] = [];

  constructor(
    readonly module: CrochetModule | null,
    readonly name: string,
    readonly documentation: string,
    readonly parent: CrochetType | null,
    readonly fields: string[],
    readonly types: CrochetType[],
    readonly is_static: boolean,
    readonly meta: IR.Metadata | null
  ) {
    this.layout = new Map(this.fields.map((k, i) => [k, i]));
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
    readonly types: CrochetType[],
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

export type Machine = Generator<NativeSignal, CrochetValue, CrochetValue>;

export type NativePayload = {
  [NativeTag.NATIVE_SYNCHRONOUS]: (...args: CrochetValue[]) => CrochetValue;
  [NativeTag.NATIVE_MACHINE]: (...args: CrochetValue[]) => Machine;
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
  constructor(readonly env: Environment, readonly body: BasicBlock) {}
}

export class CrochetWorld {
  readonly commands = new Namespace<CrochetCommand>(null, null);
  readonly types = new Namespace<CrochetType>(null, null);
  readonly definitions = new Namespace<CrochetValue>(null, null);
  readonly relations = new Namespace<CrochetRelation>(null, null);
  readonly native_types = new Namespace<CrochetType>(null, null);
  readonly native_functions = new Namespace<NativeFunction>(null, null);
  readonly prelude: CrochetPrelude[] = [];
  readonly tests: CrochetTest[] = [];
  readonly packages = new Map<string, CrochetPackage>();
}

export class CrochetPackage {
  readonly types: PassthroughNamespace<CrochetType>;
  readonly definitions: PassthroughNamespace<CrochetValue>;
  readonly relations: PassthroughNamespace<CrochetRelation>;
  readonly native_functions: Namespace<NativeFunction>;
  readonly dependencies = new Set<string>();

  constructor(
    readonly world: CrochetWorld,
    readonly name: string,
    readonly filename: string
  ) {
    this.types = new PassthroughNamespace(world.types, name);
    this.definitions = new PassthroughNamespace(world.definitions, name);
    this.native_functions = new Namespace(world.native_functions, name);
    this.relations = new PassthroughNamespace(world.relations, name);
  }
}

export class CrochetModule {
  readonly types: Namespace<CrochetType>;
  readonly definitions: Namespace<CrochetValue>;
  readonly relations: Namespace<CrochetRelation>;
  readonly open_prefixes: Set<string>;

  constructor(readonly pkg: CrochetPackage, readonly filename: string) {
    this.open_prefixes = new Set();
    this.open_prefixes.add("crochet.core");
    this.types = new Namespace(pkg.types, pkg.name, this.open_prefixes);
    this.definitions = new Namespace(
      pkg.definitions,
      pkg.name,
      this.open_prefixes
    );
    this.relations = new Namespace(pkg.relations, pkg.name, this.open_prefixes);
  }
}
//#endregion

//#region Relations
export enum RelationTag {
  CONCRETE,
}

export type RelationPayload = {
  [RelationTag.CONCRETE]: ConcreteRelation;
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
  public pairs: Pair[] = [];
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

//#region Evaluation
export class Environment {
  readonly bindings = new Map<string, CrochetValue>();

  constructor(
    readonly parent: Environment | null,
    readonly raw_receiver: CrochetValue | null,
    readonly raw_module: CrochetModule | null
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

export enum ActivationTag {
  CROCHET_ACTIVATION,
  NATIVE_ACTIVATION,
}

export type Activation = CrochetActivation | NativeActivation;

export interface IActivation {
  tag: ActivationTag;
  parent: Activation | null;
  continuation: Continuation;
}

export type ActivationLocation =
  | CrochetLambda
  | CrochetCommandBranch
  | CrochetThunk
  | CrochetPrelude
  | CrochetTest
  | NativeFunction
  | null;

export class CrochetActivation implements IActivation {
  readonly tag = ActivationTag.CROCHET_ACTIVATION;
  readonly stack: CrochetValue[] = [];
  readonly block_stack: [number, IR.BasicBlock][] = [];
  private _return: CrochetValue | null = null;
  public instruction: number = 0;

  constructor(
    readonly parent: Activation | null,
    readonly location: ActivationLocation,
    readonly env: Environment,
    readonly continuation: Continuation,
    public block: IR.BasicBlock
  ) {}

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
}

export type NativeSignal = NSInvoke | NSApply | NSAwait | NSEvaluate;

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

export type NativeLocation = NativeFunction | null;

export class NativeActivation implements IActivation {
  readonly tag = ActivationTag.NATIVE_ACTIVATION;
  constructor(
    readonly parent: Activation | null,
    readonly location: NativeLocation,
    readonly env: Environment,
    readonly routine: Machine,
    readonly continuation: Continuation
  ) {}
}

export class Universe {
  readonly type_cache = new Map<CrochetType, CrochetType>();
  readonly registered_instances = new Map<CrochetType, CrochetValue[]>();
  readonly nothing: CrochetValue;
  readonly true: CrochetValue;
  readonly false: CrochetValue;
  readonly integer_cache: CrochetValue[];
  readonly float_cache: CrochetValue[];

  constructor(
    readonly world: CrochetWorld,
    readonly random: XorShift,
    readonly types: {
      Any: CrochetType;
      Unknown: CrochetType;
      Nothing: CrochetType;
      True: CrochetType;
      False: CrochetType;
      Integer: CrochetType;
      Float: CrochetType;
      Text: CrochetType;
      StaticText: CrochetType;
      Interpolation: CrochetType;
      Function: CrochetType[];
      Thunk: CrochetType;
      Record: CrochetType;
      Tuple: CrochetType;
      Enum: CrochetType;
      Type: CrochetType;
      Cell: CrochetType;
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
      this.float_cache[i] = new CrochetValue(Tag.FLOAT_64, types.Float, i);
    }
  }

  make_integer(x: bigint) {
    if (x >= 0 && x < this.integer_cache.length) {
      return this.integer_cache[Number(x)];
    } else {
      return new CrochetValue(Tag.INTEGER, this.types.Integer, x);
    }
  }

  make_float(x: number) {
    if (Number.isInteger(x) && x >= 0 && x < this.float_cache.length) {
      return this.float_cache[x];
    } else {
      return new CrochetValue(Tag.FLOAT_64, this.types.Float, x);
    }
  }

  make_text(x: string) {
    return new CrochetValue(Tag.TEXT, this.types.Text, x);
  }
}
//#endregion
