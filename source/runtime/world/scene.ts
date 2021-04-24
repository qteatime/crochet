import { generated_node, Metadata, SBlock, Statement } from "../ir";
import { cvalue, Machine, State, _mark } from "../vm";
import { Environment } from "../vm/environment";
import { World } from "./world";

export class Scene {
  constructor(
    readonly meta: Metadata,
    readonly name: string,
    readonly env: Environment,
    readonly body: Statement[]
  ) {}

  get full_name() {
    return `scene ${this.name} (from ${this.env.module.qualified_name}${this.meta.at_line_suffix})`;
  }

  *evaluate(state: State): Machine {
    const env = this.env.clone_with_receiver(null);
    const block = new SBlock(generated_node, this.body);
    const value = cvalue(
      yield _mark(this.full_name, block.evaluate(state.with_env(env)))
    );
    return value;
  }
}
