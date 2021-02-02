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
import { show, unreachable } from "../utils/utils";
import {
  CrochetBoolean,
  CrochetFloat,
  CrochetInteger,
  CrochetText,
  CrochetValue,
  nothing,
} from "./intrinsics";

export class CrochetVM {
  private root_env = new Environment(null);
  private queue: Activation[] = [];
  private scenes = new Map<string, Scene>();
  private running = false;
  private tracing = false;

  constructor(private ffi: ForeignInterface) {}

  //== Public operations
  async run() {
    if (this.running) {
      throw new Error(`Trying to run the VM twice.`);
    }

    this.running = true;
    while (this.queue.length !== 0) {
      await this.run_next();
    }
  }

  load_module(module: Module) {
    for (const declaration of module.declarations) {
      this.load_declaration(this.root_env, declaration);
    }
  }

  get_scene(activation: Activation, name: string) {
    const scene = this.scenes.get(name);
    if (scene == null) {
      throw new Error(`Undefined scene ${name}`);
    }
    return scene;
  }

  make_scene_activation(activation0: Activation, scene: Scene) {
    const new_env = new Environment(scene.env);
    const activation = new Activation(activation0, new_env, scene.body);
    return activation;
  }

  assert_text(
    activation: Activation,
    value: CrochetValue
  ): asserts value is CrochetText {
    if (!(value instanceof CrochetText)) {
      throw new Error(`Expected a Text, got ${value}`);
    }
  }

  assert_integer(
    activation: Activation,
    value: CrochetValue
  ): asserts value is CrochetInteger {
    if (!(value instanceof CrochetInteger)) {
      throw new Error(`Expected an Integer, got ${value}`);
    }
  }

  //== Tracing and debugging
  trace(value: boolean) {
    this.tracing = value;
  }

  private trace_operation(activation: Activation, op: Operation) {
    if (this.tracing) {
      console.log(`[TRACE]`, show(op));
    }
  }

  private trace_activation(activation: Activation) {
    if (this.tracing) {
      console.log(
        "[TRACE]",
        show({
          parent: activation.parent != null,
          current: [(activation as any).current_index, activation.current],
          block: activation.block,
          stack: (activation as any).stack,
        })
      );
    }
  }

  //== Running
  private async run_next() {
    let activation: Activation | null = await this.next_activation();
    while (activation != null) {
      this.trace_activation(activation);
      activation = await this.step(activation);
    }
  }

  private async step(activation: Activation): Promise<Activation | null> {
    const operation = activation.current;
    this.trace_operation(activation, operation);
    switch (operation.tag) {
      case "drop": {
        activation.pop();
        activation.next();
        return activation;
      }

      case "halt": {
        return null;
      }

      case "goto": {
        const scene = this.get_scene(activation, operation.name);
        return this.make_scene_activation(activation, scene);
      }

      case "invoke": {
        const procedure = this.get_procedure(activation, operation.name);
        if (procedure.arity !== operation.arity) {
          throw new Error(
            `Invalid arity for ${operation.name}. Expected ${procedure.arity}, got ${operation.arity}`
          );
        }
        const args = activation.pop_many(operation.arity);
        return procedure.invoke(this, activation, args);
      }

      case "push-boolean": {
        activation.push(new CrochetBoolean(operation.value));
        activation.next();
        return activation;
      }

      case "push-float": {
        activation.push(new CrochetFloat(operation.value));
        activation.next();
        return activation;
      }

      case "push-integer": {
        activation.push(new CrochetInteger(operation.value));
        activation.next();
        return activation;
      }

      case "push-local": {
        const value = this.get_local(activation, operation.name);
        activation.push(value);
        activation.next();
        return activation;
      }

      case "push-nothing": {
        activation.push(nothing);
        activation.next();
        return activation;
      }

      case "push-text": {
        activation.push(new CrochetText(operation.value));
        activation.next();
        return activation;
      }

      case "return": {
        const result = activation.pop();
        activation.next();
        const parent = activation.parent;
        if (parent != null) {
          parent.push(result);
          parent.next();
          return parent;
        } else {
          throw new Error(`RETURN with no parent activation`);
        }
      }

      default: {
        unreachable(operation, `Unknown operation`);
        return null;
      }
    }
  }

  private async next_activation() {
    if (this.queue.length === 0) {
      throw new Error(`next_activation() on an empty queue`);
    }
    return this.queue.shift()!;
  }

  //== Declaration evaluation
  private load_declaration(env: Environment, declaration: Declaration) {
    switch (declaration.tag) {
      case "define-scene": {
        const scene = new Scene(declaration.name, env, declaration.body);
        this.add_scene(scene);
        break;
      }

      case "do": {
        const activation = new Activation(null, env, declaration.body);
        this.queue.push(activation);
        break;
      }

      case "define-command": {
        this.add_command(
          env,
          declaration.name,
          declaration.parameters,
          declaration.body
        );
        break;
      }

      case "define-foreign-command": {
        this.add_foreign_command(
          env,
          declaration.name,
          declaration.parameters,
          declaration.args,
          declaration.foreign_name
        );
        break;
      }

      default: {
        unreachable(declaration, `Unknown declaration`);
      }
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

  //== Operation evaluation
  private get_procedure(activation: Activation, name: string) {
    const procedure = activation.env.lookup_procedure(name);
    if (procedure == null) {
      throw new Error(`Undefined procedure ${name}`);
    } else {
      return procedure;
    }
  }

  private get_local(activation: Activation, name: string) {
    const local = activation.env.lookup(name);
    if (local == null) {
      throw new Error(`Undefined local ${name}`);
    } else {
      return local;
    }
  }
}
