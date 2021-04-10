import * as stdlib from "../stdlib";
import { State } from "../runtime";
import { Capabilities, WebTarget } from "../runtime/pkg";
import { Plugin } from "../plugin";
import { CrochetVM } from "../vm-interface";

export class Crochet extends CrochetVM {
  constructor(readonly root: HTMLElement) {
    super();
  }

  get prelude() {
    return ["crochet.core", "crochet.debug", "crochet.time", "crochet.ui.html"];
  }

  load_native(filename: string): Promise<(_: Plugin) => void | Promise<void>> {
    throw new Error("Native extensions are not supported in yet.");
  }

  async load(filename: string) {
    return this.load_with_capabilities(
      filename,
      new WebTarget(),
      new Capabilities(new Set(["html"]))
    );
  }

  async read_file(filename: string) {
    return (await fetch(filename)).text();
  }

  async initialise() {
    stdlib.Html.canvas.render_to(this.root);
    await stdlib.load(State.root(this.world));
    for (const x of this.prelude) {
      await this.register_package_from_directory("/stdlib", x);
    }
  }

  async register_package_from_directory(root: string, name: string) {
    const pkg = await this.read_package_from_file(
      root + "/" + name + "/crochet.json"
    );
    this.register_package(pkg.name, pkg);
  }

  async get_package(name: string) {
    if (!this.registered_packages.has(name)) {
      await this.register_package_from_directory("/library", name);
    }
    return super.get_package(name);
  }

  async show_error(error: unknown) {
    console.error(error);
    await stdlib.Html.canvas.show_error(this.format_error(error));
  }
}

void (async function () {
  const root = document.querySelector("#crochet");
  if (root == null) {
    throw new Error(`Missing #crochet element in the page.`);
  }

  const game = new Crochet(root as HTMLElement);

  try {
    await game.initialise();
    await game.load("/game/crochet.json");
    await game.run("main");
  } catch (error) {
    await game.show_error(error);
  }
})();
