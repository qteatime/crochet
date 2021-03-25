import * as FS from "fs";
import * as stdlib from "../stdlib";
import * as compiler from "../compiler";
import { State, World } from "../runtime";

export class Crochet {
  readonly world: World;

  constructor() {
    this.world = new World();
  }

  get ffi() {
    return this.world.ffi;
  }

  async initialise() {
    await stdlib.load(State.root(this.world));
  }

  async load_from_file(file: string) {
    const source = FS.readFileSync(file, "utf8");
    const ast = compiler.parse(source);
    const ir = compiler.compileProgram(ast);
    const state = State.root(this.world);
    await state.world.load_declarations(file, ir, state.env);
  }

  async run(scene: string) {
    return await this.world.run(scene);
  }
}
