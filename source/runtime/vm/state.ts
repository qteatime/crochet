import { IDatabase } from "../logic";
import { Environment, World } from "../world";

export class State {
  constructor(
    readonly world: World,
    readonly env: Environment,
    readonly database: IDatabase
  ) {}

  static root(world: World) {
    return new State(world, new Environment(null, null), world.database);
  }

  with_env(env: Environment) {
    return new State(this.world, env, this.database);
  }

  with_new_env() {
    return new State(
      this.world,
      new Environment(this.env, null),
      this.database
    );
  }

  with_database(db: IDatabase) {
    return new State(this.world, this.env, db);
  }
}
