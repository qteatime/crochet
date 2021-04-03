import { SBlock, Statement } from "../ir";
import { CrochetModule, Environment, State, _push } from "../vm";

export class CrochetTest {
  constructor(
    readonly module: CrochetModule,
    readonly title: string,
    readonly env: Environment,
    readonly body: SBlock
  ) {}

  *evaluate(state0: State) {
    const env = this.env.clone();
    const state = state0.with_env(env);
    yield _push(this.body.evaluate(state));
  }
}
