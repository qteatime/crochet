import * as IR from "../ir";
import { AssertType } from "../ir";
import { logger } from "../utils/logger";
import { unreachable } from "../utils/utils";
import { CrochetEvaluationError, ErrArbitrary } from "./errors";
import {
  Activation,
  ActivationTag,
  Continuation,
  ContinuationTag,
  ContinuationTap,
  CrochetActivation,
  CrochetModule,
  CrochetValue,
  Environment,
  HandlerStack,
  NativeActivation,
  NativeSignalTag,
  NativeTag,
  NSBase,
  SimulationSignal,
  SimulationState,
  State,
  Universe,
  _done,
  _return,
  CrochetNativeLambda,
  Tag,
  TraceSpan,
} from "./intrinsics";
import { Relation, run_match_case, run_search, search } from "./logic";
import { Namespace } from "./namespaces";
import {
  Environments,
  Literals,
  Location,
  Native,
  Types,
  Values,
  Commands,
  Lambdas,
  StackTrace,
  Effects,
  DSL,
  Capability,
  Modules,
} from "./primitives";
import { Contexts } from "./simulation";
import { run_simulation } from "./simulation/simulation";
import { TELog, TENew, EventLocation } from "./tracing";

export enum RunResultTag {
  DONE,
  AWAIT,
}

export class RunResultDone {
  readonly tag = RunResultTag.DONE;
  constructor(readonly value: CrochetValue) {}
}

export class RunResultAwait {
  readonly tag = RunResultTag.AWAIT;
  constructor(readonly promise: Promise<CrochetValue>) {}
}

export enum SignalTag {
  RETURN,
  JUMP,
  CONTINUE,
  SET_STATE,
  AWAIT,
}

export type Signal =
  | ReturnSignal
  | JumpSignal
  | ContinueSignal
  | SetStateSignal
  | AwaitSignal;

export class ReturnSignal {
  readonly tag = SignalTag.RETURN;
  constructor(readonly value: CrochetValue) {}
}

export class JumpSignal {
  readonly tag = SignalTag.JUMP;
  constructor(readonly activation: Activation) {}
}

export class ContinueSignal {
  readonly tag = SignalTag.CONTINUE;
}

export class SetStateSignal {
  readonly tag = SignalTag.SET_STATE;
  constructor(readonly state: State) {}
}

export class AwaitSignal {
  readonly tag = SignalTag.AWAIT;
  constructor(readonly promise: Promise<CrochetValue>) {}
}

const _continue = new ContinueSignal();

export class Thread {
  constructor(private state: State) {}

  static run_sync(
    universe: Universe,
    module: CrochetModule,
    block: IR.BasicBlock
  ): CrochetValue {
    const root = new State(
      universe,
      new CrochetActivation(
        null,
        null,
        new Environment(null, null, module, null),
        _done,
        new HandlerStack(null, []),
        block
      ),
      universe.random
    );
    const thread = new Thread(root);
    const value = thread.run_synchronous();
    return value;
  }

  async run_to_completion(): Promise<CrochetValue> {
    let result = this.run();
    while (true) {
      switch (result.tag) {
        case RunResultTag.DONE:
          return result.value;

        case RunResultTag.AWAIT: {
          const value = await result.promise;
          result = this.run_with_input(value);
          continue;
        }

        default:
          throw unreachable(result, "RunResult");
      }
    }
  }

  run_synchronous(): CrochetValue {
    const result = this.run();
    switch (result.tag) {
      case RunResultTag.DONE:
        return result.value;

      case RunResultTag.AWAIT:
        throw new ErrArbitrary(
          "non-synchronous-completion",
          `Expected a synchronous completion, but got an asynchronous signal`
        );

      default:
        throw unreachable(result, "RunResult");
    }
  }

  run_with_input(input: CrochetValue) {
    const activation = this.state.activation;
    switch (activation.tag) {
      case ActivationTag.CROCHET_ACTIVATION: {
        this.push(activation, input);
        activation.next();
        return this.run();
      }

      case ActivationTag.NATIVE_ACTIVATION: {
        const signal = this.step_native(activation, input);
        return this.run(signal);
      }

      default:
        throw unreachable(activation, "Activation");
    }
  }

  run(initial_signal?: Signal) {
    logger.debug(`Running`, () =>
      Location.simple_activation(this.state.activation)
    );
    try {
      let signal = initial_signal ?? this.step();
      while (true) {
        switch (signal.tag) {
          case SignalTag.CONTINUE:
            signal = this.step();
            continue;

          case SignalTag.RETURN: {
            return new RunResultDone(signal.value);
          }

          case SignalTag.SET_STATE: {
            this.state = signal.state;
            signal = this.step();
            continue;
          }

          case SignalTag.JUMP: {
            this.state.activation = signal.activation;
            logger.debug("Jump to", () =>
              Location.simple_activation((signal as JumpSignal).activation)
            );
            signal = this.step();
            continue;
          }

          case SignalTag.AWAIT: {
            return new RunResultAwait(signal.promise);
          }

          default:
            throw unreachable(signal, `Signal`);
        }
      }
    } catch (error: any) {
      const trace = StackTrace.collect_trace(this.state.activation);
      const formatted_trace = StackTrace.format_entries(trace);
      throw new CrochetEvaluationError(error, trace, formatted_trace);
    }
  }

  step() {
    const activation = this.state.activation;

    switch (activation.tag) {
      case ActivationTag.CROCHET_ACTIVATION: {
        return this.step_crochet(activation);
      }

      case ActivationTag.NATIVE_ACTIVATION: {
        return this.step_native(activation, this.universe.nothing);
      }

      default:
        throw unreachable(activation, `Activation`);
    }
  }

  apply_continuation(
    value: CrochetValue,
    k: Continuation,
    activation: Activation
  ) {
    switch (k.tag) {
      case ContinuationTag.DONE: {
        return new ReturnSignal(value);
      }

      case ContinuationTag.RETURN: {
        switch (activation.tag) {
          case ActivationTag.CROCHET_ACTIVATION: {
            this.push(activation, value);
            activation.next();
            return new JumpSignal(activation);
          }

          case ActivationTag.NATIVE_ACTIVATION: {
            return this.step_native(activation, value);
          }

          default:
            throw unreachable(activation, `Activation`);
        }
      }

      case ContinuationTag.TAP: {
        logger.debug("Applying continuation", () => k.continuation);
        const new_state = k.continuation(k.saved_state, this.state, value);
        return new SetStateSignal(new_state);
      }

      default:
        throw unreachable(k, `Continuation`);
    }
  }

  do_return(value: CrochetValue, activation: Activation | null): Signal {
    if (activation == null) {
      return new ReturnSignal(value);
    } else {
      return this.apply_continuation(
        value,
        this.state.activation.continuation,
        activation
      );
    }
  }

  step_native(activation: NativeActivation, input: CrochetValue): Signal {
    const { value, done } = activation.routine.next(input);
    if (done) {
      if (!(value instanceof CrochetValue)) {
        throw new ErrArbitrary(
          "invalid-native-return",
          `The native function did not return a valid Crochet value`
        );
      }
      return this.do_return(value, activation.parent);
    } else {
      if (!(value instanceof NSBase)) {
        throw new ErrArbitrary(
          "invalid-native-yield",
          "The native function did not yield a valid signal"
        );
      }
      switch (value.tag) {
        case NativeSignalTag.INVOKE: {
          const command = Commands.get_command(this.universe, value.name);
          const branch = Commands.select_branch(command, value.args);
          const new_activation = Commands.prepare_activation(
            activation,
            branch,
            value.args
          );
          return new JumpSignal(new_activation);
        }

        case NativeSignalTag.APPLY: {
          const new_activation = Lambdas.prepare_activation(
            this.universe,
            activation,
            this.env,
            value.fn,
            value.args
          );
          return new JumpSignal(new_activation);
        }

        case NativeSignalTag.EVALUATE: {
          const new_activation = new CrochetActivation(
            activation,
            null,
            value.env,
            _return,
            activation.handlers,
            value.block
          );
          return new JumpSignal(new_activation);
        }

        case NativeSignalTag.AWAIT: {
          return new AwaitSignal(value.promise);
        }

        case NativeSignalTag.JUMP: {
          return new JumpSignal(value.activation(activation));
        }

        case NativeSignalTag.TRANSCRIPT_WRITE: {
          this.universe.trace.publish_log(
            activation,
            "transcript.write",
            value.tag_name,
            value.message
          );
          return this.step_native(activation, this.universe.nothing);
        }

        case NativeSignalTag.MAKE_CLOSURE: {
          return this.step_native(
            activation,
            new CrochetValue(
              Tag.NATIVE_LAMBDA,
              this.universe.types.NativeFunctions[value.arity],
              new CrochetNativeLambda(
                value.arity,
                activation.handlers,
                value.fn
              )
            )
          );
        }

        case NativeSignalTag.WITH_SPAN: {
          const span = new TraceSpan(
            activation.span,
            activation.location,
            value.description
          );
          const machine = value.fn(span);
          const new_activation = new NativeActivation(
            activation,
            activation.location,
            new Environment(null, null, null, null),
            machine,
            activation.handlers,
            _return
          );
          new_activation.span = span;
          return new JumpSignal(new_activation);
        }

        case NativeSignalTag.CURRENT_ACTIVATION: {
          return this.step_native(
            activation,
            Values.box(this.universe, activation)
          );
        }

        case NativeSignalTag.CURRENT_UNIVERSE: {
          return this.step_native(
            activation,
            Values.box(this.universe, this.universe)
          );
        }

        default:
          throw unreachable(value, `Native Signal`);
      }
    }
  }

  step_crochet(activation: CrochetActivation): Signal {
    const op = activation.current;
    if (op == null) {
      if (activation.block_stack.length > 0) {
        logger.debug(`Finished with block, taking next block`);
        activation.pop_block();
        activation.next();
        return _continue;
      } else {
        const value = activation.return_value ?? this.universe.nothing;
        logger.debug(`Finished with activation, return value:`, () =>
          Location.simple_value(value)
        );
        return this.do_return(value, activation.parent);
      }
    }

    logger.debug(`Stack:`, () => activation.stack.map(Location.simple_value));
    logger.debug(`Executing operation:`, () =>
      Location.simple_op(op, activation.instruction)
    );

    const t = IR.OpTag;
    switch (op.tag) {
      case t.DROP: {
        this.pop(activation);
        activation.next();
        return _continue;
      }

      case t.LET: {
        const value = this.pop(activation);
        this.define(op.name, value, op.meta);
        activation.next();
        return _continue;
      }

      case t.PUSH_VARIABLE: {
        const value = this.lookup(op.name, op.meta);
        this.push(activation, value);
        activation.next();
        return _continue;
      }

      case t.PUSH_SELF: {
        const value = this.get_self(op.meta);
        this.push(activation, value);
        activation.next();
        return _continue;
      }

      case t.PUSH_GLOBAL: {
        const value = this.lookup_global(op.name, op.meta);
        this.push(activation, value);
        activation.next();
        return _continue;
      }

      case t.PUSH_LITERAL: {
        const value = Literals.materialise_literal(
          this.state.universe,
          op.value
        );
        this.push(activation, value);
        activation.next();
        return _continue;
      }

      case t.PUSH_RETURN: {
        const value = activation.return_value;
        if (value == null) {
          throw new ErrArbitrary(
            "no-return",
            `Trying to access the return value, but no return value was defined yet`
          );
        } else {
          this.push(activation, value);
        }
        activation.next();
        return _continue;
      }

      case t.PUSH_LIST: {
        const values = this.pop_many(activation, op.arity);
        const list = Values.make_list(this.state.universe, values);
        this.push(activation, list);
        activation.next();
        return _continue;
      }

      case t.PUSH_NEW: {
        const values = this.pop_many(activation, op.arity);
        const type0 = Types.materialise_type(
          this.state.universe,
          this.module,
          op.type
        );
        const type = Capability.free_type(this.module, type0);
        Capability.assert_construct_capability(
          this.universe,
          this.module,
          type
        );
        const value = Values.instantiate(type, values);
        this.universe.trace.publish(
          new TENew(
            EventLocation.from_activation(activation, null),
            type,
            values
          )
        );
        this.push(activation, value);
        activation.next();
        return _continue;
      }

      case t.PUSH_STATIC_TYPE: {
        const type0 = Types.materialise_type(
          this.universe,
          this.module,
          op.type
        );
        const type = Capability.free_type(this.module, type0);
        const static_type = Types.get_static_type(this.universe, type);
        const value = Values.make_static_type(this.universe, static_type);
        this.push(activation, value);
        activation.next();
        return _continue;
      }

      case t.INTERPOLATE: {
        const result: (string | CrochetValue)[] = [];
        for (const part of op.parts) {
          if (part == null) {
            result.push(this.pop(activation));
          } else {
            result.push(part);
          }
        }
        const value = Values.make_interpolation(this.universe, result);
        this.push(activation, value);
        activation.next();
        return _continue;
      }

      case t.PUSH_LAZY: {
        const env = Environments.clone(this.env);
        const thunk = Values.make_thunk(this.universe, env, op.body);
        this.push(activation, thunk);
        activation.next();
        return _continue;
      }

      case t.FORCE: {
        const value = this.pop(activation);
        const thunk = Values.get_thunk(value);
        if (thunk.value != null) {
          this.push(activation, thunk.value);
          activation.next();
          return _continue;
        } else {
          return new JumpSignal(
            new CrochetActivation(
              this.state.activation,
              thunk,
              thunk.env,
              new ContinuationTap(this.state, (_previous, _state, value) => {
                Values.update_thunk(thunk, value);
                this.push(activation, value);
                activation.next();
                return new State(
                  this.universe,
                  activation,
                  this.universe.random
                );
              }),
              activation.handlers,
              thunk.body
            )
          );
        }
      }

      case t.PUSH_LAMBDA: {
        const value = Values.make_lambda(
          this.universe,
          this.env,
          op.parameters,
          op.body
        );
        this.push(activation, value);
        activation.next();
        return _continue;
      }

      case t.INVOKE_FOREIGN: {
        const fn = Native.get_native(this.module, op.name);
        const args = this.pop_many(activation, op.arity);
        switch (fn.tag) {
          case NativeTag.NATIVE_SYNCHRONOUS: {
            Native.assert_native_tag(NativeTag.NATIVE_SYNCHRONOUS, fn);
            const value = fn.payload(...args);
            if (!(value instanceof CrochetValue)) {
              throw new ErrArbitrary(
                `invalid-value`,
                `Native function ${fn.name} in ${fn.pkg.name} returned an invalid value ${value}`
              );
            }
            this.push(activation, value);
            activation.next();
            return _continue;
          }

          case NativeTag.NATIVE_MACHINE: {
            Native.assert_native_tag(NativeTag.NATIVE_MACHINE, fn);
            const machine = fn.payload(...args);
            const new_activation = new NativeActivation(
              activation,
              fn,
              this.env,
              machine,
              activation.handlers,
              _return
            );
            return new JumpSignal(new_activation);
          }

          default:
            throw unreachable(fn.tag, `Native function`);
        }
      }

      case t.INVOKE: {
        const command = Commands.get_command(this.universe, op.name);
        const args = this.pop_many(activation, op.arity);
        const branch = Commands.select_branch(command, args);
        const new_activation = Commands.prepare_activation(
          activation,
          branch,
          args
        );
        this.universe.trace.publish_invoke(
          activation,
          branch,
          new_activation,
          args
        );
        return new JumpSignal(new_activation);
      }

      case t.APPLY: {
        const lambda = this.pop(activation);
        const args = this.pop_many(activation, op.arity);
        const new_activation = Lambdas.prepare_activation(
          this.universe,
          activation,
          this.env,
          lambda,
          args
        );
        return new JumpSignal(new_activation);
      }

      case t.RETURN: {
        // FIXME: we should generate RETURNs properly instead...
        let value;
        if (activation.stack.length > 0) {
          value = this.pop(activation);
        } else {
          value = this.universe.nothing;
        }
        activation.set_return_value(value);
        this.universe.trace.publish_return(activation, value);
        activation.next();
        return _continue;
      }

      case t.PUSH_PARTIAL: {
        const value = Values.make_partial(
          this.universe,
          this.module,
          op.name,
          op.arity
        );
        this.push(activation, value);
        activation.next();
        return _continue;
      }

      case t.ASSERT: {
        const value = this.pop(activation);
        let diagnostics = "";
        if (op.expression != null) {
          const [name, params] = op.expression;
          const args = params.map((x) => this.lookup(x, null));
          let i = 1;
          const name1 = name.replace(/_/g, () => `#${i++}`);
          const args1 = args
            .map((x, i) => `  #${i + 1}) ${Location.simple_value(x)}\n`)
            .join("");
          diagnostics = `\n\nIn the expression ${name1}:\n${args1}\n`;
        }
        if (!Values.get_boolean(value)) {
          throw new ErrArbitrary(
            "assertion-violated",
            `${AssertType[op.kind]}: ${op.assert_tag}: ${
              op.message
            }${diagnostics}`
          );
        }
        activation.next();
        return _continue;
      }

      case t.BRANCH: {
        const value = this.pop(activation);
        if (Values.get_boolean(value)) {
          activation.push_block(op.consequent);
          return _continue;
        } else {
          activation.push_block(op.alternate);
          return _continue;
        }
      }

      case t.TYPE_TEST: {
        const value = this.pop(activation);
        const type = Types.materialise_type(
          this.universe,
          this.module,
          op.type
        );
        this.push(
          activation,
          Values.make_boolean(this.universe, Values.has_type(type, value))
        );
        activation.next();
        return _continue;
      }

      case t.INTRINSIC_EQUAL: {
        const right = this.pop(activation);
        const left = this.pop(activation);
        const value = Values.make_boolean(
          this.universe,
          Values.equals(left, right)
        );
        this.push(activation, value);
        activation.next();
        return _continue;
      }

      case t.REGISTER_INSTANCE: {
        const value = this.pop(activation);
        Values.register_instance(this.universe, value);
        activation.next();
        return _continue;
      }

      case t.PUSH_RECORD: {
        const values = this.pop_many(activation, op.keys.length);
        const record = Values.make_record(this.universe, op.keys, values);
        this.push(activation, record);
        activation.next();
        return _continue;
      }

      case t.RECORD_AT_PUT: {
        const [record0, key0, value] = this.pop_many(activation, 3);
        const key = Values.text_to_string(key0);
        const record = Values.record_at_put(this.universe, record0, key, value);
        this.push(activation, record);
        activation.next();
        return _continue;
      }

      case t.PROJECT: {
        const [key0, value0] = this.pop_many(activation, 2);
        const key = Values.text_to_string(key0);
        const result = Values.project(value0, key, (value) =>
          Capability.assert_projection_capability(
            this.universe,
            this.module,
            value,
            key
          )
        );
        this.push(activation, result);
        activation.next();
        return _continue;
      }

      case t.PROJECT_STATIC: {
        const value = this.pop(activation);
        const result = Values.project(value, op.key, (value) =>
          Capability.assert_projection_capability(
            this.universe,
            this.module,
            value,
            op.key
          )
        );
        this.push(activation, result);
        activation.next();
        return _continue;
      }

      case t.FACT: {
        const values = this.pop_many(activation, op.arity);
        const relation = Relation.lookup(
          this.module,
          this.module.relations,
          op.relation
        );
        Relation.insert(relation, values);
        this.universe.trace.publish_fact(activation, relation, values);
        activation.next();
        return _continue;
      }

      case t.FORGET: {
        const values = this.pop_many(activation, op.arity);
        const relation = Relation.lookup(
          this.module,
          this.module.relations,
          op.relation
        );
        Relation.remove(relation, values);
        this.universe.trace.publish_forget(activation, relation, values);
        activation.next();
        return _continue;
      }

      case t.SEARCH: {
        const machine = search(
          this.state,
          this.env,
          this.module,
          this.state.random,
          this.module.relations,
          op.predicate
        );
        const new_activation = new NativeActivation(
          activation,
          null,
          this.env,
          run_search(this.universe, this.env, machine),
          activation.handlers,
          _return
        );
        return new JumpSignal(new_activation);
      }

      case t.MATCH_SEARCH: {
        const bindings0 = this.pop(activation);
        const bindings = Values.get_array(bindings0).map((x) =>
          Values.get_map(x)
        );
        if (bindings.length === 0) {
          activation.push_block(op.alternate);
          return _continue;
        } else {
          const new_activation = new NativeActivation(
            activation,
            null,
            this.env,
            run_match_case(this.universe, this.env, bindings, op.block),
            activation.handlers,
            _return
          );
          return new JumpSignal(new_activation);
        }
      }

      case t.SIMULATE: {
        const actors0 = this.pop(activation);
        const actors = Values.get_array(actors0);
        const context = Contexts.lookup_context(this.module, op.context);
        const signals = new Namespace<SimulationSignal>(null, null);
        for (const signal of op.signals) {
          signals.define(
            signal.name,
            new SimulationSignal(
              signal.meta,
              signal.name,
              signal.parameters,
              signal.body,
              this.module
            )
          );
        }
        const simulation_state = new SimulationState(
          this.state,
          this.module,
          this.env,
          this.state.random,
          actors,
          context,
          op.goal,
          signals
        );
        const new_activation = new NativeActivation(
          activation,
          null,
          this.env,
          run_simulation(simulation_state),
          activation.handlers,
          _return
        );
        return new JumpSignal(new_activation);
      }

      case t.PERFORM: {
        const args = this.pop_many(activation, op.arity);
        const type0 = Effects.materialise_effect(
          this.module,
          op.effect,
          op.variant
        );
        const type = Capability.free_effect(this.module, type0);
        const value = Values.instantiate(type, args);
        const { handler, stack } = Effects.find_handler(
          activation.handlers,
          value
        );
        const new_activation = Effects.prepare_handler_activation(
          activation,
          stack,
          handler,
          value
        );
        return new JumpSignal(new_activation);
      }

      case t.CONTINUE_WITH: {
        const k = this.env.raw_continuation;
        if (k == null) {
          throw new ErrArbitrary(
            "no-continuation",
            `'continue with' can only be used from inside handlers.`
          );
        }
        const value = this.pop(activation);
        return new JumpSignal(Effects.apply_continuation(k, value));
      }

      case t.HANDLE: {
        return new JumpSignal(
          Effects.make_handle(
            activation,
            this.module,
            this.env,
            op.body,
            op.handlers
          )
        );
      }

      case t.DSL: {
        const type = Types.materialise_type(
          this.universe,
          this.module,
          op.type
        );
        const stype = Types.get_static_type(this.universe, type);
        const type_arg = Values.make_static_type(this.universe, stype);
        const nodes = op.ast.map((x) =>
          DSL.reify_dsl_node(this.universe, this.module, this.env, x)
        );
        const arg = Values.make_list(this.universe, nodes);
        const command = Commands.get_command(this.universe, "_ evaluate: _");
        const branch = Commands.select_branch(command, [type_arg, arg]);
        const new_activation = Commands.prepare_activation(activation, branch, [
          type_arg,
          arg,
        ]);
        return new JumpSignal(new_activation);
      }

      case t.TRAIT_TEST: {
        const trait = Types.materialise_trait(
          this.universe,
          this.module,
          op.trait
        );
        const value = this.pop(activation);
        const result = Values.make_boolean(
          this.universe,
          Values.has_trait(trait, value)
        );
        this.push(activation, result);
        return _continue;
      }

      default:
        throw unreachable(op, `Operation`);
    }
  }

  get universe() {
    return this.state.universe;
  }

  get module() {
    const result = this.env.raw_module;
    if (result == null) {
      throw new ErrArbitrary(
        "no-module",
        `The execution requires a module, but none was provided`
      );
    }
    return result;
  }

  get env() {
    return this.state.activation.env;
  }

  get_self(meta: IR.Metadata | null) {
    const value = this.env.raw_receiver;
    if (value == null) {
      throw new ErrArbitrary(
        "no-self",
        `The current block of code does not have a 'self' argument`
      );
    }
    return value;
  }

  lookup(name: string, meta: IR.Metadata | null) {
    const value = this.env.try_lookup(name);
    if (value == null) {
      throw new ErrArbitrary(
        "undefined-variable",
        `The variable ${name} is not defined`
      );
    } else {
      return value;
    }
  }

  lookup_global(name: string, meta: IR.Metadata | null) {
    const value = Modules.get_global(this.module, name);
    return Capability.free_definition(this.module, name, value);
  }

  define(name: string, value: CrochetValue, meta: IR.Metadata | null) {
    if (!this.env.define(name, value)) {
      throw new ErrArbitrary(
        "duplicated-variable",
        `The variable ${name} is already defined`
      );
    }
  }

  pop(activation: CrochetActivation) {
    if (activation.stack.length === 0) {
      throw new ErrArbitrary(
        "vm:empty-stack",
        `Trying to get a value from an empty stack`
      );
    }
    return activation.stack.pop()!;
  }

  pop_many(activation: CrochetActivation, size: number) {
    if (activation.stack.length < size) {
      throw new ErrArbitrary(
        "vm:stack-too-small",
        `Trying to get ${size} values from a stack with only ${activation.stack.length} items`
      );
    }
    const result = new Array(size);
    const len = activation.stack.length;
    for (let i = size; i > 0; --i) {
      result[size - i] = activation.stack[len - i];
    }
    activation.stack.length = len - size;
    return result;
  }

  push(activation: CrochetActivation, value: CrochetValue) {
    activation.stack.push(value);
  }
}
