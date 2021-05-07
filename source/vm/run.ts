import * as IR from "../ir";
import { Thread } from "./evaluation";
import {
  ContinuationReturn,
  CrochetActivation,
  CrochetModule,
  CrochetPackage,
  CrochetTest,
  CrochetValue,
  Environment,
  Machine,
  NativeActivation,
  NativeFunction,
  NativeTag,
  State,
  Universe,
  _done,
} from "./intrinsics";

export async function run_command(
  universe: Universe,
  name: string,
  args: CrochetValue[]
) {
  const env = new Environment(null, null, null);
  const activation = new CrochetActivation(
    null,
    null,
    env,
    _done,
    new IR.BasicBlock([new IR.Invoke(0, name, args.length), new IR.Return(0)])
  );
  const state = new State(universe, activation);

  activation.stack.push.apply(activation.stack, args);

  const thread = new Thread(state);
  const value = await thread.run_to_completion();

  return value;
}

export async function run_prelude(universe: Universe) {
  for (const x of universe.world.prelude) {
    const activation = new CrochetActivation(null, x, x.env, _done, x.body);
    const state = new State(universe, activation);
    const thread = new Thread(state);
    await thread.run_to_completion();
  }
}

export async function run_test(universe: Universe, test: CrochetTest) {
  const env = new Environment(test.env, null, test.module);
  const activation = new CrochetActivation(null, test, env, _done, test.body);
  const state = new State(universe, activation);
  const thread = new Thread(state);
  const value = await thread.run_to_completion();
  return value;
}

export async function run_block(
  universe: Universe,
  env: Environment,
  block: IR.BasicBlock
) {
  const activation = new CrochetActivation(null, null, env, _done, block);
  const state = new State(universe, activation);
  const thread = new Thread(state);
  const value = await thread.run_to_completion();
  return value;
}

export function run_native_sync(
  universe: Universe,
  env: Environment,
  pkg: CrochetPackage,
  machine: Machine
) {
  const fn = new NativeFunction(
    NativeTag.NATIVE_MACHINE,
    "(native)",
    pkg,
    () => machine
  );
  const activation = new NativeActivation(null, fn, env, machine, _done);
  const state = new State(universe, activation);
  const thread = new Thread(state);
  const value = thread.run_synchrnous();
  return value;
}

export async function run_native(
  universe: Universe,
  env: Environment,
  pkg: CrochetPackage,
  machine: Machine
) {
  const fn = new NativeFunction(
    NativeTag.NATIVE_MACHINE,
    "(native)",
    pkg,
    () => machine
  );
  const activation = new NativeActivation(null, fn, env, machine, _done);
  const state = new State(universe, activation);
  const thread = new Thread(state);
  const value = await thread.run_to_completion();
  return value;
}
