import * as IR from "../ir";
import { unreachable } from "../utils/utils";
import { ErrArbitrary } from "./errors";
import {
  Activation,
  ActivationTag,
  CrochetActivation,
  CrochetValue,
  Environment,
  Universe,
} from "./intrinsics";
import { Literals, Location, Types, Values } from "./primitives";

export class State {
  constructor(
    readonly universe: Universe,
    readonly env: Environment,
    readonly activation: Activation
  ) {}
}

class Thread {
  constructor(readonly state: State) {}

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

  step_crochet(activation: CrochetActivation) {
    const op = activation.current;
    if (op == null) {
      return;
    }

    const t = IR.OpTag;
    switch (op.tag) {
      case t.DROP: {
        this.pop(activation, op.meta);
        activation.next();
        break;
      }

      case t.LET: {
        const value = this.pop(activation, op.meta);
        this.define(op.name, value, op.meta);
        activation.next();
        break;
      }

      case t.PUSH_VARIABLE: {
        const value = this.lookup(op.name, op.meta);
        this.push(activation, value);
        activation.next();
        break;
      }

      case t.PUSH_SELF: {
        const value = this.get_self(op.meta);
        this.push(activation, value);
        activation.next();
        break;
      }

      case t.PUSH_GLOBAL: {
        const value = this.lookup_global(op.name, op.meta);
        this.push(activation, value);
        activation.next();
        break;
      }

      case t.PUSH_LITERAL: {
        const value = Literals.materialise_literal(
          this.state.universe,
          op.value
        );
        this.push(activation, value);
        activation.next();
        break;
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
        break;
      }

      case t.PUSH_TUPLE: {
        const values = this.pop_many(activation, op.arity, op.meta);
        const tuple = Values.make_tuple(this.state.universe, values);
        this.push(activation, tuple);
        break;
      }

      case t.PUSH_NEW: {
        const values = this.pop_many(activation, op.arity, op.meta);
        const type = Types.materialise_type(
          this.state.universe,
          this.module,
          op.type
        );
        const value = Values.instantiate(type, values);
        this.push(activation, value);
        break;
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
        break;
      }

      default:
        throw unreachable(op as never, `Operation`);
    }
  }

  get universe() {
    return this.state.universe;
  }

  get module() {
    const result = this.state.env.raw_module;
    if (result == null) {
      throw new ErrArbitrary(
        "no-module",
        `The execution requires a module, but none was provided`
      );
    }
    return result;
  }

  get_self(meta: IR.Metadata | null) {
    const value = this.state.env.raw_receiver;
    if (value == null) {
      throw new ErrArbitrary(
        "no-self",
        `The current block of code does not have a 'self' argument`
      );
    }
    return value;
  }

  lookup(name: string, meta: IR.Metadata | null) {
    const value = this.state.env.try_lookup(name);
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
    if (!this.state.env.define(name, value)) {
      throw new ErrArbitrary(
        "duplicated-variable",
        `The variable ${name} is already defined`
      );
    }
  }

  pop(activation: CrochetActivation, meta: IR.Metadata | null) {
    if (activation.stack.length === 0) {
      throw new ErrArbitrary(
        "vm:empty-stack",
        `Trying to get a value from an empty stack`
      );
    }
    return activation.stack.pop()!;
  }

  pop_many(
    activation: CrochetActivation,
    size: number,
    meta: IR.Metadata | null
  ) {
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
