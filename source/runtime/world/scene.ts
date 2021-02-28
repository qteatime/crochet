import { SBlock, Statement } from "../ir";
import { State } from "../vm";
import { Environment } from "./environment";
import { World } from "./world";

export class Scene {
  constructor(
    readonly name: string,
    readonly env: Environment,
    readonly body: Statement[]
  ) {}

  evaluate(state: State) {
    const env = new Environment(this.env, null);
    const block = new SBlock(this.body);
    return block.evaluate(state.with_env(env));
  }
}
