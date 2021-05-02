import * as IR from "../ir";
import { Thread } from "./evaluation";
import {
  ContinuationReturn,
  CrochetActivation,
  CrochetModule,
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
    const activation = new CrochetActivation(null, x.env, x.body);
    const state = new State(universe, activation, new ContinuationReturn());
    const thread = new Thread(state);
    await thread.run_to_completion();
  }
}
