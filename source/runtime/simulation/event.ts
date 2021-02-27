import { World, Environment } from "../world";
import { SBlock, Statement } from "../ir";
import { Predicate } from "../logic";

export class When {
  constructor(
    readonly predicate: Predicate,
    readonly env: Environment,
    readonly body: Statement[]
  ) {}

  executions(world: World) {
    const results = world.search(this.predicate);
    return results.map((uenv) => {
      const env = new Environment(this.env, world, null);
      env.define_all(uenv.boundValues);
      const block = new SBlock(this.body);
      return block.evaluate(world, env);
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

  ready_actions(world: World) {
    const results = world.search(this.predicate);
    return results.map((uenv) => {
      const env = new Environment(this.env, world, null);
      env.define_all(uenv.boundValues);
      const block = new SBlock(this.body);
      return {
        title: this.title,
        tags: this.tags,
        machine: block.evaluate(world, env),
      };
    });
  }
}

export class Context {
  readonly events: When[] = [];
  readonly actions: Action[] = [];

  available_actions(world: World) {
    return this.actions.flatMap((x) => x.ready_actions(world));
  }

  available_events(world: World) {
    return this.events.flatMap((x) => x.executions(world));
  }
}
