import * as Path from "path";
import * as Compiler from "../../compiler";
import { State } from "./state";
import { World } from "../world";
import { CrochetError } from "./run";
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
          sources: [new File(Path.basename(filename), new AnyTarget())],
          native_sources: [],
          capabilities: {
            requires: capabilities.capabilities,
            provides: new Set(),
          },
          dependencies: this.prelude.map((x) => new Dependency(x, null)),
        });
      }
      default:
        throw new Error(`Unsupported file ${filename}`);
    }
  }

  async load_crochet(filename: string, pkg: CrochetPackage) {
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
    graph.check_capabilities(pkg.name, capabilities);
    for (const x of graph.serialise(pkg.name)) {
      await this.load_package(x);
    }
  }

  async run(scene: string) {
    logger.debug(`Running scene ${scene}`);
    return await this.world.run(scene);
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
