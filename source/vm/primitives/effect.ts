import * as IR from "../../ir";
import { CrochetValue } from "../../crochet";
import { ErrArbitrary } from "../errors";
import {
  Activation,
  CrochetActivation,
  CrochetModule,
  CrochetType,
  Environment,
  Handler,
  HandlerStack,
  Tag,
  _return,
} from "../intrinsics";
import { module_location, simple_value } from "./location";
import { assert_tag, has_type } from "./values";
import * as Environments from "./environments";

export function materialise_effect(
  module: CrochetModule,
  name: string,
  variant: string
) {
  const full_name = `${name}.${variant}`;
  const type = module.types.try_lookup(full_name);
  if (type == null) {
    throw new ErrArbitrary(
      `undefined-effect`,
      `The effect ${name}.${variant} is not accessible from ${module_location(
        module
      )}`
    );
  }
  return type;
}

export function assert_can_perform(module: CrochetModule, type: CrochetType) {
  if (type.module?.pkg !== module.pkg) {
    throw new ErrArbitrary(
      `no-perform-capability`,
      `Not allowing ${module_location(module)} to perform ${
        type.name
      }. The effect ${
        type.name
      } can only be performed from its defining package, ${
        type.module?.pkg.name ?? ""
      }.`
    );
  }
}

export function try_find_handler(stack: HandlerStack, value: CrochetValue) {
  let current: HandlerStack | null = stack;
  while (current != null) {
    for (const handler of current.handlers) {
      if (has_type(handler.guard, value)) {
        return { handler, stack: current };
      }
    }
  }
  return null;
}

export function find_handler(stack: HandlerStack, value: CrochetValue) {
  const result = try_find_handler(stack, value);
  if (result == null) {
    throw new ErrArbitrary(
      `no-handler`,
      `No handler for ${simple_value(value)} was found in this context.`
    );
  }
  return result;
}

export function prepare_handler_activation(
  activation: CrochetActivation,
  stack: HandlerStack,
  handler: Handler,
  value: CrochetValue
) {
  assert_tag(Tag.INSTANCE, value);
  if (handler.parameters.length !== value.payload.length) {
    throw new ErrArbitrary(
      `internal:invalid-layout`,
      `Corrupted layout for ${simple_value(
        value
      )}---does not match the expected layout.`
    );
  }
  const env = Environments.clone_with_continuation(handler.env, activation);
  for (let i = 0; i < handler.parameters.length; ++i) {
    env.define(handler.parameters[i], value.payload[i]);
  }
  return new CrochetActivation(
    stack.activation!,
    null,
    env,
    _return,
    stack,
    handler.body
  );
}

export function apply_continuation(
  k: CrochetActivation,
  activation: CrochetActivation,
  value: CrochetValue
) {
  const new_activation = new CrochetActivation(
    activation,
    k.location,
    k.env,
    k.continuation,
    k.handlers,
    k.block
  );
  new_activation.instruction = k.instruction;
  new_activation.next();
  new_activation.stack = k.stack.slice();
  new_activation.stack.push(value);
  new_activation.block_stack = k.block_stack.slice();
  new_activation.set_return_value(k.return_value!);
  return new_activation;
}

export function make_handle(
  activation: CrochetActivation,
  module: CrochetModule,
  env0: Environment,
  body: IR.BasicBlock,
  cases: IR.HandlerCase[]
) {
  const env = Environments.clone(env0);
  const handlers: Handler[] = [];
  for (const h of cases) {
    switch (h.tag) {
      case IR.HandlerCaseTag.ON: {
        const type = materialise_effect(module, h.effect, h.variant);
        handlers.push(new Handler(type, h.parameters, env, h.block));
        break;
      }

      default:
        throw new Error(`Unsupported ${IR.HandlerCaseTag[h.tag]}`);
    }
  }

  const stack = new HandlerStack(activation.handlers, handlers);
  const new_activation = new CrochetActivation(
    activation,
    activation.location,
    env,
    _return,
    stack,
    body
  );
  stack.activation = new_activation;
  return new_activation;
}
