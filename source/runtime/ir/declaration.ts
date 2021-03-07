import { Action, Context, When } from "../simulation";
import {
  ConcreteRelation,
  Predicate,
  PredicateProcedure,
  TreeType,
} from "../logic";
import { CrochetRole, TCrochetAny, TCrochetType } from "../primitives";
import { CrochetProcedure, NativeProcedure } from "../primitives/procedure";
import { cvalue, run, State } from "../vm";
import { Environment, Scene, World } from "../world";
import { Expression } from "./expression";
import { SBlock, Statement } from "./statement";
import { Type } from "./type";
import { SimpleInterpolation } from "./atomic";

export type Declaration =
  | DDo
  | DPredicate
  | DRelation
  | DForeignCommand
  | DCrochetCommand
  | DRole
  | DType
  | DDefine
  | DScene
  | DAction
  | DWhen
  | DForeignType;

export type ContextualDeclaration = DAction | DWhen;

interface IDeclaration {
  apply(state: State): Promise<void> | void;
}

interface IContextualDeclaration {
  apply_to_context(state: State, context: Context): Promise<void> | void;
}

export class DRelation implements IDeclaration {
  constructor(readonly name: string, readonly type: TreeType) {}

  apply(state: State) {
    const relation = new ConcreteRelation(this.name, this.type.realise());
    state.world.database.add(this.name, relation);
  }
}

export class DPredicate implements IDeclaration {
  constructor(readonly name: string, readonly procedure: PredicateProcedure) {}

  apply(state: State) {
    state.world.database.add(this.name, this.procedure);
  }
}

export class DDo implements IDeclaration {
  constructor(readonly body: Statement[]) {}

  apply(state: State) {
    const block = new SBlock(this.body);
    state.world.schedule(block.evaluate(state.with_new_env()));
  }
}

export class DForeignCommand implements IDeclaration {
  constructor(
    readonly name: string,
    readonly types: Type[],
    readonly foreign_name: string,
    readonly args: number[]
  ) {}

  apply(state: State) {
    state.world.procedures.add_foreign(
      this.name,
      this.types.map((x) => x.realise(state.world)),
      new NativeProcedure(this.name, this.args, this.foreign_name)
    );
  }
}

export class DCrochetCommand implements IDeclaration {
  constructor(
    readonly name: string,
    readonly parameters: string[],
    readonly types: Type[],
    readonly body: Statement[]
  ) {}

  apply(state: State) {
    const env = new Environment(state.env, null);
    const code = new CrochetProcedure(
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

export class DRole implements IDeclaration {
  constructor(readonly name: string) {}

  apply(state: State) {
    const role = new CrochetRole(this.name);
    state.world.roles.add(this.name, role);
  }
}

export class DType implements IDeclaration {
  constructor(
    readonly parent: Type | null,
    readonly name: string,
    readonly roles: string[],
    readonly fields: { parameter: string; type: Type }[]
  ) {}

  apply(state: State) {
    const roles = this.roles.map((x) => state.world.roles.lookup(x));
    const fields = this.fields.map((x) => x.parameter);
    const types = this.fields.map((x) => x.type.realise(state.world));
    const layout = new Map(this.fields.map((x, i) => [x.parameter, i]));
    const parent = this.parent ? this.parent.realise(state.world) : null;
    const type = new TCrochetType(
      parent ?? TCrochetAny.type,
      this.name,
      new Set(roles),
      types,
      fields,
      layout
    );
    state.world.types.add(this.name, type);
  }
}

export class DDefine implements IDeclaration {
  constructor(readonly name: string, readonly value: Expression) {}
  async apply(state: State) {
    const value = cvalue(await run(this.value.evaluate(state.with_new_env())));
    state.world.globals.add(this.name, value);
  }
}

export class DScene implements IDeclaration {
  constructor(readonly name: string, readonly body: Statement[]) {}
  async apply(state: State) {
    const env = new Environment(state.env, null);
    const scene = new Scene(this.name, env, this.body);
    state.world.scenes.add(this.name, scene);
  }
}

export class DAction implements IDeclaration, IContextualDeclaration {
  constructor(
    readonly title: SimpleInterpolation<string>,
    readonly predicate: Predicate,
    readonly body: Statement[]
  ) {}

  async apply_to_context(state: State, context: Context) {
    const env = new Environment(state.env, null);
    const action = new Action(this.title, this.predicate, [], env, this.body);
    context.actions.push(action);
  }

  async apply(state: State) {
    this.apply_to_context(state, state.world.global_context);
  }
}

export class DWhen implements IDeclaration, IContextualDeclaration {
  constructor(readonly predicate: Predicate, readonly body: Statement[]) {}

  async apply_to_context(state: State, context: Context) {
    const env = new Environment(state.env, null);
    const event = new When(this.predicate, env, this.body);
    context.events.push(event);
  }

  async apply(state: State) {
    this.apply_to_context(state, state.world.global_context);
  }
}

export class DForeignType implements IDeclaration {
  constructor(readonly name: string, readonly foreign_name: string) {}

  async apply(state: State) {
    const type = state.world.ffi.types.lookup(this.foreign_name);
    state.world.types.add(this.name, type);
  }
}
