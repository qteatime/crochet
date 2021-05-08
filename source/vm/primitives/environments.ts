import { zip } from "../../utils/utils";
import { CrochetModule, CrochetValue, Environment } from "../intrinsics";

export function clone(env: Environment) {
  return new Environment(env, env.raw_receiver, env.raw_module);
}

export function extend(env: Environment, receiver: CrochetValue | null) {
  return new Environment(env, receiver, env.raw_module);
}

export function extend_with_parameters(
  parent_env: Environment,
  parameters: string[],
  values: CrochetValue[]
) {
  const receiver = values.length > 0 ? values[0] : null;
  const env = extend(parent_env, receiver);
  for (const [k, v] of zip(parameters, values)) {
    env.define(k, v);
  }
  return env;
}

export function extend_with_parameters_and_receiver(
  parent_env: Environment,
  parameters: string[],
  values: CrochetValue[],
  receiver: CrochetValue | null
) {
  const env = extend(parent_env, receiver);
  for (const [k, v] of zip(parameters, values)) {
    env.define(k, v);
  }
  return env;
}

export function bound_values_up_to(mark_env: Environment, env: Environment) {
  let current: Environment | null = env;
  let result = new Map<string, CrochetValue>();
  while (current != null && current !== mark_env) {
    for (const [k, v] of current.bindings) {
      if (!result.has(k)) {
        result.set(k, v);
      }
    }
    current = current.parent;
  }
  return result;
}
