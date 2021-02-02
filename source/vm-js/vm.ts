import {
  Declaration,
  DefineCommand,
  DefineForeignCommand,
  DefineScene,
  Do,
  Module,
  Operation,
} from "../ir/operations";
import { Activation, Environment } from "./environment";
import { ForeignInterface } from "./primitives";
import { CrochetForeignProcedure, CrochetProcedure } from "./procedure";
import { Scene } from "./scene";

export class CrochetVM {
  private root_env = new Environment(null);
  private queue: Activation[] = [];
  private scenes = new Map<string, Scene>();

  constructor(private ffi: ForeignInterface) {}

  load_module(module: Module) {
    for (const declaration of module.declarations) {
      this.load_declaration(this.root_env, declaration);
    }
  }

  load_declaration(env: Environment, declaration: Declaration) {
    if (declaration instanceof DefineScene) {
      const scene = new Scene(declaration.name, env, declaration.body);
      this.add_scene(scene);
    } else if (declaration instanceof Do) {
      const activation = new Activation(null, env, declaration.body);
      this.queue.push(activation);
    } else if (declaration instanceof DefineForeignCommand) {
      this.add_foreign_command(
        env,
        declaration.name,
        declaration.parameters,
        declaration.args,
        declaration.foreign_name
      );
    } else if (declaration instanceof DefineCommand) {
      this.add_command(
        env,
        declaration.name,
        declaration.parameters,
        declaration.body
      );
    } else {
      throw new Error(`Unknown declaration`);
    }
  }

  add_scene(scene: Scene) {
    if (this.scenes.has(scene.name)) {
      throw new Error(`Duplicated scene name ${scene.name}`);
    }

    this.scenes.set(scene.name, scene);
  }

  add_foreign_command(
    env: Environment,
    name: string,
    parameters: string[],
    args: number[],
    foreign_name: string
  ) {
    const fun = this.ffi.get(foreign_name);
    if (fun.arity !== args.length) {
      throw new Error(
        `Foreign function ${foreign_name} has arity ${fun.arity}, but was defined with ${args.length} arguments`
      );
    }
    const procedure = new CrochetForeignProcedure(
      name,
      parameters,
      args,
      fun.fn
    );
    if (!env.define_procedure(name, procedure)) {
      throw new Error(`Command ${name} is already defined`);
    }
  }

  add_command(
    env: Environment,
    name: string,
    parameters: string[],
    body: Operation[]
  ) {
    const procedure = new CrochetProcedure(env, name, parameters, body);
    if (!env.define_procedure(name, procedure)) {
      throw new Error(`Command ${name} is already defined`);
    }
  }
}
