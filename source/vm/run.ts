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
  module: CrochetModule,
  name: string,
  args: CrochetValue[]
) {
  const env = new Environment(null, null, module);
  const activation = new CrochetActivation(
    null,
    env,
    new IR.BasicBlock([new IR.Invoke(0, name, args.length), new IR.Return(0)])
  );
  const state = new State(universe, activation, new ContinuationReturn());

  activation.stack.push.apply(activation.stack, args);

  const thread = new Thread(state);
  const value = thread.run_to_completion();

  return value;
}
