import * as Path from "path";
import * as Package from "../pkg";
import * as IR from "../ir";
import * as VM from "../vm";
import * as Binary from "../binary";
import { logger } from "../utils/logger";
import { ForeignInterface } from "./foreign";
import {
  CrochetValue,
  ErrArbitrary,
  debug_perspectives,
  CrochetType,
  debug_representations,
} from "../vm";
import { random_uuid } from "../utils/uuid";
import { AggregatedFS } from "../scoped-fs/aggregated-fs";

export type TestReportMessage =
  | TRM_Started
  | TRM_Test_Started
  | TRM_Test_Passed
  | TRM_Test_Failed
  | TRM_Test_Skipped
  | TRM_Finished;
export abstract class TestReportMessageBase {}
export class TRM_Started extends TestReportMessageBase {
  readonly tag = "started";
  constructor(readonly id: string) {
    super();
  }
}
export class TRM_Test_Started extends TestReportMessageBase {
  readonly tag = "test-started";
  constructor(
    readonly id: string,
    readonly test_id: string,
    readonly pkg: string,
    readonly module: string,
    readonly name: string
  ) {
    super();
  }
}
export class TRM_Test_Passed extends TestReportMessageBase {
  readonly tag = "test-passed";
  constructor(readonly id: string, readonly test_id: string) {
    super();
  }
}
export class TRM_Test_Failed extends TestReportMessageBase {
  readonly tag = "test-failed";
  constructor(
    readonly id: string,
    readonly test_id: string,
    readonly message: string
  ) {
    super();
  }
}
export class TRM_Test_Skipped extends TestReportMessageBase {
  readonly tag = "test-skipped";
  constructor(readonly id: string, readonly test_id: string) {
    super();
  }
}
export class TRM_Finished extends TestReportMessageBase {
  readonly tag = "finished";
  constructor(readonly id: string) {
    super();
  }
}

export interface ISignal {
  request_capabilities(
    graph: Package.PackageGraph,
    root: Package.Package
  ): Promise<Set<Package.Capability>>;

  booted(vm: BootedCrochet): Promise<void>;

  report_test(message: TestReportMessage): Promise<void>;
}

export class Crochet {
  readonly trusted = new Set<Package.Package>();
  readonly registered_packages: Map<string, Package.Package> = new Map();

  constructor(
    readonly tokens: { universe: string; packages: Map<string, string> },
    readonly safe_mode: boolean,
    readonly fs: AggregatedFS,
    readonly signal: ISignal
  ) {}

  get trusted_core() {
    // TODO: restrict TCB (needs safer native modules support)
    return new Set([
      "crochet.codec.basic",
      "crochet.concurrency",
      "crochet.core",
      "crochet.debug",
      "crochet.debug.tracing",
      "crochet.language.csv",
      "crochet.language.json",
      "crochet.mathematics",
      "crochet.network.types",
      "crochet.novella",
      "crochet.random",
      "crochet.text.parsing.lingua",
      "crochet.text.regex",
      "crochet.time",
      "crochet.ui.agata",
      "crochet.wrapper.browser.web-apis",
      "crochet.wrapper.node.file-system",
      "crochet.wrapper.node.http",
      "crochet.wrapper.node.io",
      "crochet.wrapper.node.os",
      "crochet.wrapper.node.shell",
    ]);
  }

  async boot(root: string, target: Package.Target) {
    const pkg = await this.get_package(root);
    const graph = await Package.build_package_graph(
      pkg,
      target,
      this.trusted,
      this.resolver
    );
    const capabilities = this.safe_mode
      ? new Set([])
      : await this.signal.request_capabilities(graph, pkg);
    const root_pkg = graph.get_package(root);
    graph.check(root_pkg, capabilities, this.safe_mode);
    if (!this.safe_mode) {
      graph.commit_capabilities(root_pkg, capabilities);
    }

    const vm = new BootedCrochet(this, graph);
    await this.signal.booted(vm);
    return vm;
  }

  trust(pkg: Package.Package) {
    this.trusted.add(pkg);
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

  readonly resolver: Package.IPackageResolution = {
    get_package: async (name: string) => {
      return this.get_package(name);
    },
  };

  private async get_package(name: string) {
    const pkg = this.registered_packages.get(name);
    if (pkg == null) {
      const scope = this.fs.get_scope(name);
      const pkg = Package.parse_from_string(
        await scope.read_text("crochet.json"),
        name
      );
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
    this.universe = VM.make_universe(crochet.tokens.universe);
  }

  async initialise(root: string, safe_mode: boolean) {
    if (this.initialised) {
      throw new Error(`initialise() called twice!`);
    }

    this.initialised = true;
    const pkg = this.graph.get_package(root);
    for (const x of this.graph.serialise(pkg)) {
      await this.load_package(x);
    }
    for (const x of this.graph.serialise(pkg)) {
      this.reify_capability_grants(x);
    }
    VM.Commands.resolve_dispatch(this.universe);

    if (!safe_mode) {
      await VM.run_prelude(this.universe);
    }
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
    const cpkg = VM.World.get_or_make_package(this.universe, pkg);

    if (!this.crochet.safe_mode) {
      for (const x of pkg.native_sources) {
        await this.load_native(x, pkg, cpkg);
      }
    }

    for (const x of pkg.sources) {
      await this.load_source(x, pkg, cpkg);
    }

    VM.Types.verify_package_types(cpkg);
    VM.Types.verify_package_traits(cpkg);
    VM.Capability.verify_package_capabilities(cpkg);
  }

  private reify_capability_grants(pkg: Package.ResolvedPackage) {
    const intrinsics = new Set(["native"]);
    const cpkg = this.universe.world.packages.get(pkg.name);
    if (cpkg == null) {
      throw new Error(`The package ${pkg.name} is not loaded.`);
    }

    cpkg.set_token(
      this.crochet.tokens.packages.get(cpkg.name) || random_uuid()
    );

    for (const x of pkg.granted_capabilities) {
      if (intrinsics.has(x)) {
        continue;
      }

      const capability = this.universe.world.capabilities.try_lookup(x);
      if (capability == null) {
        throw new ErrArbitrary(
          "invalid-capability",
          `Could not load package ${pkg.name}. It requires a capability ${x} that either does not exist or has not been loaded yet.`
        );
      }
      cpkg.granted_capabilities.add(capability);
    }
    if (this.graph.trusted.has(pkg.pkg)) {
      this.universe.trusted_base.add(cpkg);
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
    const scope = this.crochet.fs.get_scope(pkg.name);
    const module = await scope.read_native_module(x.relative_filename);
    const ffi = new ForeignInterface(
      this,
      this.universe,
      cpkg,
      x.relative_filename
    );
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

    const scope = await this.crochet.fs.get_scope(pkg.name);
    const buffer = await scope.read(x.relative_binary_image);
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

  async run_tests(
    run_id: string,
    filter: (_: VM.CrochetTest) => boolean,
    verbose: boolean = false
  ) {
    const tests = VM.Tests.grouped_tests(this.universe);
    await this.crochet.signal.report_test(new TRM_Started(run_id));
    for (const [group, modules] of tests) {
      for (const [module, tests] of modules) {
        for (const test of tests) {
          const test_id = random_uuid();
          await this.crochet.signal.report_test(
            new TRM_Test_Started(run_id, test_id, group, module, test.title)
          );
          if (!filter(test)) {
            await this.crochet.signal.report_test(
              new TRM_Test_Skipped(run_id, test_id)
            );
            continue;
          }

          try {
            await VM.run_test(this.universe, test);
            await this.crochet.signal.report_test(
              new TRM_Test_Passed(run_id, test_id)
            );
          } catch (error: any) {
            await this.crochet.signal.report_test(
              new TRM_Test_Failed(run_id, test_id, error.stack ?? error)
            );
          }
        }
      }
    }
    await this.crochet.signal.report_test(new TRM_Finished(run_id));
  }

  async load_declaration(x: IR.Declaration, module: VM.CrochetModule) {
    VM.load_declaration(this.universe, module, x, null);
  }

  async run_block(x: IR.BasicBlock, env: VM.Environment) {
    const block = new IR.BasicBlock([...x.ops, new IR.Return(0)]);
    return await VM.run_block(this.universe, env, block);
  }

  async invoke(name: string, args: CrochetValue[]) {
    return await VM.run_command(this.universe, name, args);
  }

  async debug_perspectives(value: CrochetValue) {
    return debug_perspectives(this.universe, value);
  }

  async debug_representations(
    value: CrochetValue,
    perspectives: CrochetType[]
  ) {
    return debug_representations(this.universe, value, perspectives);
  }

  async readme(pkg0: Package.Package) {
    try {
      const pkg = this.graph.get_package(pkg0.meta.name);
      const scope = this.crochet.fs.get_scope(pkg.name);
      return await scope.read_text(pkg.readme.relative_filename);
    } catch (e) {
      return "(no welcome documentation)";
    }
  }
}
