import { SBlock, Statement } from "../ir";
import { Environment } from "./environment";
import { World } from "./world";

export class Scene {
  constructor(
    readonly name: string,
    readonly env: Environment,
    readonly body: Statement[]
  ) {}

  evaluate(world: World) {
    const env = new Environment(this.env, world, null);
    const block = new SBlock(this.body);
    return block.evaluate(world, env);
  }
}
