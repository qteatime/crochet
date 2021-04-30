import * as Path from "path";
import * as Compiler from "../compiler";
import { CrochetTest, World } from "../runtime";
import { State } from "../runtime";
import { CrochetError, Thread } from "../runtime";
import {
  AnyTarget,
  Capabilities,
  CrochetPackage,
  Dependency,
  PackageGraph,
  RestrictedCrochetPackage,
  Target,
} from "../runtime/pkg";
import { logger } from "../utils/logger";
import { MachineError } from "../runtime/vm/errors/errors";
import { File } from "../runtime/pkg/file";
import { Plugin } from "../plugin";

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
  ): Promise<(_: Plugin) => Promise<void> | void>;
  abstract initialise(): Promise<void>;
  abstract prelude: string[];

  async load_source(filename: string, pkg: RestrictedCrochetPackage) {
    switch (Path.extname(filename)) {
      case ".crochet": {
        return this.load_crochet(filename, pkg);
      }

      default:
        return this.load_crochet(filename + ".crochet", pkg);
    }
  }

  async load_crochet(filename: string, pkg: RestrictedCrochetPackage) {
    logger.debug(
      `Loading ${pkg.relative_filename(filename)} from package ${pkg.name}`
    );
    const source = await this.read_file(filename);
    const ast = Compiler.parse(source, filename);
    const ir = (Compiler as any).compileProgram(ast);
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
    try {
      return CrochetPackage.parse(JSON.parse(source), filename);
    } catch (error) {
      throw new Error(`In ${filename}\n${error.message}`);
    }
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
      logger.debug(
        `Loading native module ${pkg.relative_filename(x)} from package ${
          pkg.name
        }`
      );
      const module = await this.load_native(x);

      const ffi = this.world.ffi;
      const plugin = new Plugin(pkg, ffi);
      await module(plugin);
    }
    for (const x of pkg.sources) {
      await this.load_source(x, pkg);
    }
  }

  async load_graph(graph: PackageGraph, pkg: RestrictedCrochetPackage) {
    for (const x of graph.serialise(pkg.name)) {
      await this.load_package(x);
    }
  }

  async resolve(filename: string, target: Target) {
    const pkg0 = await this.read_package_from_file(filename);
    if (!this.registered_packages.has(pkg0.name)) {
      this.register_package(pkg0.name, pkg0);
    }
    const pkg = pkg0.restricted_to(target);
    const graph = await PackageGraph.resolve(target, this, pkg);
    return { graph, pkg };
  }

  async run(scene: string) {
    logger.debug(`Running scene ${scene}`);
    return await this.world.run(scene);
  }

  async run_initialisation() {
    await this.world.run_init();
  }

  async run_tests(filter: (_: CrochetTest) => boolean) {
    const start = new Date();
    await this.run_initialisation();

    let failures = [];
    let total = 0;
    let skipped = 0;
    const state = State.root(this.world);
    for (const [group, modules] of this.world.grouped_tests) {
      console.log("");
      console.log(group);
      console.log("=".repeat(72));

      for (const [module, tests] of modules) {
        const valid_tests = tests.filter(filter);
        if (valid_tests.length === 0) {
          continue;
        }

        console.log("");
        console.log(module);
        console.log("-".repeat(72));

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
    }

    const end = new Date();
    const diff = end.getTime() - start.getTime();
    console.log("");
    console.log("-".repeat(72));
    console.log(
      `${total} tests in ${diff}ms  |  ${skipped} skipped  |  ${failures.length} failures`
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
