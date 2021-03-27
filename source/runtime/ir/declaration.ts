import { Action, ConcreteContext, Context, When } from "../simulation";
import {
  ConcreteRelation,
  Predicate,
  PredicateProcedure,
  TreeType,
} from "../logic";
import { CrochetRole, TCrochetAny, TCrochetType } from "../primitives";
import { CrochetProcedure, NativeProcedure } from "../primitives/procedure";
import { cvalue, State, Thread } from "../vm";
import { Environment, Scene, World } from "../world";
import { Expression } from "./expression";
import { SBlock, Statement } from "./statement";
import { Type } from "./type";
import { SimpleInterpolation } from "./atomic";
import { cast } from "../../utils";

export type ContextualDeclaration = DAction | DWhen;

export abstract class Declaration {
  abstract apply(filename: string, state: State): Promise<void> | void;
}

export interface IContextualDeclaration {
  apply_to_context(
    filename: string,
    state: State,
    context: Context
  ): Promise<void> | void;
}

export class DRelation extends Declaration {
  constructor(readonly name: string, readonly type: TreeType) {
    super();
  }

  async apply(filename: string, state: State) {
    const relation = new ConcreteRelation(
      filename,
      this.name,
      this.type.realise()
    );
    state.world.database.add(this.name, relation);
  }
}

export class DPredicate extends Declaration {
  constructor(readonly name: string, readonly procedure: PredicateProcedure) {
    super();
  }

  async apply(filename: string, state: State) {
    this.procedure.set_filename(filename);
    state.world.database.add(this.name, this.procedure);
  }
}

export class DDo extends Declaration {
  constructor(readonly body: Statement[]) {
    super();
  }

  async apply(filename: string, state: State) {
    const block = new SBlock(this.body);
    state.world.schedule(block.evaluate(state.with_new_env()));
  }
}

export class DForeignCommand extends Declaration {
  constructor(
    readonly name: string,
    readonly types: Type[],
    readonly foreign_name: string,
    readonly args: number[]
  ) {
    super();
  }

  async apply(filename: string, state: State) {
    state.world.procedures.add_foreign(
      this.name,
      this.types.map((x) => x.realise(state.world)),
      new NativeProcedure(filename, this.name, this.args, this.foreign_name)
    );
  }
}

export class DCrochetCommand extends Declaration {
  constructor(
    readonly name: string,
    readonly parameters: string[],
    readonly types: Type[],
    readonly body: Statement[]
  ) {
    super();
  }

  async apply(filename: string, state: State) {
    const env = new Environment(state.env, null);
    const code = new CrochetProcedure(
      filename,
      env,
      state.world,
      this.name,
      this.parameters,
      this.body
    );
    state.world.procedures.add_crochet(
      this.name,
      this.types.map((x) => x.realise(state.world)),
      code
    );
  }
}

export class DRole extends Declaration {
  constructor(readonly name: string) {
    super();
  }

  async apply(filename: string, state: State) {
    const role = new CrochetRole(filename, this.name);
    state.world.roles.add(this.name, role);
  }
}

export class DType extends Declaration {
  constructor(
    readonly parent: Type | null,
    readonly name: string,
    readonly roles: string[],
    readonly fields: { parameter: string; type: Type }[]
  ) {
    super();
  }

  async apply(filename: string, state: State) {
    const roles = this.roles.map((x) => state.world.roles.lookup(x));
    const fields = this.fields.map((x) => x.parameter);
    const types = this.fields.map((x) => x.type.realise(state.world));
    const layout = new Map(this.fields.map((x, i) => [x.parameter, i]));
    const parent = this.parent ? this.parent.realise(state.world) : null;
    const type = new TCrochetType(
      filename,
      parent ?? TCrochetAny.type,
      this.name,
      new Set(roles),
      types,
      fields,
      layout
    );
    if (parent != null) {
      const parentType = cast(parent, TCrochetType);
      parentType.register_subtype(type);
    }
    state.world.types.add(this.name, type);
  }
}

export class DDefine extends Declaration {
  constructor(readonly name: string, readonly value: Expression) {
    super();
  }
  async apply(filename: string, state: State) {
    const machine = this.value.evaluate(state.with_new_env());
    const value = cvalue(Thread.for_machine(machine).run_sync());
    state.world.globals.add(this.name, value);
  }
}

export class DScene extends Declaration {
  constructor(readonly name: string, readonly body: Statement[]) {
    super();
  }
  async apply(filename: string, state: State) {
    const env = new Environment(state.env, null);
    const scene = new Scene(filename, this.name, env, this.body);
    state.world.scenes.add(this.name, scene);
  }
}

export class DAction extends Declaration implements IContextualDeclaration {
  constructor(
    readonly title: SimpleInterpolation<string>,
    readonly tags: string[],
    readonly predicate: Predicate,
    readonly rank: Expression,
    readonly body: Statement[]
  ) {
    super();
  }

  async apply_to_context(filename: string, state: State, context: Context) {
    const env = new Environment(state.env, null);
    const tags = this.tags.map((x) => state.world.globals.lookup(x));
    const action = new Action(
      filename,
      this.title,
      this.predicate,
      tags,
      env,
      this.rank,
      this.body
    );
    context.add_action(action);
  }

  async apply(filename: string, state: State) {
    this.apply_to_context(filename, state, state.world.global_context);
  }
}

export class DWhen extends Declaration implements IContextualDeclaration {
  constructor(readonly predicate: Predicate, readonly body: Statement[]) {
    super();
  }

  async apply_to_context(filename: string, state: State, context: Context) {
    const env = new Environment(state.env, null);
    const event = new When(filename, this.predicate, env, this.body);
    context.add_event(event);
  }

  async apply(filename: string, state: State) {
    this.apply_to_context(filename, state, state.world.global_context);
  }
}

export class DForeignType extends Declaration {
  constructor(readonly name: string, readonly foreign_name: string) {
    super();
  }

  async apply(filename: string, state: State) {
    const type = state.world.ffi.types.lookup(this.foreign_name);
    state.world.types.add(this.name, type);
  }
}

export class DSealType extends Declaration {
  constructor(readonly name: string) {
    super();
  }

  async apply(filename: string, state: State) {
    const type = cast(state.world.types.lookup(this.name), TCrochetType);
    type.seal();
  }
}

export class DContext extends Declaration {
  constructor(
    readonly name: string,
    readonly declarations: IContextualDeclaration[]
  ) {
    super();
  }

  async apply(filename: string, state: State) {
    const context = new ConcreteContext(filename, this.name);
    state.world.contexts.add(this.name, context);
    for (const x of this.declarations) {
      await x.apply_to_context(filename, state, context);
    }
  }
}
