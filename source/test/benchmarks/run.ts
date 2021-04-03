import * as Path from "path";
import * as FS from "fs";
import * as Yargs from "yargs";

import { Crochet } from "../../targets/bench";
const Crochet_v0_2 = require("../../../versions/crochet-v0.2.0")
  .Crochet as typeof Crochet;
const Crochet_v0_3 = require("../../../versions/crochet-v0.3.0")
  .Crochet as typeof Crochet;
const Crochet_v0_3_1 = require("../../../versions/crochet-v0.3.1")
  .Crochet as typeof Crochet;
const Crochet_v0_4_0 = require("../../../versions/crochet-v0.4.0")
  .Crochet as typeof Crochet;
const Crochet_v0_5_0 = require("../../../versions/crochet-v0.5.0")
  .Crochet as typeof Crochet;
const pkg = require("../../../package.json");

const root = Path.join(__dirname, "../../../");

interface IBenchmark {
  title: string;
  versions: {
    [key: string]: string;
  };
}

const benchmarkDir = Path.join(root, "benchmarks");

class Version {
  constructor(readonly a: number, readonly b: number, readonly c: number) {}

  static parse(v: string) {
    const [a, b, c] = v.split(".").map(Number);
    return new Version(a, b, c);
  }

  gte(x: Version) {
    return (
      this.a > x.a ||
      (this.a === x.a && this.b > x.b) ||
      (this.a === x.a && this.b === x.b && this.c >= x.c)
    );
  }

  eq(x: Version) {
    return this.a === x.a && this.b === x.b && this.c === x.c;
  }

  compare_to(x: Version) {
    if (this.eq(x)) {
      return 0;
    } else if (this.gte(x)) {
      return 1;
    } else {
      return -1;
    }
  }
}

class Benchmark {
  readonly title: string;
  readonly versions: [Version, string][];
  constructor(data: IBenchmark) {
    this.title = data.title;
    this.versions = [];
    for (const [version, file] of Object.entries(data.versions)) {
      this.versions.push([Version.parse(version), file]);
    }
    this.versions.sort(([a, _1], [b, _2]) => b.compare_to(a));
  }

  static from_file(filename: string) {
    return new Benchmark(JSON.parse(FS.readFileSync(filename, "utf8")));
  }

  file_for_version(version: string): string {
    const v = Version.parse(version);
    for (const [version, file] of this.versions) {
      if (v.gte(version)) {
        return Path.resolve(root, file);
      }
    }
    throw new Error(`No suitable benchmark for ${version}`);
  }
}

const benchmarks = FS.readdirSync(benchmarkDir)
  .map((x) => Path.join(benchmarkDir, x))
  .filter((x) => FS.statSync(x).isFile())
  .map((x) => Benchmark.from_file(x));

const all_vms = [
  { version: "0.2.0", random: true, vm: Crochet_v0_2 },
  { version: "0.3.0", random: true, vm: Crochet_v0_3 },
  { version: "0.3.1", random: false, vm: Crochet_v0_3_1 },
  { version: "0.4.0", random: false, vm: Crochet_v0_4_0 },
  { version: "0.5.0", random: false, vm: Crochet_v0_5_0 },
  { version: pkg.version, tag: "(current)", random: false, vm: Crochet },
];

async function time(label: string, code: () => Promise<any>) {
  const log = console.log;
  const debug = console.debug;
  console.log = () => {};
  const start = new Date().getTime();
  const result = await code();
  const end = new Date().getTime();
  console.log = log;
  console.debug = debug;
  console.log(`--> ${label} (${end - start}ms)`);
  return result;
}

void (async function () {
  const seed0 = Yargs.argv["seed"];
  const seed = seed0 ? Number(seed0) : new Date().getTime() | 0;
  const verbose = Boolean(Yargs.argv["verbose"]);
  const test_all = Boolean(Yargs.argv["full-regression"]);
  const vms = test_all ? all_vms : all_vms.slice(-4);
  if (!test_all) {
    console.log(
      "-- Benchmarking the 4 last releases (use --full-regression benchmark all)"
    );
  }
  if (!verbose) {
    console.debug = () => {};
  }
  console.log("-- Using seed", seed, " (use --seed <seed> to reproduce)");

  for (const bench of benchmarks) {
    console.log("=".repeat(72));
    console.log("##", bench.title);
    for (const { version, tag, random, vm: Crochet } of vms) {
      const fullPath = bench.file_for_version(version);
      console.log("---");
      console.log(":: Crochet", version, tag ?? "");
      if (random) {
        console.log("(Reproducible PRNG not supported in this version)");
      }
      const vm = new Crochet();
      vm.world.global_random?.reseed(seed);
      try {
        await time("Initialisation", () => vm.initialise());
        await time("Load file", () => vm.load_from_file(fullPath));
        await time("Run benchmark", () => vm.run("main"));
      } catch (error) {
        console.error(
          `Failed to execute ${version}:\n`,
          vm.format_error(error)
        );
      }
    }
    console.log("\n");
  }
})();
