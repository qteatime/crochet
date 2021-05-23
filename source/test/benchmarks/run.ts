import * as Path from "path";
import * as FS from "fs";
import * as Package from "../../pkg";
import { CrochetForBench } from "../../targets/bench";
import type { XorShift } from "../../utils/xorshift";
import { logger } from "../../utils/logger";
import { CrochetValue, Values } from "../../vm";

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
    [key: string]: string | IVariant[];
  };
  baseline?: string;
  seed: number;
  dependencies: string[];
}

interface IVariant {
  tag: string;
  source: string;
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

async function initialise(vm: AnyCrochet, filename: string, bench: Benchmark) {
  if (is_crochet_1(vm)) {
    await vm.initialise();
    await vm.load_from_file(filename);
  } else {
    const pkg = Package.parse(
      {
        name: `(bench) ${Path.basename(filename)}`,
        target: "node",
        sources: [filename],
        dependencies: bench.data.dependencies,
      },
      filename
    );
    await vm.boot(pkg, Package.target_node());
  }
}

async function run(vm: AnyCrochet, seed: number): Promise<CrochetValue> {
  if (is_crochet_1(vm)) {
    return (await vm.run("main")) as any;
  } else {
    return await vm.run("main: _", [
      Values.make_integer(vm.system.universe, BigInt(seed)),
    ]);
  }
}

async function verify(vm: AnyCrochet, result: CrochetValue) {
  if (is_crochet_1(vm)) {
    console.log("(Skipping verification: not supported)");
  } else {
    await vm.run("verify: _", [result]);
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
  readonly versions: { version: Version; variants: IVariant[] }[];
  readonly baseline: null | string = null;
  readonly seed: number;
  constructor(readonly root_dir: string, readonly data: IBenchmark) {
    this.title = data.title;
    this.versions = [];
    for (const [version, variants] of Object.entries(data.versions)) {
      const parsed_version = Version.parse(version);
      if (typeof variants === "string") {
        this.versions.push({
          version: parsed_version,
          variants: [
            {
              tag: "",
              source: Path.resolve(root_dir, variants),
            },
          ],
        });
      } else {
        this.versions.push({
          version: parsed_version,
          variants: variants.map((v) => ({
            tag: v.tag,
            source: Path.resolve(root_dir, v.source),
          })),
        });
      }
    }
    this.versions.sort((a, b) => b.version.compare_to(a.version));
    if (data.baseline != null) {
      this.baseline = Path.resolve(root_dir, data.baseline);
    }
    this.seed = data.seed;
  }

  static from_file(filename: string) {
    return new Benchmark(
      Path.dirname(filename),
      JSON.parse(FS.readFileSync(filename, "utf8"))
    );
  }

  variants_for_version(version: string): IVariant[] | null {
    const v = Version.parse(version);
    for (const { version, variants } of this.versions) {
      if (v.gte(version)) {
        return variants;
      }
    }
    return null;
  }
}

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

export function format_time_diff(n: bigint) {
  const units: [bigint, string][] = [
    [1000n, "μs"],
    [1000n, "ms"],
    [1000n, "s"],
  ];

  let value = n;
  let suffix = "ns";
  for (const [divisor, unit] of units) {
    if (value > divisor) {
      value = value / divisor;
      suffix = unit;
    } else {
      break;
    }
  }

  return `${value}${suffix}`;
}

async function time<T>(
  label: string,
  code: () => Promise<T>
): Promise<[bigint, T]> {
  try {
    const start = process.hrtime.bigint();
    const result = await code();
    const end = process.hrtime.bigint();
    const diff = end - start;
    console.log(`--> ${label} ${format_time_diff(diff)}`);
    return [diff, result];
  } catch (e) {
    throw e;
  }
}

void (async function () {
  const [suite, test_all0, verbose0] = process.argv.slice(2);
  console.log(
    `Usage: run <suite> <full-regression|latest|<version>> [verbose]`
  );
  if (!suite) {
    process.exit(1);
  }

  const bench = Benchmark.from_file(suite);
  const seed = bench.seed;

  const verbose = verbose0 === "verbose";
  const vms =
    test_all0 === "full_regression"
      ? all_vms
      : test_all0 === "latest"
      ? all_vms.slice(-4)
      : test_all0
      ? all_vms.filter((x) => x.version === test_all0)
      : all_vms.slice(-1);
  if (test_all0 === "latest") {
    console.log("-- Benchmarking the 4 last releases");
  }
  logger.verbose = verbose;
  if (!verbose) {
    console.debug = () => {};
  }

  console.log("-- Using seed", seed);

  console.log("=".repeat(72));
  console.log("##", bench.title);

  if (bench.baseline != null) {
    console.log("---");
    console.log(":: JavaScript baseline");
    const runner = require(bench.baseline);
    const [_, result] = await time("Run", () => runner.run(seed));
    if (!runner.verify(result)) {
      console.log(`(Invalid result)`);
    }
  }

  for (const { version, tag, random, vm: Crochet } of vms) {
    const variants = bench.variants_for_version(version);
    if (variants == null) {
      console.log(`Skipping ${version}, no suitable benchmark found`);
      continue;
    }

    for (const variant of variants) {
      global.gc?.();
      await sleep(10);

      console.log("---");
      console.log(":: Crochet", version, tag ?? "", variant.tag ?? "");
      if (random) {
        console.log("(Reproducible PRNG not supported in this version)");
      }
      const vm = Crochet();
      try {
        let total = 0n;
        const [init_time, _] = await time("Initialisation", () =>
          initialise(vm, variant.source, bench)
        );
        total += init_time;

        reseed(seed, vm);

        const [run_time, result] = await time("Run benchmark", () =>
          run(vm, seed)
        );
        await verify(vm, result);
        total += run_time;
        console.log("--> Total:", format_time_diff(total));
      } catch (error) {
        console.error(
          `Failed to execute ${version}:\n`,
          format_error(error, vm)
        );
      }
    }
  }
  console.log("\n");
})();
