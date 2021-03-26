import * as Path from "path";
import * as FS from "fs";
import * as Yargs from "yargs";

import { Crochet } from "../../targets/bench";
const Crochet_v0_2 = require("../../../versions/crochet-v0.2.0")
  .Crochet as typeof Crochet;
const Crochet_v0_3 = require("../../../versions/crochet-v0.3.0")
  .Crochet as typeof Crochet;

const root = Path.join(__dirname, "../../../");

interface IBenchmark {
  title: string;
  versions: {
    [key: string]: string;
  };
}

const benchmarkDir = Path.join(root, "benchmarks");

class Benchmark {
  readonly title: string;
  readonly versions: { [key: string]: string };
  constructor(data: IBenchmark) {
    this.title = data.title;
    this.versions = data.versions;
  }

  static from_file(filename: string) {
    return new Benchmark(JSON.parse(FS.readFileSync(filename, "utf8")));
  }

  file_for_version(version: string): string {
    return Path.resolve(root, this.versions[version] ?? this.versions.default);
  }
}

const benchmarks = FS.readdirSync(benchmarkDir)
  .map((x) => Path.join(benchmarkDir, x))
  .filter((x) => FS.statSync(x).isFile())
  .map((x) => Benchmark.from_file(x));

const vms = [
  { version: "v0.2.0", random: true, vm: Crochet_v0_2 },
  { version: "v0.3.0", random: true, vm: Crochet_v0_3 },
  { version: "current", random: false, vm: Crochet },
];

async function time(label: string, code: () => Promise<any>) {
  const log = console.log;
  console.log = () => {};
  const start = new Date().getTime();
  const result = await code();
  const end = new Date().getTime();
  console.log = log;
  console.log(`--> ${label} (${end - start}ms)`);
  return result;
}

void (async function () {
  const seed0 = Yargs.argv["seed"];
  const seed = seed0 ? Number(seed0) : new Date().getTime() | 0;
  console.log("-- Using seed", seed, " (use --seed <seed> to reproduce)");

  for (const bench of benchmarks) {
    console.log("=".repeat(72));
    console.log("::", bench.title);
    for (const { version, random, vm: Crochet } of vms) {
      const fullPath = bench.file_for_version(version);
      console.log("---");
      console.log(":: Crochet", version);
      if (random) {
        console.log("(Reproducible PRNG not supported in this version)");
      }
      const vm = new Crochet();
      vm.world.global_random?.reseed(seed);
      await time("Initialisation", () => vm.initialise());
      await time("Load file", () => vm.load_from_file(fullPath));
      await time("Run benchmark", () => vm.run("main"));
    }
    console.log("\n");
  }
})();
