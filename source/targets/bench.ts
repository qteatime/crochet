import * as FS from "fs";
import * as stdlib from "../stdlib";
import * as compiler from "../compiler";
import { CrochetVM, State, World } from "../runtime";

export class Crochet extends CrochetVM {
  async initialise() {
    await stdlib.load(State.root(this.world));
  }

  async read_file(filename: string) {
    return FS.readFileSync(filename, "utf-8");
  }

  async load_from_file(filename: string) {
    await this.load(filename);
  }
}
