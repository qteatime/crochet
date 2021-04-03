import * as Path from "path";
import * as Compiler from "../../compiler";
import { State } from "./state";
import { CrochetTest, World } from "../world";
import { CrochetError, Thread } from "./run";
import {
  AnyTarget,
  Capabilities,
  Capability,
  CrochetCapability,
  CrochetPackage,
  Dependency,
  PackageGraph,
  RestrictedCrochetPackage,
  Target,
} from "../pkg";
import { logger } from "../../utils";
import { MachineError } from "./errors";
import { File } from "../pkg/file";

export abstract class CrochetVM {
  readonly world: World;
  readonly registered_packages: Map<string, CrochetPackage> = new Map();
  readonly loaded_packages: Set<string> = new Set();

  constructor() {
    this.world = new World();
  }

  get ffi() {
    return this.world.ffi;
  }

  reseed(seed: number) {
    this.world.global_random.reseed(seed);
  }

  abstract read_file(filename: string): Promise<string>;
  abstract load_native(
    filename: string
  ): Promise<(_: CrochetVM) => Promise<void> | void>;
  abstract initialise(): Promise<void>;
  abstract prelude: string[];

  private async entry_to_package(filename: string, capabilities: Capabilities) {
    switch (Path.extname(filename)) {
      case ".json": {
        return await this.read_package_from_file(filename);
      }
      case ".crochet": {
        return new CrochetPackage(filename, {
          name: Path.basename(filename),
          target: new AnyTarget(),
          sources: [new File(Path.basename(filename), new AnyTarget())],
          native_sources: [],
          capabilities: {
            requires: capabilities.capabilities,
            provides: new Set(),
          },
          dependencies: this.prelude.map(
            (x) => new Dependency(x, null, new AnyTarget())
          ),
        });
      }
      default:
        throw new Error(`Unsupported file ${filename}`);
    }
  }

  async load_crochet(filename: string, pkg: RestrictedCrochetPackage) {
    logger.debug(`Loading ${filename} from package ${pkg.name}`);
    const source = await this.read_file(filename);
    const ast = Compiler.parse(source);
    const ir = Compiler.compileProgram(ast);
    const state = State.root(this.world);
    await state.world.load_declarations(filename, ir, state.env, pkg);
  }

  async register_package(name: string, pkg: CrochetPackage) {
    const old = this.registered_packages.get(name);
    if (old != null) {
      throw new Error(
        `Duplicated package ${name}. Defined in ${pkg.filename} and ${old.filename}`
      );
    }
    logger.debug(`Registered package ${name} from ${pkg.filename}`);
    this.registered_packages.set(name, pkg);
  }

  async read_package_from_file(filename: string) {
    const source = await this.read_file(filename);
    return CrochetPackage.parse(JSON.parse(source), filename);
  }

  async get_package(name: string) {
    const pkg = this.registered_packages.get(name);
    if (pkg == null) {
      throw new Error(`Package ${name} is not registered`);
    }
    return pkg;
  }

  async load_package(pkg: RestrictedCrochetPackage) {
    logger.debug(`Loading package ${pkg.name}`);

    for (const x of pkg.native_sources) {
      logger.debug(`Loading native module ${x} from package ${pkg.name}`);
      const module = await this.load_native(x);
      await module(this);
    }
    for (const x of pkg.sources) {
      await this.load_crochet(x, pkg);
    }
  }

  async load(filename: string, target: Target) {
    return this.load_with_capabilities(filename, target, Capabilities.safe);
  }

  async load_with_capabilities(
    filename: string,
    target: Target,
    capabilities: Capabilities
  ) {
    const pkg = await this.entry_to_package(filename, capabilities);
    const graph = await PackageGraph.resolve(target, this, pkg);
    graph.check(pkg.name, capabilities);
    for (const x of graph.serialise(pkg.name)) {
      await this.load_package(x);
    }
  }

  async run(scene: string) {
    logger.debug(`Running scene ${scene}`);
    return await this.world.run(scene);
  }

  async run_tests(filter: (_: CrochetTest) => boolean) {
    let failures = [];
    let total = 0;
    let skipped = 0;
    const state = State.root(this.world);
    for (const [group, tests] of this.world.grouped_tests) {
      console.log("");
      console.log(group);
      console.log("=".repeat(72));
      for (const test of tests) {
        total += 1;

        if (!filter(test)) {
          skipped += 1;
          continue;
        }

        try {
          const machine = test.evaluate(state);
          await Thread.for_machine(machine).run_and_wait();
          console.log(`[OK]    ${test.title}`);
        } catch (error) {
          console.log("-".repeat(3));
          console.log(`[ERROR] ${test.title}`);
          console.log(this.format_error(error));
          console.log("-".repeat(3));
          failures.push(error);
        }
      }
    }

    console.log("");
    console.log("-".repeat(72));
    console.log(
      `${total} tests  |  ${skipped} skipped  |  ${failures.length} failures`
    );

    return failures;
  }

  async show_error(error: unknown) {
    console.error(this.format_error(error));
  }

  format_error(error: unknown): string {
    if (error instanceof MachineError) {
      return error.format();
    } else if (error instanceof Error) {
      if (logger.verbose && error.stack != null) {
        return error.stack;
      } else {
        return `${error.name}: ${error.message}`;
      }
    } else if (error instanceof CrochetError) {
      return error.stack;
    } else {
      return String(error);
    }
  }
}
