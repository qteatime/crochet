import { Environment, World } from "../world";

export class State {
  constructor(readonly world: World, readonly env: Environment) {}

  static root(world: World) {
    return new State(world, new Environment(null, null));
  }

  with_env(env: Environment) {
    return new State(this.world, env);
  }

  with_new_env() {
    return new State(this.world, new Environment(this.env, null));
  }
}
