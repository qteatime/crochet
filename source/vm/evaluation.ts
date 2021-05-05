import * as IR from "../ir";
import { AssertType } from "../ir";
import { logger } from "../utils/logger";
import { unreachable } from "../utils/utils";
import { CrochetEvaluationError, ErrArbitrary } from "./errors";
import {
  Activation,
  ActivationTag,
  ContinuationReturn,
  ContinuationTag,
  CrochetActivation,
  CrochetModule,
  CrochetValue,
  Environment,
  NativeActivation,
  NativeSignalTag,
  NativeTag,
  NSBase,
  State,
  Universe,
} from "./intrinsics";
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
} from "./primitives";

export enum SignalTag {
  RETURN,
  JUMP,
  CONTINUE,
}

export type Signal = ReturnSignal | JumpSignal | ContinueSignal;

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
        new Environment(null, null, module),
        block
      ),
      new ContinuationReturn()
    );
    const thread = new Thread(root);
    const value = thread.run();
    return value;
  }

  async run_to_completion() {
    return this.run();
  }

  run() {
    logger.debug(`Running`, Location.simple_activation(this.state.activation));
    try {
      while (true) {
        const signal = this.step();
        switch (signal.tag) {
          case SignalTag.CONTINUE:
            continue;

          case SignalTag.RETURN: {
            const new_state = this.apply_continuation(signal.value);
            if (new_state != null) {
              this.state = new_state;
              continue;
            } else {
              return signal.value;
            }
          }

          case SignalTag.JUMP: {
            this.state.activation = signal.activation;
            logger.debug(
              "Jump to",
              Location.simple_activation(signal.activation)
            );
            continue;
          }

          default:
            throw unreachable(signal, `Signal`);
        }
      }
    } catch (error) {
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

  apply_continuation(value: CrochetValue) {
    const k = this.state.continuation;
    switch (k.tag) {
      case ContinuationTag.RETURN: {
        return null;
      }
    }
  }

  do_return(value: CrochetValue, activation: Activation | null): Signal {
    if (activation == null) {
      return new ReturnSignal(value);
    }

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
        logger.debug(
          `Finished with activation, return value:`,
          Location.simple_value(value)
        );
        return this.do_return(value, activation.parent);
      }
    }

    logger.debug(`Stack:`, activation.stack.map(Location.simple_value));
    logger.debug(`Executing operation:`, Location.simple_op(op));

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

      case t.PUSH_TUPLE: {
        const values = this.pop_many(activation, op.arity);
        const tuple = Values.make_tuple(this.state.universe, values);
        this.push(activation, tuple);
        activation.next();
        return _continue;
      }

      case t.PUSH_NEW: {
        const values = this.pop_many(activation, op.arity);
        const type = Types.materialise_type(
          this.state.universe,
          this.module,
          op.type
        );
        const value = Values.instantiate(type, values);
        this.push(activation, value);
        activation.next();
        return _continue;
      }

      case t.PUSH_STATIC_TYPE: {
        const type = Types.materialise_type(
          this.universe,
          this.module,
          op.type
        );
        const static_type = Types.get_static_type(this.universe, type);
        const value = Values.make_static_type(static_type);
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
              machine
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
        const result = Values.project(value0, key);
        this.push(activation, result);
        activation.next();
        return _continue;
      }

      case t.PROJECT_STATIC: {
        const value = this.pop(activation);
        const result = Values.project(value, op.key);
        this.push(activation, result);
        activation.next();
        return _continue;
      }

      case t.SEARCH:
      case t.MATCH_SEARCH:
      case t.FACT:
      case t.FORGET:
      case t.SIMULATE: {
        throw new Error(
          `internal: ${Location.simple_op(op)} not yet supported`
        );
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
    const value = this.module.definitions.try_lookup(name);
    if (value == null) {
      throw new ErrArbitrary(
        "undefined",
        `The definition ${name} is not accessible from ${Location.module_location(
          this.module
        )}`
      );
    } else {
      return value;
    }
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
