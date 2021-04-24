import * as Path from "path";
import { Crochet as CliCrochet } from "./cli";
import {
  Capabilities,
  CrochetPackage,
  Dependency,
  NodeTarget,
  PackageGraph,
} from "../runtime/pkg";
import { File } from "../runtime/pkg/file";

export class Crochet extends CliCrochet {
  constructor(readonly stdlib_path: string) {
    super();
  }

  get capabilities() {
    return Capabilities.safe;
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
    const target = new NodeTarget();
    const pkg0 = new CrochetPackage("(benchmark)", {
      capabilities: {
        requires: new Set(),
        provides: new Set(),
      },
      dependencies: this.prelude.map(
        (x) => new Dependency(x, new Set(), target)
      ),
      name: "(benchmark)",
      native_sources: [],
      sources: [new File(Path.resolve(filename), target)],
      target: target,
    });
    const pkg = pkg0.restricted_to(target);
    const graph = await PackageGraph.resolve(target, this, pkg);
    graph.check(pkg.name, this.capabilities);
    await this.load_graph(graph, pkg);
  }
}
