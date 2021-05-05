import * as IR from "../ir";
import { Thread } from "./evaluation";
import {
  ContinuationReturn,
  CrochetActivation,
  CrochetModule,
  CrochetTest,
  CrochetValue,
  Environment,
  State,
  Universe,
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
    new IR.BasicBlock([new IR.Invoke(0, name, args.length), new IR.Return(0)])
  );
  const state = new State(universe, activation, new ContinuationReturn());

  activation.stack.push.apply(activation.stack, args);

  const thread = new Thread(state);
  const value = await thread.run_to_completion();

  return value;
}

export async function run_prelude(universe: Universe) {
  for (const x of universe.world.prelude) {
    const activation = new CrochetActivation(null, x, x.env, x.body);
    const state = new State(universe, activation, new ContinuationReturn());
    const thread = new Thread(state);
    await thread.run_to_completion();
  }
}

export async function run_test(universe: Universe, test: CrochetTest) {
  const env = new Environment(test.env, null, test.module);
  const activation = new CrochetActivation(null, test, env, test.body);
  const state = new State(universe, activation, new ContinuationReturn());
  const thread = new Thread(state);
  const value = await thread.run_to_completion();
  return value;
}
