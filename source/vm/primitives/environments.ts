import { Environment } from "../intrinsics";

export function clone(env: Environment) {
  return new Environment(env, env.raw_receiver, env.raw_module);
}
