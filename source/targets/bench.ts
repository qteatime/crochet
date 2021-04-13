import { Crochet as CliCrochet } from "./cli";
import { NodeTarget } from "../runtime/pkg";

export class Crochet extends CliCrochet {
  constructor(readonly stdlib_path: string) {
    super();
  }

  get prelude() {
    return [
      "crochet.core",
      "crochet.debug",
      "crochet.text",
      "crochet.mathematics",
      "crochet.collections",
    ];
  }

  async load_from_file(filename: string) {
    // FIXME: support benchmarks
    throw new Error(`Benchmark unsupported for now`);
  }
}
