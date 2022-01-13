import * as Package from "../../pkg";
import {
  BootedCrochet,
  Crochet,
  ForeignInterface,
  IFileSystem,
  ISignal,
  TestReportMessage,
  TRM_Finished,
  TRM_Started,
  TRM_Test_Failed,
  TRM_Test_Passed,
  TRM_Test_Skipped,
  TRM_Test_Started,
} from "../../crochet";
import { CrochetValue, CrochetTest } from "../../vm";
import { EventStream } from "../../utils/event";
import { defer } from "../../utils/utils";

export class CrochetForBrowser {
  readonly crochet: Crochet;
  private _booted_system: BootedCrochet | null = null;
  private _root: Package.Package | null = null;
  private _ffi: ForeignInterface | null = null;
  readonly test_report = new EventStream<TestReportMessage>();

  constructor(
    readonly library_base: string,
    readonly capabilities: Set<Package.Capability>,
    readonly interactive: boolean
  ) {
    this.crochet = new Crochet(false, this.fs, this.signal);
  }

  get trusted_core() {
    // TODO: restrict TCB (needs safer native modules support)
    return new Set([
      "crochet.codec.basic",
      "crochet.concurrency",
      "crochet.core",
      "crochet.debug",
      "crochet.debug.tracing",
      "crochet.language.cli-arguments",
      "crochet.language.csv",
      "crochet.language.json",
      "crochet.mathematics",
      "crochet.novella",
      "crochet.parsing.combinators",
      "crochet.random",
      "crochet.text.parsing.lingua",
      "crochet.text.regex",
      "crochet.time",
      "crochet.wrapper.node.file-system",
      "crochet.wrapper.node.http",
      "crochet.wrapper.node.io",
      "crochet.wrapper.node.os",
      "crochet.wrapper.node.shell",
    ]);
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

  get ffi() {
    if (this._ffi == null) {
      throw new Error(`Crochet not yet booted`);
    }

    return this._ffi;
  }

  async boot_from_file(filename: string, target: Package.Target) {
    const source = await this.fs.read_file(filename);
    const pkg = Package.parse_from_string(source, filename);
    return this.boot(pkg, target);
  }

  async boot(entry: Package.Package, target: Package.Target) {
    if (this._booted_system != null) {
      throw new Error(`Crochet already booted.`);
    }

    const root = await this.crochet.register_package(entry);
    const booted = await this.crochet.boot(root.meta.name, target);
    await booted.initialise(root.meta.name, false);
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

  async run_tests(run_id: string, filter: (_: CrochetTest) => boolean) {
    const result = defer<{
      failed: number;
      passed: number;
      skipped: number;
      total: number;
      started: number;
      finished: number;
    }>();
    let failed = 0;
    let skipped = 0;
    let passed = 0;
    let total = 0;
    let started: number = new Date().getTime();
    const handler = this.test_report.subscribe((message) => {
      if (message.id !== run_id) {
        return;
      }

      if (message instanceof TRM_Started) {
        started = new Date().getTime();
      } else if (message instanceof TRM_Finished) {
        this.test_report.unsubscribe(handler);
        result.resolve({
          failed,
          skipped,
          passed,
          total,
          started: started,
          finished: new Date().getTime(),
        });
      } else if (message instanceof TRM_Test_Started) {
        total += 1;
      } else if (message instanceof TRM_Test_Passed) {
        passed += 1;
      } else if (message instanceof TRM_Test_Failed) {
        failed += 1;
      } else if (message instanceof TRM_Test_Skipped) {
        skipped += 1;
      }
    });
    this.system.run_tests(run_id, filter);
    return result.promise;
  }

  private package_url(name: string) {
    return `${this.library_base}/${name}/crochet.json`;
  }

  private is_trusted(pkg: Package.Package) {
    return this.trusted_core.has(pkg.meta.name);
  }

  fs: IFileSystem = {
    read_package: async (name: string) => {
      const filename = this.package_url(name);
      const response = await fetch(filename);
      const data = await response.json();
      const pkg = Package.parse(data, filename);
      if (this.is_trusted(pkg)) {
        this.crochet.trust(pkg);
      }
      return pkg;
    },

    read_file: async (file: string) => {
      const response = await fetch(file);
      return await response.text();
    },

    read_binary: async (
      file: Package.ResolvedFile,
      pkg: Package.ResolvedPackage
    ) => {
      const response = await fetch(file.binary_image);
      const data = await response.arrayBuffer();
      const buffer = Buffer.from(data);
      return buffer;
    },

    read_native_module: async (
      file: Package.ResolvedFile,
      pkg: Package.ResolvedPackage
    ) => {
      const response = await fetch(file.absolute_filename);
      const source = await response.text();
      const exports = Object.create(null);
      const fn = new Function("exports", source);
      fn(exports);

      if (typeof exports.default === "function") {
        return exports.default;
      } else {
        throw new Error(
          [
            `Native module ${file.relative_filename} in ${pkg.name} `,
            `does not expose a function in 'exports.default'.`,
          ].join("")
        );
      }
    },
  };

  signal: ISignal = {
    request_capabilities: async (
      graph: Package.PackageGraph,
      root: Package.Package
    ) => {
      // TODO: implement capability granting
      return this.capabilities;
    },

    booted: async () => {},

    report_test: async (message) => {
      this.test_report.publish(message);
    },
  };
}
