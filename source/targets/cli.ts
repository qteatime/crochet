import * as FS from "fs";
import * as stdlib from "../stdlib";
import { CrochetVM, State } from "../runtime";

export class Crochet extends CrochetVM {
  async read_file(filename: string) {
    return FS.readFileSync(filename, "utf-8");
  }

  async initialise() {
    await stdlib.load(State.root(this.world));
  }
}
