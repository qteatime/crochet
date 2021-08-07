import * as Path from "path";
import * as Package from "../pkg";
import * as IR from "../ir";
import * as VM from "../vm";
import * as Binary from "../binary";
import { logger } from "../utils/logger";
import { ForeignInterface } from "./foreign";
import { CrochetValue, Environment, CrochetTrace } from "../vm";

export interface IFileSystem {
  read_package(name: string): Promise<Package.Package>;
  read_file(x: string): Promise<string>;
  read_binary(
    file: Package.ResolvedFile,
    pkg: Package.ResolvedPackage
  ): Promise<Buffer>;
  read_native_module(
    file: Package.ResolvedFile,
    pkg: Package.ResolvedPackage
  ): Promise<(_: ForeignInterface) => Promise<void>>;
}

export interface ISignal {
  request_capabilities(
    graph: Package.PackageGraph,
    root: Package.Package
  ): Promise<boolean>;

  booted(vm: BootedCrochet): Promise<void>;
}

export class Crochet {
  readonly trusted = new Set<Package.Package>();
  readonly registered_packages: Map<string, Package.Package> = new Map();

  constructor(readonly fs: IFileSystem, readonly signal: ISignal) {}

  async boot(root: string, target: Package.Target) {
    const pkg = await this.get_package(root);
    const graph = await Package.build_package_graph(
      pkg,
      target,
      this.trusted,
      this.resolver
    );
    if (await this.signal.request_capabilities(graph, pkg)) {
    } else {
      throw new Error(
        `Aborting boot because the system denied the required capabilities.`
      );
    }

    const vm = new BootedCrochet(this, graph);
    await this.signal.booted(vm);
    return vm;
  }

  trust(pkg: Package.Package) {
    this.trusted.add(pkg);
  }

  async register_package_from_file(filename: string) {
    const source = await this.fs.read_file(filename);
    const pkg = Package.parse_from_string(source, filename);
    return this.register_package(pkg);
  }

  async register_package(pkg: Package.Package) {
    const old = this.registered_packages.get(pkg.meta.name);
    if (old != null) {
      if (Path.resolve(old.filename) !== Path.resolve(pkg.filename)) {
        throw new Error(
          [
            `Duplicated package ${pkg.meta.name}.\n`,
            `Defined in ${pkg.filename} and ${old.filename}`,
          ].join("")
        );
      } else {
        return old;
      }
    }
    logger.debug(`Registered package ${pkg.meta.name} for ${pkg.filename}`);
    this.registered_packages.set(pkg.meta.name, pkg);
    return pkg;
  }

  private resolver: Package.IPackageResolution = {
    get_package: async (name: string) => {
      return this.get_package(name);
    },
  };

  private async get_package(name: string) {
    const pkg = this.registered_packages.get(name);
    if (pkg == null) {
      const pkg = await this.fs.read_package(name);
      this.register_package(pkg);
      return pkg;
    }
    return pkg;
  }
}

export class BootedCrochet {
  private initialised: boolean = false;
  readonly universe: VM.Universe;

  constructor(readonly crochet: Crochet, readonly graph: Package.PackageGraph) {
    this.universe = VM.make_universe();
  }

  async initialise(root: string) {
    if (this.initialised) {
      throw new Error(`initialise() called twice!`);
    }

    this.initialised = true;
    const pkg = this.graph.get_package(root);
    for (const x of this.graph.serialise(pkg)) {
      await this.load_package(x);
    }

    await VM.run_prelude(this.universe);
  }

  async run(name: string, args: VM.CrochetValue[]) {
    this.assert_initialised();
    const result = await VM.run_command(this.universe, name, args);
    return result;
  }

  private assert_initialised() {
    if (!this.initialised) {
      throw new Error(`The VM has not been initialised yet.`);
    }
  }

  private async load_package(pkg: Package.ResolvedPackage) {
    logger.debug(`Loading package ${pkg.name}`);
    const cpkg = VM.World.get_or_make_package(this.universe.world, pkg);

    for (const x of pkg.native_sources) {
      await this.load_native(x, pkg, cpkg);
    }

    for (const x of pkg.sources) {
      await this.load_source(x, pkg, cpkg);
    }
  }

  private async load_native(
    x: Package.ResolvedFile,
    pkg: Package.ResolvedPackage,
    cpkg: VM.CrochetPackage
  ) {
    logger.debug(
      `Loading native module ${x.relative_filename} from package ${pkg.name}`
    );
    const module = await this.crochet.fs.read_native_module(x, pkg);
    const ffi = new ForeignInterface(this.universe, cpkg, x.relative_filename);
    await module(ffi);
  }

  private async load_source(
    x: Package.ResolvedFile,
    pkg: Package.ResolvedPackage,
    cpkg: VM.CrochetPackage
  ): Promise<VM.CrochetModule> {
    logger.debug(
      `Loading module ${x.relative_filename} from package ${pkg.name}`
    );

    const buffer = await this.crochet.fs.read_binary(x, pkg);
    const header = Binary.decode_header(buffer);

    if (header.version !== Binary.VERSION) {
      throw new Error(
        [
          `Failed to load ${x.relative_filename} in ${pkg.name}. `,
          `The compiled binary image cannot be decoded by this VM `,
          `due to a version mismatch (expected ${Binary.VERSION}, `,
          `found ${header.version})`,
        ].join("")
      );
    }

    const ir = Binary.decode_program(buffer);
    const module = VM.load_module(this.universe, cpkg, ir);
    return module;
  }

  async run_tests(filter: (_: VM.CrochetTest) => boolean) {
    const tests0 = VM.Tests.grouped_tests(this.universe);
    const {
      total,
      skipped,
      tests: tests1,
    } = VM.Tests.filter_grouped_tests(tests0, filter);
    const failures = [];
    const start = new Date().getTime();

    for (const [group, modules] of tests1) {
      console.log("");
      console.log(group);
      console.log("=".repeat(72));

      for (const [module, tests] of modules) {
        console.log("");
        console.log(module);
        console.log("-".repeat(72));

        for (const test of tests) {
          try {
            await VM.run_test(this.universe, test);
            console.log(`[OK]    ${test.title}`);
          } catch (error) {
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

  async load_declaration(x: IR.Declaration, module: VM.CrochetModule) {
    VM.load_declaration(this.universe, module, x);
  }

  async run_block(x: IR.BasicBlock, env: VM.Environment) {
    const block = new IR.BasicBlock([...x.ops, new IR.Return(0)]);
    return await VM.run_block(this.universe, env, block);
  }

  async invoke(name: string, args: CrochetValue[]) {
    return await VM.run_command(this.universe, name, args);
  }
}
