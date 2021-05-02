import * as Path from "path";
import * as FS from "fs";
import * as Package from "../../pkg";
import { logger } from "../../utils/logger";

logger.verbose = true;

function read_package(filename: string) {
  const json = FS.readFileSync(filename, "utf-8");
  return Package.parse(JSON.parse(json), filename);
}

const packages = new Map<string, Package.Package>();
const stdlib = Path.join(__dirname, "../../../stdlib");
for (const x of FS.readdirSync(stdlib)) {
  const filename = Path.join(stdlib, x, "crochet.json");
  if (FS.existsSync(filename)) {
    const pkg = read_package(filename);
    packages.set(pkg.meta.name, pkg);
  }
}

const resolver = {
  async get_package(name: string) {
    const result = packages.get(name);
    if (result == null) {
      throw new Error(`undefined package ${name}`);
    }
    return result;
  },
};

void (async function main() {
  try {
    const [file, capabilities0] = process.argv.slice(2);
    const capabilities = (capabilities0 ?? "")
      .split(",")
      .filter((x) => x !== "");

    const root = read_package(file);
    const graph = await Package.build_package_graph(
      root,
      Package.target_any(),
      new Set(packages.values()),
      resolver
    );
    const resolved_root = graph.get_package(root.meta.name);

    console.log("Requirements:");
    console.log(graph.capability_requirements);
    console.log("Providers:");
    console.log(graph.capability_providers);
    console.log("Resolution:");
    graph.check(resolved_root, new Set(capabilities));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
