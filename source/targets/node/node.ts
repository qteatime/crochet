import * as Path from "path";
import * as FS from "fs";
import * as Package from "../../pkg";
import * as VM from "../../vm";
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
import { build, build_file, read_updated_binary } from "./build";
import {
  CrochetTest,
  CrochetValue,
  TELog,
  TraceEvent,
  Location,
} from "../../vm";

const rootRelative = process.env.WEBPACK ? "" : "../../../";

export class CrochetForNode {
  readonly crochet: Crochet;
  private _booted_system: BootedCrochet | null = null;
  private _root: Package.Package | null = null;
  private _ffi: ForeignInterface | null = null;

  constructor(
    disclose_debug: boolean,
    readonly library_paths: string[],
    readonly capabilities: Set<Package.Capability>,
    readonly interactive: boolean,
    readonly safe_mode: boolean
  ) {
    this.crochet = new Crochet(safe_mode, this.fs, this.signal);
  }

  render_entry = (entry: TraceEvent) => {
    if (entry instanceof TELog) {
      const message = entry.value;
      if (typeof message === "string") {
        console.log(`[${entry.log_tag}] ${message}`);
      } else {
        console.log(`[${entry.log_tag}] ${Location.simple_value(message)}`);
      }
    }
  };

  get search_paths() {
    return [this.stdlib_path, ...this.library_paths];
  }

  get stdlib_path() {
    return Path.join(__dirname, rootRelative, "stdlib");
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

  async boot_from_file(filename: string, target: Package.Target) {
    const pkg = this.read_package_from_file(filename);
    return this.boot(pkg, target);
  }

  async boot(entry: Package.Package, target: Package.Target) {
    if (this._booted_system != null) {
      throw new Error(`Crochet already booted.`);
    }

    await this.register_libraries();
    const root = await this.crochet.register_package(entry);
    const booted = await this.crochet.boot(root.meta.name, target);
    await booted.initialise(root.meta.name, this.safe_mode);
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

  async run_tests(
    filter: (_: CrochetTest) => boolean,
    verbose: boolean = false
  ) {
    const universe = this._booted_system!.universe;
    const tests0 = VM.Tests.grouped_tests(universe);
    const {
      total,
      skipped,
      tests: tests1,
    } = VM.Tests.filter_grouped_tests(tests0, filter);
    const failures = [];
    const start = new Date().getTime();
    let current = "";
    let sub_current = "";

    for (const [group, modules] of tests1) {
      sub_current = "";
      const group_header = `\n${group}\n${"=".repeat(72)}\n`;
      if (verbose) {
        console.log(group_header);
      } else {
        current = group_header;
      }

      for (const [module, tests] of modules) {
        const module_header = `\n${module}\n${"-".repeat(72)}\n`;
        if (verbose) {
          console.log(module_header);
        } else {
          sub_current = module_header;
        }

        for (const test of tests) {
          try {
            await VM.run_test(universe, test);
            if (verbose) {
              console.log(`[OK]    ${test.title}`);
            }
          } catch (error: any) {
            if (!verbose) {
              if (current) {
                console.log(current);
                current = "";
              }
              if (sub_current) {
                console.log(sub_current);
                sub_current = "";
              }
            }
            console.log("-".repeat(3));
            console.log(`[ERROR] ${test.title}`);
            console.log(error.stack ?? error);
            console.log("-".repeat(3));
            failures.push(error);
          }
        }
      }
    }

    const end = new Date().getTime();
    const diff = end - start;
    console.log("");
    console.log("-".repeat(72));
    console.log(
      `${total} tests in ${diff}ms  |  ${skipped} skipped  |  ${failures.length} failed`
    );

    return failures;
  }

  async build(file: string) {
    const pkg = await this.read_package_from_file(file);
    await build(new Package.ResolvedPackage(pkg, Package.target_any()));
  }

  read_package_from_file(filename: string) {
    const source = FS.readFileSync(filename, "utf-8");
    return Package.parse_from_string(source, filename);
  }

  get ffi() {
    if (this._ffi == null) {
      throw new Error(`Crochet not yet booted`);
    }

    return this._ffi;
  }

  fs: IFileSystem = {
    async read_file(x: string) {
      return FS.readFileSync(x, "utf-8");
    },

    async read_binary(
      file: Package.ResolvedFile,
      pkg: Package.ResolvedPackage
    ) {
      return read_updated_binary(file, pkg);
    },

    read_package: async (name: string) => {
      for (const root of this.search_paths) {
        const full_path = Path.join(root, name, "crochet.json");
        if (FS.existsSync(full_path)) {
          const source = FS.readFileSync(full_path, "utf-8");
          return Package.parse_from_string(source, full_path);
        }
      }
      throw new Error(
        `The package ${name} was not found in any the library directories:\n  - ${this.search_paths.join(
          "\n  - "
        )}`
      );
    },

    async read_native_module(
      file: Package.ResolvedFile,
      pkg: Package.ResolvedPackage
    ) {
      // FIXME: sandbox
      const module = require(file.absolute_filename);
      if (typeof module.default === "function") {
        return module.default;
      } else {
        throw new Error(
          `Native module ${file.relative_filename} in ${pkg.name} does not expose a function`
        );
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
        return this.capabilities;
      } else {
        const config = StorageConfig.load();
        const previous = config.grants(root.meta.name)?.capabilities ?? null;

        if (required.size === 0) {
          return this.capabilities;
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
            return caps;
          }
        }
      }
    },

    booted: async (vm: BootedCrochet) => {
      vm.universe.trace.subscribe(this.render_entry);
    },

    async report_test(message) {},
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
      return this.capabilities;
    } else {
      config.update_grants(root.meta.name, [...requirements.keys()]);
      for (const cap of requirements.keys()) {
        this.capabilities.add(cap);
      }
      return this.capabilities;
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
        this.format_requirements(missing),
        `\n\n`,
        `Type 'yes' to update the capabilities and run the application. `,
        `Your choice will be recorded.`,
      ].join("")
    );
    if (!(await question("[yes/no]> "))) {
      return this.capabilities;
    } else {
      config.update_grants(root.meta.name, [...requirements.keys()]);
      for (const cap of requirements.keys()) {
        this.capabilities.add(cap);
      }
      return this.capabilities;
    }
  }

  private format_requirements(
    requirements: Map<string, Package.ResolvedPackage[]>
  ) {
    return [...requirements.entries()]
      .map(([cap, pkgs]) => {
        return `  - ${cap} (required by ${pkgs.map((x) => x.name).join(", ")})`;
      })
      .join("\n");
  }

  private async register_standard_library() {
    const pkgs = await this.register_directory(this.stdlib_path);
    for (const pkg of pkgs) {
      if (this.crochet.trusted_core.has(pkg.meta.name)) {
        this.crochet.trust(pkg);
      }
    }
  }

  private async register_directory(root: string) {
    const result = [];
    for (const dir of FS.readdirSync(root)) {
      const path = Path.join(root, dir, "crochet.json");
      if (FS.existsSync(path)) {
        const pkg = await this.crochet.register_package_from_file(path);
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
