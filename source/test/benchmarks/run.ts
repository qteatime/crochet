import * as Path from "path";
import * as FS from "fs";
import * as Package from "../../pkg";
import { CrochetForBench } from "../../targets/bench";
import type { XorShift } from "../../utils/xorshift";
import { logger } from "../../utils/logger";
import { Values } from "../../vm";

type OldCrochet = {
  initialise(): Promise<void>;
  load_from_file(file: string): Promise<void>;
  run(name: string): Promise<void>;
  format_error?(error: any): string;
  world: {
    global_random: XorShift;
  };
};

type Crochet0 = { new (): CrochetForBench & OldCrochet };
type Crochet1 = { new (path: string): CrochetForBench & OldCrochet };
type AnyCrochet = CrochetForBench | (CrochetForBench & OldCrochet);

const Crochet_v0_2 = require("../../../versions/crochet-v0.2.0")
  .Crochet as Crochet0;
const Crochet_v0_3 = require("../../../versions/crochet-v0.3.0")
  .Crochet as Crochet0;
const Crochet_v0_3_1 = require("../../../versions/crochet-v0.3.1")
  .Crochet as Crochet0;
const Crochet_v0_4_0 = require("../../../versions/crochet-v0.4.0")
  .Crochet as Crochet0;
const Crochet_v0_5_0 = require("../../../versions/crochet-v0.5.0")
  .Crochet as Crochet0;
const Crochet_v0_6_0 = require("../../../versions/crochet-v0.6.0")
  .Crochet as Crochet1;
const Crochet_v0_7_0 = require("../../../versions/crochet-v0.7.0")
  .Crochet as Crochet1;
const pkg = require("../../../package.json");

const root = Path.join(__dirname, "../../../");

interface IBenchmark {
  title: string;
  versions: {
    [key: string]: string;
  };
}

function is_crochet_1(vm: AnyCrochet): vm is CrochetForBench & OldCrochet {
  return "world" in vm;
}

function reseed(seed: number, vm: AnyCrochet) {
  if (is_crochet_1(vm)) {
    if (vm.world.global_random) {
      return vm.world.global_random.reseed(seed);
    }
  } else {
    return vm.reseed(seed);
  }
}

async function initialise(vm: AnyCrochet, filename: string) {
  if (is_crochet_1(vm)) {
    await vm.initialise();
    await vm.load_from_file(filename);
  } else {
    const pkg = Package.parse(
      {
        name: `(bench) ${Path.basename(filename)}`,
        target: "node",
        sources: [filename],
        dependencies: ["crochet.core", "crochet.debug", "crochet.mathematics"],
      },
      filename
    );
    await vm.boot(pkg, Package.target_node());
  }
}

async function run(vm: AnyCrochet) {
  if (is_crochet_1(vm)) {
    await vm.run("main");
  } else {
    await vm.run("main: _", [Values.make_tuple(vm.system.universe, [])]);
  }
}

async function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
}

function format_error(error: any, vm: AnyCrochet) {
  if (is_crochet_1(vm)) {
    if (vm.format_error) {
      return vm.format_error(error);
    } else {
      return error.stack ?? error.message ?? error;
    }
  } else {
    return error.stack ?? error.message;
  }
}

const benchmarkDir = Path.join(root, "benchmarks");
const benchStdlib = (v: string) => Path.join(benchmarkDir, "stdlib", v);

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

  file_for_version(version: string): string | null {
    const v = Version.parse(version);
    for (const [version, file] of this.versions) {
      if (v.gte(version)) {
        return Path.resolve(root, file);
      }
    }
    return null;
  }
}

const benchmarks = FS.readdirSync(benchmarkDir)
  .map((x) => Path.join(benchmarkDir, x))
  .filter((x) => FS.statSync(x).isFile())
  .map((x) => Benchmark.from_file(x));

const StdlibPath = Path.join(__dirname, "../../../stdlib");

const all_vms = [
  { version: "0.2.0", random: true, vm: () => new Crochet_v0_2() },
  { version: "0.3.0", random: true, vm: () => new Crochet_v0_3() },
  { version: "0.3.1", random: false, vm: () => new Crochet_v0_3_1() },
  { version: "0.4.0", random: false, vm: () => new Crochet_v0_4_0() },
  { version: "0.5.0", random: false, vm: () => new Crochet_v0_5_0() },
  {
    version: "0.6.0",
    random: false,
    vm: () => new Crochet_v0_6_0(benchStdlib("0.6.0")),
  },
  {
    version: "0.7.0",
    random: false,
    tag: "(stable)",
    vm: () => new Crochet_v0_7_0(benchStdlib("0.7.0")),
  },
  {
    version: pkg.version,
    tag: "(current)",
    random: false,
    vm: () => new CrochetForBench(StdlibPath, new Set([])),
  },
];

async function time(
  label: string,
  code: () => Promise<unknown>
): Promise<number> {
  const log = console.log;
  const debug = console.debug;
  try {
    console.log = () => {};
    const start = new Date().getTime();
    const result = await code();
    const end = new Date().getTime();
    const diff = end - start;
    console.log = log;
    console.debug = debug;
    console.log(`--> ${label} (${diff}ms)`);
    return diff;
  } catch (e) {
    console.log = log;
    console.debug = debug;
    throw e;
  }
}

function mb(x: number) {
  return `${(x / 1024 / 1024).toFixed(3)}MB`;
}

void (async function () {
  const [seed0, verbose0, test_all0] = process.argv.slice(2);

  const seed = seed0 ? Number(seed0) : new Date().getTime() | 0;
  const verbose = verbose0 === "verbose";
  const vms =
    test_all0 === "full_regression"
      ? all_vms
      : test_all0 === "latest"
      ? all_vms.slice(-4)
      : all_vms.filter((x) => x.version === test_all0);
  console.log(
    `Usage: run [<seed>] [verbose] [full-regression|latest|<version>]`
  );
  if (test_all0 === "latest") {
    console.log("-- Benchmarking the 4 last releases");
  }
  logger.verbose = verbose;
  if (!verbose) {
    console.debug = () => {};
  }
  console.log("-- Using seed", seed);

  for (const bench of benchmarks) {
    console.log("=".repeat(72));
    console.log("##", bench.title);
    for (const { version, tag, random, vm: Crochet } of vms) {
      const fullPath = bench.file_for_version(version);
      if (fullPath == null) {
        console.log(`Skipping ${version}, no suitable benchmark found`);
        continue;
      }

      global.gc?.();
      await sleep(10);

      console.log("---");
      console.log(":: Crochet", version, tag ?? "");
      if (random) {
        console.log("(Reproducible PRNG not supported in this version)");
      }
      const vm = Crochet();
      try {
        let total = 0;
        total += await time("Initialisation", () => initialise(vm, fullPath));
        reseed(seed, vm);
        {
          const end_memory = process.memoryUsage();
          console.log(
            `--> Memory: Used ${mb(end_memory.heapUsed)} | Total ${mb(
              end_memory.heapTotal
            )} | RSS ${mb(end_memory.rss)}`
          );
          global.gc?.();
        }
        total += await time("Run benchmark", () => run(vm));
        {
          console.log(`--> Total: ${total}ms`);
          const end_memory = process.memoryUsage();
          console.log(
            `--> Memory: Used ${mb(end_memory.heapUsed)} | Total ${mb(
              end_memory.heapTotal
            )} | RSS ${mb(end_memory.rss)}`
          );
        }
      } catch (error) {
        console.error(
          `Failed to execute ${version}:\n`,
          format_error(error, vm)
        );
      }
    }
    console.log("\n");
  }
})();
