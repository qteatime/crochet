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
  Universe,
  _return,
} from "../intrinsics";
import { module_location, simple_value } from "./location";
import { assert_tag, has_type } from "./values";
import * as Environments from "./environments";
import * as Capability from "./capability";
import { CrochetHandler, CrochetWorld } from "..";

export function effect_name(x: string) {
  return `effect ${x}`;
}

export function variant_name(x: string, variant: string) {
  return `effect ${x}.${variant}`;
}

export function materialise_effect(
  module: CrochetModule,
  name: string,
  variant: string
) {
  const type = module.types.try_lookup(variant_name(name, variant));
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
    current = current.parent;
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

// TODO: Clone continuation in tracing mode
export function apply_continuation(k: CrochetActivation, value: CrochetValue) {
  k.stack.push(value);
  k.next();
  return k;
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
    const type0 = materialise_effect(module, h.effect, h.variant);
    const type = Capability.free_effect(module, type0);
    handlers.push(new Handler(type, h.parameters, env, h.block));
  }

  const stack = new HandlerStack(activation.handlers, handlers);
  const new_activation = new CrochetActivation(
    activation,
    null,
    env,
    _return,
    stack,
    body
  );
  stack.activation = activation;
  return new_activation;
}

export function get_handler(module: CrochetModule, name: string) {
  const handler = module.pkg.handlers.try_lookup(name);
  if (handler == null) {
    throw new ErrArbitrary(
      "undefined",
      `The handler ${name} is not accessible from ${module_location(module)}`
    );
  }
  return handler;
}

export function define_handler(module: CrochetModule, handler: CrochetHandler) {
  if (!module.pkg.handlers.define(handler.name, handler)) {
    throw new ErrArbitrary(
      "duplicated-handler",
      `Duplicated handler definition ${handler.name} in ${module_location(
        module
      )}`
    );
  }
}

export function make_default_handler(
  universe: Universe,
  handler: CrochetHandler
) {
  if (handler.initialisation.ops.length !== 0) {
    throw new ErrArbitrary(
      "default-handler-with-initialisation",
      `Cannot make ${handler.name} a default handler because it contains initialisation code.`
    );
  }
  universe.world.default_handlers.add(handler);
}
