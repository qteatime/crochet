import * as IR from "../ir";
import { AssertType } from "../ir";
import { unreachable } from "../utils/utils";
import { ErrArbitrary } from "./errors";
import {
  Activation,
  ActivationTag,
  ContinuationReturn,
  ContinuationTag,
  CrochetActivation,
  CrochetModule,
  CrochetValue,
  Environment,
  NativeTag,
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
} from "./primitives";

export enum SignalTag {
  RETURN,
  CONTINUE,
}

export type Signal = ReturnSignal | ContinueSignal;

export class ReturnSignal {
  readonly tag = SignalTag.RETURN;
  constructor(readonly value: CrochetValue) {}
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
      new CrochetActivation(null, new Environment(null, null, module), block),
      new ContinuationReturn()
    );
    const thread = new Thread(root);
    const value = thread.run();
    return value;
  }

  run() {
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

        default:
          throw unreachable(signal, `Signal`);
      }
    }
  }

  step() {
    const activation = this.state.activation;

    switch (activation.tag) {
      case ActivationTag.CROCHET_ACTIVATION: {
        return this.step_crochet(activation);
      }

      default:
        throw unreachable(activation as never, `Activation`);
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
        this.state.activation = activation;
        this.push(activation, value);
        activation.next();
        return _continue;
      }

      default:
        throw unreachable(activation as never, `Activation`);
    }
  }

  step_crochet(activation: CrochetActivation): Signal {
    const op = activation.current;
    if (op == null) {
      if (activation.block_stack.length > 0) {
        activation.pop_block();
        activation.next();
        return _continue;
      } else {
        const value = activation.return_value ?? this.universe.nothing;
        return this.do_return(value, activation.parent);
      }
    }

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
          this.state.activation = new CrochetActivation(
            this.state.activation,
            thunk.env,
            thunk.body
          );
          return _continue;
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
            const value = fn.payload(...args);
            this.push(activation, value);
            activation.next();
            return _continue;
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
        this.state.activation = new_activation;
        return _continue;
      }

      case t.APPLY: {
        const lambda = this.pop(activation);
        const args = this.pop_many(activation, op.arity);
        const new_activation = Lambdas.prepare_activation(
          this.universe,
          activation,
          lambda,
          args
        );
        this.state.activation = new_activation;
        return _continue;
      }

      case t.APPLY_PARTIAL: {
        throw new Error(`FIXME: apply-partial`);
      }

      case t.RETURN: {
        const value = this.pop(activation);
        activation.set_return_value(value);
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
        if (!Values.get_boolean(value)) {
          throw new ErrArbitrary(
            "assertion-violated",
            `${AssertType[op.kind]}: ${op.assert_tag}: ${op.message}`
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

      default:
        throw unreachable(op as never, `Operation`);
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
    const result = [];
    for (let i = 0; i < size; ++i) {
      result.push(activation.stack.pop()!);
    }
    return result;
  }

  push(activation: CrochetActivation, value: CrochetValue) {
    activation.stack.push(value);
  }
}
