import * as stdlib from "../stdlib";
import { CrochetVM, State } from "../runtime";

export class Crochet extends CrochetVM {
  constructor(readonly root: HTMLElement) {
    super();
  }

  async read_file(filename: string) {
    return (await fetch(filename)).text();
  }

  async initialise() {
    stdlib.Html.canvas.render_to(this.root);
    await stdlib.load(State.root(this.world));
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
