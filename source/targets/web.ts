import * as stdlib from "../stdlib";
import * as compiler from "../compiler";
import { MachineError, State, World } from "../runtime";

export class Crochet {
  readonly world: World;

  constructor(readonly root: HTMLElement) {
    this.world = new World();
  }

  get ffi() {
    return this.world.ffi;
  }

  async initialise() {
    stdlib.Html.canvas.render_to(this.root);
    await stdlib.load(State.root(this.world));
  }

  async load_from_source(filename: string, source: string) {
    const ast = compiler.parse(source);
    const ir = compiler.compileProgram(ast);
    const state = State.root(this.world);
    await state.world.load_declarations(filename, ir, state.env);
  }

  async load_from_url(url: string) {
    const source = await (await fetch(url)).text();
    await this.load_from_source(url, source);
  }

  async run(scene: string) {
    return this.world.run(scene);
  }

  async show_error(error: { message: string }) {
    await stdlib.Html.canvas.show_error(error.message);
  }
}
