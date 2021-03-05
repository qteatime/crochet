import * as stdlib from "../stdlib";
import * as compiler from "../compiler";
import { State, World } from "../runtime";

export class Crochet {
  readonly world: World;

  constructor(readonly root: HTMLElement) {
    this.world = new World();
  }

  get ffi() {
    return this.world.ffi;
  }

  async initialise() {
    this.root.appendChild(stdlib.Canvas.instance);
    await stdlib.load(State.root(this.world));
  }

  async load_from_source(source: string) {
    const ast = compiler.parse(source);
    const ir = compiler.compileProgram(ast);
    const state = State.root(this.world);
    state.world.load_declarations(ir, state.env);
  }

  async load_from_url(url: string) {
    const source = await (await fetch(url)).text();
    await this.load_from_source(source);
  }

  async run(scene: string) {
    return this.world.run(scene);
  }
}
