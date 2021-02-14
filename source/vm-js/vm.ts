import {
  Declaration,
  DefineCommand,
  DefineForeignCommand,
  DefineScene,
  Do,
  Module,
  Operation,
} from "../ir/operations";
import * as IR from "../ir/operations";
import { Activation, Environment } from "./environment";
import { ForeignInterface } from "./primitives";
import { CrochetForeignProcedure, CrochetProcedure } from "./procedure";
import { Action, Context, Hook, Scene } from "./scene";
import { pick, show, unreachable } from "../utils/utils";
import {
  CrochetBoolean,
  CrochetFloat,
  CrochetInteger,
  CrochetRecord,
  CrochetStream,
  CrochetText,
  CrochetActor,
  CrochetValue,
  nothing,
  CrochetBlock,
  CrochetNothing,
  CrochetBox,
} from "./intrinsics";
import { Database, RelationType } from "./logic";
import * as Logic from "./logic";

class Halt {}

export class CrochetVM {
  readonly root_env = new Environment(null);
  private queue: Activation[] = [];
  private scenes = new Map<string, Scene>();
  private contexts = new Map<string, Context>();
  private actions: Action[] = [];
  private running = false;
  private tracing = false;
  readonly database = new Database();

  constructor(private ffi: ForeignInterface) {}

  //== Public operations
  async run() {
    if (this.running) {
      throw new Error(`Trying to run the VM twice.`);
    }

    this.running = true;
    while (this.queue.length !== 0) {
      const result = await this.run_next();
      if (result instanceof Halt) {
        this.running = false;
        break;
      }
    }
  }

  load_module(module: Module) {
    for (const declaration of module.declarations) {
      this.load_declaration(module, this.root_env, declaration);
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

  schedule(activation: Activation) {
    this.queue.push(activation);
  }

  assert_text(
    activation: Activation,
    value: CrochetValue
  ): asserts value is CrochetText {
    if (!(value instanceof CrochetText)) {
      throw new Error(`Expected a Text, got ${value.type}`);
    }
  }

  assert_integer(
    activation: Activation,
    value: CrochetValue
  ): asserts value is CrochetInteger {
    if (!(value instanceof CrochetInteger)) {
      throw new Error(`Expected an Integer, got ${value.type}`);
    }
  }

  assert_stream(
    activation: Activation,
    value: CrochetValue
  ): asserts value is CrochetStream {
    if (!(value instanceof CrochetStream)) {
      throw new Error(`Expected a Stream, got ${value.type}`);
    }
  }

  assert_record(
    activation: Activation,
    value: CrochetValue
  ): asserts value is CrochetRecord {
    if (!(value instanceof CrochetRecord)) {
      throw new Error(`Expected a Record, got ${value.type}`);
    }
  }

  assert_boolean(
    activation: Activation,
    value: CrochetValue
  ): asserts value is CrochetBoolean {
    if (!(value instanceof CrochetBoolean)) {
      throw new Error(`Expected a Boolean, got ${value.type}`);
    }
  }

  assert_actor(
    activation: Activation,
    value: CrochetValue
  ): asserts value is CrochetActor {
    if (!(value instanceof CrochetActor)) {
      throw new Error(`Expected an Actor, got ${value.type}`);
    }
  }

  assert_block(
    activation: Activation,
    value: CrochetValue
  ): asserts value is CrochetBlock {
    if (!(value instanceof CrochetBlock)) {
      throw new Error(`Expected a Block, got ${value.type}`);
    }
  }

  make_block_activation(
    activation: Activation,
    block: CrochetBlock,
    args: CrochetValue[]
  ) {
    if (args.length !== block.parameters.length) {
      throw new Error(
        `Invalid arity. Expected ${block.parameters.length}, got ${args.length}`
      );
    }
    const new_env = new Environment(block.env);
    for (let i = 0; i < block.parameters.length; ++i) {
      new_env.define(block.parameters[i], args[i]);
    }
    const new_activation = new Activation(activation, new_env, block.body);
    return new_activation;
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

  private trace_activation(activation: Activation | null | Halt) {
    if (this.tracing) {
      if (activation instanceof Halt) {
        console.log("[TRACE] Halt");
        return;
      }
      if (activation == null) {
        console.log("[TRACE] Yield");
        return;
      }
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
      const new_activation: Activation | Halt | null = await this.step(
        activation
      );

      if (new_activation !== activation) {
        this.trace_activation(new_activation);
      }

      if (new_activation instanceof Halt) {
        return new_activation;
      } else {
        activation = new_activation;
      }
    }
  }

  private async step(
    activation: Activation
  ): Promise<Activation | Halt | null> {
    const operation = activation.current;
    this.trace_operation(activation, operation);
    switch (operation.tag) {
      case "block": {
        const value = new CrochetBlock(
          activation.env,
          operation.parameters,
          operation.body
        );
        activation.push(value);
        activation.next();
        return activation;
      }

      case "branch": {
        const ifFalse = activation.pop();
        const ifTrue = activation.pop();
        const test = activation.pop();
        this.assert_boolean(activation, test);
        this.assert_block(activation, ifFalse);
        this.assert_block(activation, ifTrue);
        const block = test.value ? ifTrue : ifFalse;
        const new_activation = this.make_block_activation(
          activation,
          block,
          []
        );
        activation.next();
        return new_activation;
      }

      case "drop": {
        activation.pop();
        activation.next();
        return activation;
      }

      case "halt": {
        return new Halt();
      }

      case "goto": {
        const scene = this.get_scene(activation, operation.name);
        return this.make_scene_activation(activation, scene);
      }

      case "insert-fact": {
        const relation = this.get_relation(activation, operation.name);
        if (relation.arity !== operation.arity) {
          throw new Error(
            `Invalid arity for relation ${relation.name}. Expected ${relation.arity}, got ${operation.arity}`
          );
        }
        const values = activation.pop_many(operation.arity);
        relation.insert(values);
        activation.next();
        return activation;
      }

      case "interpolate": {
        const values = activation.pop_many(operation.arity);
        const text = values.reduce((x, y) => {
          return x + y.to_text();
        }, "");
        activation.push(new CrochetText(text));
        activation.next();
        return activation;
      }

      case "invoke": {
        const procedure = this.get_procedure(activation, operation.name);
        if (procedure.arity !== operation.arity) {
          throw new Error(
            `Invalid arity for ${operation.name}. Expected ${procedure.arity}, got ${operation.arity}`
          );
        }
        const args = activation.pop_many(operation.arity);
        activation.next();
        return procedure.invoke(this, activation, args);
      }

      case "let": {
        const value = activation.pop();
        activation.env.define(operation.name, value);
        activation.next();
        return activation;
      }

      case "push-actor": {
        const actor = this.get_actor(activation, operation.name);
        activation.push(actor);
        activation.next();
        return activation;
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

      case "remove-fact": {
        const relation = this.get_relation(activation, operation.name);
        if (relation.arity !== operation.arity) {
          throw new Error(
            `Invalid arity for relation ${relation.name}. Expected ${relation.arity}, got ${operation.arity}`
          );
        }
        const values = activation.pop_many(operation.arity);
        relation.remove(values);
        activation.next();
        return activation;
      }

      case "return": {
        const result = activation.pop();
        activation.next();
        const parent = activation.parent;
        if (parent != null) {
          parent.push(result);
          return parent;
        } else {
          return null;
        }
      }

      case "search": {
        const results0 = this.search(activation, operation.predicate);
        const results = results0.map((x) => new CrochetRecord(x.bound_values));
        activation.push(new CrochetStream(results));
        activation.next();
        return activation;
      }

      case "trigger-action": {
        const chosen = this.pick_action(activation);
        if (chosen != null) {
          const { action, bindings } = chosen;
          const new_env = new Environment(action.env);
          for (const [k, v] of bindings.bound_values.entries()) {
            new_env.define(k, v);
          }
          const new_activation = new Activation(null, new_env, action.body);
          activation.next();
          this.schedule(new_activation);
          this.schedule(activation);
          return null;
        } else {
          activation.next();
          return activation;
        }
      }

      case "trigger-context": {
        const context = this.get_context(activation, operation.name);
        const hooks = this.get_active_hooks(activation, context);
        for (const hook of hooks) {
          this.schedule(hook);
        }
        activation.next();
        this.schedule(activation);
        return null;
      }

      case "yield": {
        activation.next();
        return null;
      }

      default: {
        throw unreachable(operation, `Unknown operation`);
      }
    }
  }

  private evaluate_pattern(activation: Activation, pattern: IR.Pattern) {
    switch (pattern.tag) {
      case "actor-pattern": {
        const actor = this.get_actor(activation, pattern.actor_name);
        return new Logic.ActorPattern(actor);
      }

      case "integer-pattern": {
        return new Logic.ValuePattern(new CrochetInteger(pattern.value));
      }

      case "float-pattern": {
        return new Logic.ValuePattern(new CrochetFloat(pattern.value));
      }

      case "boolean-pattern": {
        return new Logic.ValuePattern(new CrochetBoolean(pattern.value));
      }

      case "nothing-pattern": {
        return new Logic.ValuePattern(nothing);
      }

      case "text-pattern": {
        return new Logic.ValuePattern(new CrochetText(pattern.value));
      }

      case "variable-pattern": {
        return new Logic.VariablePattern(pattern.name);
      }

      default: {
        throw unreachable(pattern, `Unknown pattern`);
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
  private load_declaration(
    module: Module,
    env: Environment,
    declaration: Declaration
  ) {
    switch (declaration.tag) {
      case "define-scene": {
        const scene_env = new Environment(env);
        const scene = new Scene(
          module,
          declaration.name,
          scene_env,
          declaration.body
        );
        this.add_scene(scene);
        break;
      }

      case "do": {
        const do_env = new Environment(env);
        const activation = new Activation(null, do_env, declaration.body);
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

      case "define-action": {
        const action_env = new Environment(env);
        const action = new Action(
          module,
          declaration.title,
          action_env,
          declaration.predicate,
          declaration.body
        );
        this.actions.push(action);
        break;
      }

      case "define-actor": {
        const actor = new CrochetActor(
          declaration.name,
          new Set(declaration.roles)
        );
        env.define_actor(actor.name, actor);
        break;
      }

      case "define-context": {
        const hooks = declaration.hooks.map((x) => {
          return new Hook(module, new Environment(env), x.predicate, x.body);
        });
        const context = new Context(declaration.name, hooks);
        this.define_context(context);
        break;
      }

      case "define-relation": {
        const components = declaration.components;
        if (components.length === 0) {
          throw new Error(`Relation ${declaration.name} has no components`);
        }
        const relation = new RelationType(
          declaration.name,
          components.length,
          components.map((x) => x.evaluate())
        );
        this.database.add(relation);
        break;
      }

      default: {
        unreachable(declaration, `Unknown declaration`);
      }
    }
  }

  define_context(context: Context) {
    if (this.contexts.has(context.name)) {
      throw new Error(`Duplicated context ${context.name}`);
    }
    this.contexts.set(context.name, context);
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

  private get_actor(activation: Activation, name: string) {
    const actor = activation.env.lookup_actor(name);
    if (actor == null) {
      throw new Error(`Undefined actor #${name}`);
    } else {
      return actor;
    }
  }

  private get_relation(activation: Activation, name: string) {
    const relation = this.database.lookup(name);
    if (relation == null) {
      throw new Error(`Undefined relation ${name}`);
    } else {
      return relation;
    }
  }

  private get_context(activation: Activation, name: string) {
    const context = this.contexts.get(name);
    if (context == null) {
      throw new Error(`Undefined context ${name}`);
    } else {
      return context;
    }
  }

  private get_active_hooks(activation0: Activation, context: Context) {
    return context.hooks.flatMap((hook) => {
      const search_activation = new Activation(
        activation0,
        hook.env,
        hook.body
      );
      const results = this.search(search_activation, hook.predicate);
      return results.map((env) => {
        const new_env = new Environment(hook.env);
        for (const [k, v] of env.bound_values) {
          new_env.define(k, v);
        }
        return new Activation(null, new_env, hook.body);
      });
    });
  }

  private simple_interpolate(
    activation: Activation,
    action: Action,
    bindings: Map<string, CrochetValue>
  ) {
    return action.title.parts
      .map((x) => {
        switch (x.tag) {
          case "static":
            return x.text;
          case "variable": {
            const value = bindings.get(x.name);
            if (value != null) {
              return value.to_text();
            } else {
              throw new Error(
                `Unbound variable ${
                  x.name
                } evaluating action ${action.title.static_text()}`
              );
            }
          }
          default:
            throw unreachable(x, "Unknown interpolation part");
        }
      })
      .join("");
  }

  // Actions and turns
  private pick_action(activation: Activation) {
    const available = this.actions.flatMap((x) =>
      this.actions_available(activation, x)
    );
    return pick(available);
  }

  private actions_available(activation: Activation, action: Action) {
    const results = this.search(activation, action.predicate);
    return results.map((x) => ({
      action,
      bindings: x,
      title: this.simple_interpolate(activation, action, x.bound_values),
    }));
  }

  private search(activation: Activation, predicate: IR.Predicate) {
    return predicate.relations
      .reduce(
        (envs, pred) => {
          return envs.flatMap((env) =>
            this.refine_search(activation, env, pred)
          );
        },
        [new Logic.UnificationEnvironment()]
      )
      .filter((uenv) => {
        const valid = this.evaluate_constraint(
          activation,
          uenv,
          predicate.constraint
        );
        this.assert_boolean(activation, valid);
        return valid.value;
      });
  }

  private refine_search(
    activation: Activation,
    env: Logic.UnificationEnvironment,
    predicate: IR.PredicateRelation
  ) {
    const relation = this.get_relation(activation, predicate.name);
    const patterns = predicate.patterns.map((x) =>
      this.evaluate_pattern(activation, x)
    );
    return relation.search(patterns, env);
  }

  private evaluate_constraint(
    activation: Activation,
    uenv: Logic.UnificationEnvironment,
    constraint: IR.Constraint
  ): CrochetValue {
    switch (constraint.tag) {
      case "actor": {
        return this.get_actor(activation, constraint.name);
      }

      case "and": {
        const left = this.evaluate_constraint(
          activation,
          uenv,
          constraint.left
        );
        const right = this.evaluate_constraint(
          activation,
          uenv,
          constraint.right
        );
        this.assert_boolean(activation, left);
        this.assert_boolean(activation, right);
        return new CrochetBoolean(left.value && right.value);
      }

      case "boolean": {
        return new CrochetBoolean(constraint.value);
      }

      case "equal": {
        const left = this.evaluate_constraint(
          activation,
          uenv,
          constraint.left
        );
        const right = this.evaluate_constraint(
          activation,
          uenv,
          constraint.right
        );
        return new CrochetBoolean(left.equals(right));
      }

      case "not": {
        const value = this.evaluate_constraint(
          activation,
          uenv,
          constraint.expr
        );
        this.assert_boolean(activation, value);
        return new CrochetBoolean(!value.value);
      }

      case "not-equal": {
        const left = this.evaluate_constraint(
          activation,
          uenv,
          constraint.left
        );
        const right = this.evaluate_constraint(
          activation,
          uenv,
          constraint.right
        );
        return new CrochetBoolean(!left.equals(right));
      }

      case "or": {
        const left = this.evaluate_constraint(
          activation,
          uenv,
          constraint.left
        );
        const right = this.evaluate_constraint(
          activation,
          uenv,
          constraint.right
        );
        this.assert_boolean(activation, left);
        this.assert_boolean(activation, right);
        return new CrochetBoolean(left.value || right.value);
      }

      case "role": {
        const value = this.evaluate_constraint(
          activation,
          uenv,
          constraint.expr
        );
        this.assert_actor(activation, value);
        return new CrochetBoolean(value.has_role(constraint.role));
      }

      case "variable": {
        const local = uenv.bound_values.get(constraint.name);
        if (local != null) {
          return local;
        } else {
          return this.get_local(activation, constraint.name);
        }
      }

      default:
        throw unreachable(constraint, "Unknown constraint");
    }
  }
}

export class CrochetVMInterface {
  constructor(private vm: CrochetVM, private activation: Activation) {}

  // Assertions
  assert_text(x: CrochetValue): asserts x is CrochetText {
    this.vm.assert_text(this.activation, x);
  }

  assert_integer(x: CrochetValue): asserts x is CrochetInteger {
    this.vm.assert_integer(this.activation, x);
  }

  assert_boolean(x: CrochetValue): asserts x is CrochetBoolean {
    this.vm.assert_boolean(this.activation, x);
  }

  assert_nothing(x: CrochetValue): asserts x is CrochetNothing {
    if (!(x instanceof CrochetNothing)) {
      throw new Error(`Expected Nothing, got ${x.type}`);
    }
  }

  assert_actor(x: CrochetValue): asserts x is CrochetActor {
    this.vm.assert_actor(this.activation, x);
  }

  assert_record(x: CrochetValue): asserts x is CrochetRecord {
    this.vm.assert_record(this.activation, x);
  }

  assert_stream(x: CrochetValue): asserts x is CrochetStream {
    this.vm.assert_stream(this.activation, x);
  }

  assert_block(x: CrochetValue): asserts x is CrochetBlock {
    this.vm.assert_block(this.activation, x);
  }

  assert_box(x: CrochetValue): asserts x is CrochetBox {
    if (!(x instanceof CrochetBox)) {
      throw new Error(`Expected a Box, got ${x.type}`);
    }
  }

  // Constructors
  get nothing() {
    return nothing;
  }

  text(x: string) {
    return new CrochetText(x);
  }

  integer(x: bigint) {
    return new CrochetInteger(x);
  }

  float(x: number) {
    return new CrochetFloat(x);
  }

  boolean(x: boolean) {
    return new CrochetBoolean(x);
  }

  record(x: Map<string, CrochetValue>) {
    return new CrochetRecord(x);
  }

  stream(x: CrochetValue[]) {
    return new CrochetStream(x);
  }

  box(x: any) {
    return new CrochetBox(x);
  }
}
