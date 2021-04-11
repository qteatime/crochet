import { Action, ConcreteContext, Context, When } from "../simulation";
import {
  ConcreteRelation,
  Predicate,
  PredicateProcedure,
  TreeType,
} from "../logic";
import { TCrochetAny, TCrochetType } from "../primitives";
import {
  Contract,
  CrochetProcedure,
  NativeProcedure,
} from "../primitives/procedure";
import { CrochetModule, cvalue, State, Thread } from "../vm";
import { CrochetTest, Environment, Scene, World } from "../world";
import { Expression } from "./expression";
import { SBlock, Statement } from "./statement";
import { Type } from "./type";
import { SimpleInterpolation } from "./atomic";
import { cast } from "../../utils";
import { CrochetPackage } from "../pkg";
import { Meta, Metadata } from "./meta";

export type ContextualDeclaration = DAction | DWhen;

interface DeclarationContext {
  filename: string;
  module: CrochetModule;
  package: CrochetPackage;
}

export abstract class Declaration {
  abstract apply(
    context: DeclarationContext,
    state: State
  ): Promise<void> | void;

  abstract position: Metadata;
}

export interface IContextualDeclaration {
  apply_to_context(
    declaration_context: DeclarationContext,
    state: State,
    context: Context
  ): Promise<void> | void;
}

export class DRelation extends Declaration {
  constructor(
    readonly position: Metadata,
    readonly name: string,
    readonly type: TreeType
  ) {
    super();
  }

  async apply(context: DeclarationContext, state: State) {
    const relation = new ConcreteRelation(
      context.filename,
      this.name,
      this.type.realise()
    );
    state.world.database.add(this.name, relation);
  }
}

export class DPredicate extends Declaration {
  constructor(
    readonly position: Metadata,
    readonly name: string,
    readonly procedure: PredicateProcedure
  ) {
    super();
  }

  async apply(context: DeclarationContext, state: State) {
    this.procedure.set_filename(context.filename);
    state.world.database.add(this.name, this.procedure);
  }
}

export class DDo extends Declaration {
  constructor(readonly position: Metadata, readonly body: Statement[]) {
    super();
  }

  async apply(context: DeclarationContext, state: State) {
    const block = new SBlock(this.position, this.body);
    state.world.schedule(block.evaluate(state.with_new_env()));
  }
}

export class DForeignCommand extends Declaration {
  constructor(
    readonly position: Metadata,
    readonly name: string,
    readonly types: Type[],
    readonly foreign_name: string,
    readonly parameters: string[],
    readonly args: string[],
    readonly contract: Contract
  ) {
    super();
  }

  async apply(context: DeclarationContext, state: State) {
    const env = new Environment(state.env, context.module, null);
    state.world.procedures.add_foreign(
      this.name,
      this.types.map((x) => x.realise(state)),
      new NativeProcedure(
        context.filename,
        env,
        this.name,
        this.parameters,
        this.args,
        `${context.package.name}:${this.foreign_name}`,
        this.contract
      )
    );
  }
}

export class DCrochetCommand extends Declaration {
  constructor(
    readonly position: Metadata,
    readonly name: string,
    readonly parameters: string[],
    readonly types: Type[],
    readonly body: Statement[],
    readonly contract: Contract
  ) {
    super();
  }

  async apply(context: DeclarationContext, state: State) {
    const env = new Environment(state.env, context.module, null);
    const code = new CrochetProcedure(
      context.filename,
      env,
      state.world,
      this.name,
      this.parameters,
      this.body,
      this.contract
    );
    state.world.procedures.add_crochet(
      this.name,
      this.types.map((x) => x.realise(state)),
      code
    );
  }
}

export class DType extends Declaration {
  constructor(
    readonly position: Metadata,
    readonly local: boolean,
    readonly parent: Type | null,
    readonly name: string,
    readonly fields: { parameter: string; type: Type }[]
  ) {
    super();
  }

  async apply(context: DeclarationContext, state: State) {
    const fields = this.fields.map((x) => x.parameter);
    const types = this.fields.map((x) => x.type.realise(state));
    const layout = new Map(this.fields.map((x, i) => [x.parameter, i]));
    const parent = this.parent ? this.parent.realise(state) : null;
    const type = new TCrochetType(
      context.filename,
      parent ?? TCrochetAny.type,
      this.name,
      types,
      fields,
      layout
    );
    if (parent != null) {
      const parentType = cast(parent, TCrochetType);
      parentType.register_subtype(type);
    }
    context.module.add_type(this.name, type, this.local);
  }
}

export class DDefine extends Declaration {
  constructor(
    readonly position: Metadata,
    readonly local: boolean,
    readonly name: string,
    readonly value: Expression
  ) {
    super();
  }
  async apply(context: DeclarationContext, state: State) {
    const machine = this.value.evaluate(state.with_new_env());
    const value = cvalue(Thread.for_machine(machine).run_sync());
    context.module.add_value(this.name, value, this.local);
  }
}

export class DScene extends Declaration {
  constructor(
    readonly position: Metadata,
    readonly name: string,
    readonly body: Statement[]
  ) {
    super();
  }
  async apply(context: DeclarationContext, state: State) {
    const env = new Environment(state.env, context.module, null);
    const scene = new Scene(context.filename, this.name, env, this.body);
    state.world.scenes.add(this.name, scene);
  }
}

export class DAction extends Declaration implements IContextualDeclaration {
  constructor(
    readonly position: Metadata,
    readonly type_resctiction: Type,
    readonly title: Expression,
    readonly tags: string[],
    readonly predicate: Predicate,
    readonly rank: Expression,
    readonly body: Statement[]
  ) {
    super();
  }

  async apply_to_context(
    declaration_context: DeclarationContext,
    state: State,
    context: Context
  ) {
    const env = new Environment(state.env, declaration_context.module, null);
    const tags = this.tags.map((x) => state.env.module.lookup_value(x));
    const action = new Action(
      declaration_context.filename,
      this.title,
      this.predicate,
      tags,
      env,
      this.rank,
      this.body,
      this.type_resctiction
    );
    context.add_action(action);
  }

  async apply(context: DeclarationContext, state: State) {
    this.apply_to_context(context, state, state.world.global_context);
  }
}

export class DWhen extends Declaration implements IContextualDeclaration {
  constructor(
    readonly position: Metadata,
    readonly predicate: Predicate,
    readonly body: Statement[]
  ) {
    super();
  }

  async apply_to_context(
    declaration_context: DeclarationContext,
    state: State,
    context: Context
  ) {
    const env = new Environment(state.env, declaration_context.module, null);
    const event = new When(
      declaration_context.filename,
      this.predicate,
      env,
      this.body
    );
    context.add_event(event);
  }

  async apply(context: DeclarationContext, state: State) {
    this.apply_to_context(context, state, state.world.global_context);
  }
}

export class DForeignType extends Declaration {
  constructor(
    readonly position: Metadata,
    readonly local: boolean,
    readonly name: string,
    readonly foreign_name: string
  ) {
    super();
  }

  async apply(context: DeclarationContext, state: State) {
    const type = state.world.ffi.types.lookup(
      `${context.package.name}:${this.foreign_name}`
    );
    context.module.add_type(this.name, type, this.local);
  }
}

export class DSealType extends Declaration {
  constructor(readonly position: Metadata, readonly name: string) {
    super();
  }

  async apply(context: DeclarationContext, state: State) {
    const type = cast(context.module.lookup_type(this.name), TCrochetType);
    type.seal();
  }
}

export class DContext extends Declaration {
  constructor(
    readonly position: Metadata,
    readonly name: string,
    readonly declarations: IContextualDeclaration[]
  ) {
    super();
  }

  async apply(declaration_context: DeclarationContext, state: State) {
    const context = new ConcreteContext(
      declaration_context.filename,
      this.name
    );
    state.world.contexts.add(this.name, context);
    for (const x of this.declarations) {
      await x.apply_to_context(declaration_context, state, context);
    }
  }
}

export class DOpen extends Declaration {
  constructor(readonly position: Metadata, readonly ns: string) {
    super();
  }

  async apply(declaration_context: DeclarationContext, state: State) {
    const module = declaration_context.module;
    module.open_namespace(this.ns);
  }
}

export class DTest extends Declaration {
  constructor(
    readonly position: Metadata,
    readonly title: string,
    readonly body: SBlock
  ) {
    super();
  }

  async apply(declaration_context: DeclarationContext, state: State) {
    const test = new CrochetTest(
      declaration_context.module,
      this.title,
      state.env,
      this.body
    );
    declaration_context.module.add_test(test);
  }
}
