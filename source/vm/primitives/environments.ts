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