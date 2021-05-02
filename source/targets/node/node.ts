import * as Path from "path";
import * as FS from "fs";
import * as Package from "../../pkg";
import { StorageConfig } from "../../storage";
import {
  BootedCrochet,
  Crochet,
  ForeignInterface,
  IFileSystem,
  ISignal,
} from "../../crochet";
import { logger } from "../../utils/logger";
import { question } from "../../utils/prompt";
import { union } from "../../utils/collections";
import { build_file } from "./build";
import { CrochetValue } from "../../vm";

const rootRelative = process.env.WEBPACK ? "" : "../../../";

export class CrochetForNode {
  readonly crochet: Crochet;
  private _booted_system: BootedCrochet | null = null;
  private _root: Package.Package | null = null;
  private _ffi: ForeignInterface | null = null;

  constructor(
    readonly library_paths: string[],
    readonly capabilities: Set<Package.Capability>,
    readonly interactive: boolean
  ) {
    this.crochet = new Crochet(this.fs, this.signal);
  }

  get stdlib_path() {
    return Path.join(__dirname, rootRelative, "stdlib");
  }

  get trusted_core() {
    return new Set(["crochet.core"]);
  }

  get system() {
    if (this._booted_system == null) {
      throw new Error(`Crochet not yet booted`);
    }

    return this._booted_system;
  }

  get root() {
    if (this._root == null) {
      throw new Error(`Crochet not yet booted`);
    }

    return this._root;
  }

  async boot(filename: string, target: Package.Target) {
    if (this._booted_system != null) {
      throw new Error(`Crochet already booted.`);
    }

    await this.register_libraries();
    const root = await this.crochet.register_package(filename);
    const booted = await this.crochet.boot(root.meta.name, target);
    await booted.initialise(root.meta.name);
    this._root = root;
    this._booted_system = booted;
    this._ffi = new ForeignInterface(
      this.system.universe,
      this.system.universe.world.packages.get(this.root.meta.name)!,
      this.root.filename
    );
  }

  async run(entry: string, args: CrochetValue[]) {
    return await this.system.run(entry, args);
  }

  get ffi() {
    if (this._ffi == null) {
      throw new Error(`Crochet not yet booted`);
    }

    return this._ffi;
  }

  fs: IFileSystem = {
    async exists(x: string) {
      return FS.existsSync(x);
    },

    async read_file(x: string) {
      return FS.readFileSync(x, "utf-8");
    },

    async read_binary(x: string) {
      return FS.readFileSync(x);
    },

    async read_native_module(x: string) {
      // FIXME: sandbox
      const module = require(x);
      if (typeof module.default === "function") {
        return module.default;
      } else if (typeof module === "function") {
        return module;
      } else {
        throw new Error(`Native module ${x} does not expose a function`);
      }
    },
  };

  signal: ISignal = {
    request_capabilities: async (
      graph: Package.PackageGraph,
      root: Package.Package
    ) => {
      const requirements = graph.capability_requirements;
      const required = new Set(requirements.keys());

      logger.debug(
        `Granting capabilities (${[...requirements.keys()].join(", ")}) to ${
          root.meta.name
        }`
      );

      if (!this.interactive) {
        return (
          Package.missing_capabilities(this.capabilities, required).size === 0
        );
      } else {
        const config = StorageConfig.load();
        const previous = config.grants(root.meta.name)?.capabilities ?? null;

        if (required.size === 0) {
          return true;
        } else if (previous == null) {
          return this.request_new_capabilities(config, requirements, root);
        } else {
          const caps = union(new Set(previous), this.capabilities);
          const missing = Package.missing_capabilities(caps, required);
          if (missing.size !== 0) {
            return this.request_updated_capabilities(
              previous,
              missing,
              config,
              requirements,
              root
            );
          } else {
            return true;
          }
        }
      }
    },

    no_binary: async (
      file: Package.ResolvedFile,
      pkg: Package.ResolvedPackage
    ) => {
      logger.debug(`Compiling ${file.relative_filename} in ${pkg.name}`);
      await build_file(file, pkg);
      return true;
    },

    outdated_binary: async (
      file: Package.ResolvedFile,
      pkg: Package.ResolvedPackage
    ) => {
      logger.debug(`Re-compiling ${file.relative_filename} in ${pkg.name}`);
      await build_file(file, pkg);
      return true;
    },
  };

  private async request_new_capabilities(
    config: StorageConfig,
    requirements: Map<Package.Capability, Package.ResolvedPackage[]>,
    root: Package.Package
  ) {
    console.log(
      [
        `Running ${root.meta.name} (from ${root.filename}) `,
        `requires the following capabilities:\n`,
        this.format_requirements(requirements),
        `\n\n`,
        `Type 'yes' to grant these capabilities and run the application. `,
        `Your choice will be recorded.`,
      ].join("")
    );
    if (!(await question("[yes/no]> "))) {
      console.log(`Aborting due to lack of capabilities.`);
      return false;
    } else {
      config.update_grants(root.meta.name, [...requirements.keys()]);
      for (const cap of requirements.keys()) {
        this.capabilities.add(cap);
      }
      return true;
    }
  }

  private async request_updated_capabilities(
    previous: Package.Capability[],
    missing_set: Set<Package.Capability>,
    config: StorageConfig,
    requirements: Map<Package.Capability, Package.ResolvedPackage[]>,
    root: Package.Package
  ) {
    const missing = new Map<Package.Capability, Package.ResolvedPackage[]>();
    for (const k of missing_set) {
      missing.set(k, requirements.get(k) ?? []);
    }

    console.log(
      [
        `You have previously granted ${root.meta.name} (from ${root.filename}) `,
        `the the following capabilities:\n`,
        previous.map((x) => `  - ${x}\n`).join(""),
        "\n",
        `It now also requires the following capabilities:\n`,
        this.format_requirements(requirements),
        `\n\n`,
        `Type 'yes' to update the capabilities and run the application. `,
        `Your choice will be recorded.`,
      ].join("")
    );
    if (!(await question("[yes/no]> "))) {
      console.log(`Aborting due to lack of capabilities.`);
      return false;
    } else {
      config.update_grants(root.meta.name, [...requirements.keys()]);
      for (const cap of requirements.keys()) {
        this.capabilities.add(cap);
      }
      return true;
    }
  }

  private format_requirements(
    requirements: Map<string, Package.ResolvedPackage[]>
  ) {
    return [...requirements.entries()].map(([cap, pkgs]) => {
      return `  - ${cap} (from ${pkgs.map((x) => x.name).join(", ")})`;
    });
  }

  private async register_standard_library() {
    const pkgs = await this.register_directory(this.stdlib_path);
    for (const pkg of pkgs) {
      if (this.trusted_core.has(pkg.meta.name)) {
        this.crochet.trust(pkg);
      }
    }
  }

  private async register_directory(root: string) {
    const result = [];
    for (const dir of FS.readdirSync(root)) {
      const path = Path.join(root, dir, "crochet.json");
      if (FS.existsSync(path)) {
        const pkg = await this.crochet.register_package(path);
        result.push(pkg);
      }
    }
    return result;
  }

  private async register_libraries() {
    await this.register_standard_library();
    for (const path of this.library_paths) {
      await this.register_directory(path);
    }
  }
}
