import { World, Environment } from "../world";
import { SBlock, Statement } from "../ir";
import { Predicate } from "../logic";
import { State } from "../vm";

export class When {
  constructor(
    readonly predicate: Predicate,
    readonly env: Environment,
    readonly body: Statement[]
  ) {}

  executions(state: State) {
    const results = state.world.search(this.predicate);
    return results.map((uenv) => {
      const env = new Environment(this.env, null);
      env.define_all(uenv.boundValues);
      const block = new SBlock(this.body);
      return block.evaluate(state.with_env(env));
    });
  }
}

export class Action {
  constructor(
    readonly title: string,
    readonly predicate: Predicate,
    readonly tags: string[],
    readonly env: Environment,
    readonly body: Statement[]
  ) {}

  ready_actions(state: State) {
    const results = state.world.search(this.predicate);
    return results.map((uenv) => {
      const env = new Environment(this.env, null);
      env.define_all(uenv.boundValues);
      const block = new SBlock(this.body);
      return {
        title: this.title,
        tags: this.tags,
        machine: block.evaluate(state.with_env(env)),
      };
    });
  }
}

export class Context {
  readonly events: When[] = [];
  readonly actions: Action[] = [];

  available_actions(state: State) {
    return this.actions.flatMap((x) => x.ready_actions(state));
  }

  available_events(state: State) {
    return this.events.flatMap((x) => x.executions(state));
  }
}
