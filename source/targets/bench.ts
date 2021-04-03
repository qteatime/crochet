import { Crochet as CliCrochet } from "./cli";

export class Crochet extends CliCrochet {
  async load_from_file(filename: string) {
    await this.load(filename);
  }
}
