import * as IR from "../ir";
import { BasicBlock } from "../ir";

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
  constructor(readonly value: CrochetValue) {}
}

export class CrochetThunk {
  public value: CrochetValue | null = null;
  constructor(readonly env: Environment, readonly body: BasicBlock) {}
}

export class CrochetType {
  public sealed = false;
  readonly layout: Map<string, number>;

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
}

export type NativePayload = {
  [NativeTag.NATIVE_SYNCHRONOUS]: (...args: CrochetValue[]) => CrochetValue;
};

export class NativeFunction<T extends NativeTag = NativeTag> {
  constructor(readonly tag: T, readonly payload: NativePayload[T]) {}
}

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
  readonly native_types = new Namespace<CrochetType>(null, null);
  readonly native_functions = new Namespace<NativeFunction>(null, null);
  readonly prelude: CrochetPrelude[] = [];
  readonly tests: CrochetTest[] = [];
  readonly packages = new Map<string, CrochetPackage>();
}

export class CrochetPackage {
  readonly types: PassthroughNamespace<CrochetType>;
  readonly definitions: PassthroughNamespace<CrochetValue>;
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
  }
}

export class CrochetModule {
  readonly types: Namespace<CrochetType>;
  readonly definitions: Namespace<CrochetValue>;

  constructor(readonly pkg: CrochetPackage, readonly filename: string) {
    this.types = new Namespace(pkg.types, pkg.name);
    this.types.allowed_prefixes.add("crochet.core");
    this.definitions = new Namespace(pkg.definitions, pkg.name);
    this.definitions.allowed_prefixes.add("crochet.core");
  }
}

export class Environment {
  private bindings = new Map<string, CrochetValue>();

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

export class Namespace<V> {
  private bindings = new Map<string, V>();
  readonly allowed_prefixes = new Set<string>();

  constructor(
    readonly parent: Namespace<V> | null,
    readonly prefix: string | null
  ) {}

  prefixed(name: string): string {
    return this.make_namespace(this.prefix, name);
  }

  make_namespace(namespace: string | null, name: string) {
    if (namespace == null) {
      return name;
    } else {
      return `${namespace}/${name}`;
    }
  }

  define(name: string, value: V): boolean {
    if (this.has_own(name)) {
      return false;
    }
    this.bindings.set(this.prefixed(name), value);
    return true;
  }

  has_own(name: string) {
    return this.bindings.has(this.prefixed(name));
  }

  has(name: string) {
    return this.try_lookup(name) != null;
  }

  try_lookup(name: string) {
    const value = this.try_lookup_namespaced(this.prefix, name);
    if (value != null) {
      return value;
    } else {
      for (const prefix of this.allowed_prefixes) {
        const value = this.try_lookup_namespaced(prefix, name);
        if (value != null) {
          return value;
        }
      }
      return null;
    }
  }

  try_lookup_namespaced(namespace: string | null, name: string): V | null {
    const value = this.bindings.get(this.make_namespace(namespace, name));
    if (value != null) {
      return value;
    } else if (this.parent != null) {
      return this.parent.try_lookup_namespaced(namespace, name);
    } else {
      return null;
    }
  }
}

export class PassthroughNamespace<V> extends Namespace<V> {
  constructor(
    readonly parent: Namespace<V> | null,
    readonly prefix: string | null
  ) {
    super(parent, prefix);
  }

  define(name: string, value: V): boolean {
    return this.parent?.define(this.prefixed(name), value) ?? false;
  }
}

export class State {
  constructor(
    readonly universe: Universe,
    public activation: Activation,
    public continuation: Continuation
  ) {}
}

export enum ContinuationTag {
  RETURN,
  TAP,
}

export type Continuation = ContinuationReturn | ContinuationTap;

export class ContinuationReturn {
  readonly tag = ContinuationTag.RETURN;
}

export class ContinuationTap {
  readonly tag = ContinuationTag.TAP;

  constructor(
    readonly saved_state: State,
    readonly continuation: (state: State, value: CrochetValue) => State
  ) {}
}

export enum ActivationTag {
  CROCHET_ACTIVATION,
}

export type Activation = CrochetActivation;

export interface IActivation {
  tag: ActivationTag;
  parent: IActivation | null;
}

export class CrochetActivation implements IActivation {
  readonly tag = ActivationTag.CROCHET_ACTIVATION;
  readonly stack: CrochetValue[] = [];
  readonly block_stack: [number, IR.BasicBlock][] = [];
  private _return: CrochetValue | null = null;
  public instruction: number = 0;

  constructor(
    readonly parent: Activation | null,
    readonly env: Environment,
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
    this.block_stack.push([this.instruction, b]);
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