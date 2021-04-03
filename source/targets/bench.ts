import { Crochet as CliCrochet } from "./cli";
import { CliTarget } from "../runtime/pkg";

export class Crochet extends CliCrochet {
  async load_from_file(filename: string) {
    await this.load(filename, new CliTarget());
  }
}
