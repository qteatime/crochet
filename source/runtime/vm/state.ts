import { XorShift } from "../../utils/xorshift";
import { IDatabase } from "../logic";
import { Environment, World } from "../world";
import { CrochetModule } from "./module";

export class State {
  constructor(
    readonly random: XorShift,
    readonly world: World,
    readonly env: Environment,
    readonly database: IDatabase
  ) {}

  static root(world: World) {
    return new State(
      world.global_random,
      world,
      new Environment(null, null, null),
      world.database
    );
  }

  with_random(random: XorShift) {
    return new State(random, this.world, this.env, this.database);
  }

  with_env(env: Environment) {
    return new State(this.random, this.world, env, this.database);
  }

  with_new_env() {
    return new State(
      this.random,
      this.world,
      this.env.clone_with_receiver(null),
      this.database
    );
  }

  with_database(db: IDatabase) {
    return new State(this.random, this.world, this.env, db);
  }
}