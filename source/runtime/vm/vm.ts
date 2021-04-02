import * as Path from "path";
import * as Compiler from "../../compiler";
import { State } from "./state";
import { World } from "../world";
import { CrochetError } from "./run";
import {
  Capabilities,
  Capability,
  CrochetCapability,
  CrochetPackage,
} from "./pkg";
import { logger } from "../../utils";
import { MachineError } from "./errors";

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

  async load_crochet(filename: string, pkg: CrochetPackage) {
    logger.debug(`Loading ${filename} in ${pkg.name}`);
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

  async load_package(pkg: CrochetPackage, capabilities: Capabilities) {
    logger.debug(
      `Loading package ${pkg.name} with capabilities: ${[
        ...capabilities.capabilities,
      ].join(", ")}`
    );

    // We still need to recursively verify capabilities are consistent
    for (const x of pkg.dependencies) {
      const dep = await this.get_package(x.name);
      const cap0 =
        x.capabilities == null
          ? capabilities
          : capabilities.restrict(x.capabilities);
      const cap = cap0.restrict(dep.required_capabilities);
      await this.load_package(dep, cap);
    }
    if (this.loaded_packages.has(pkg.name)) {
      return;
    }
    this.loaded_packages.add(pkg.name);

    if (!capabilities.allows("native") && pkg.native_sources.length != 0) {
      throw new Error(
        `${pkg.name} (${pkg.filename}) defines native extensions, but has not been granted tne 'native' capability`
      );
    }
    for (const x of pkg.native_sources) {
      logger.debug(`Loading native module ${x} from package ${pkg.name}`);
      const module = await this.load_native(x);
      await module(this);
    }
    for (const x of pkg.sources) {
      await this.load_crochet(x, pkg);
    }
  }

  async load(filename: string) {
    return this.load_with_capabilities(filename, new Capabilities(new Set()));
  }

  async load_with_capabilities(filename: string, capabilities: Capabilities) {
    switch (Path.extname(filename)) {
      case ".json": {
        const pkg = await this.read_package_from_file(filename);
        const cap = capabilities.restrict(pkg.capabilities.requires);
        return await this.load_package(pkg, cap);
      }
      case ".crochet": {
        for (const pkg_name of this.prelude) {
          const pkg = await this.get_package(pkg_name);
          const missing = capabilities.require(pkg.required_capabilities);
          if (missing.size === 0) {
            await this.load_package(pkg, capabilities);
          } else {
            logger.debug(
              `Not loading ${pkg.name} due to missing capabilities: ${[
                ...missing,
              ].join(", ")}`
            );
          }
        }
        return await this.load_crochet(
          filename,
          CrochetPackage.empty(filename, capabilities, this.prelude)
        );
      }
      default:
        throw new Error(`Unsupported file ${filename}`);
    }
  }

  async run(scene: string) {
    logger.debug(`Running scene ${scene}`);
    return await this.world.run(scene);
  }

  async show_error(error: unknown) {
    console.error(this.format_error(error));
  }

  format_error(error: unknown) {
    if (error instanceof MachineError) {
      return error.format();
    } else if (error instanceof Error) {
      return error.stack ?? error.message;
    } else if (error instanceof CrochetError) {
      return error.stack;
    } else {
      return String(error);
    }
  }
}
