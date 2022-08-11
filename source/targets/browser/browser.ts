import * as Package from "../../pkg";
import {
  BootedCrochet,
  Crochet,
  ForeignInterface,
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
import { random_uuid } from "../../utils/uuid";
import { AggregatedFS } from "../../scoped-fs/aggregated-fs";

export class CrochetForBrowser {
  readonly crochet: Crochet;
  private _booted_system: BootedCrochet | null = null;
  private _root: Package.Package | null = null;
  private _ffi: ForeignInterface | null = null;
  readonly test_report = new EventStream<TestReportMessage>();

  constructor(
    token: { universe: string; packages: Map<string, string> },
    readonly fs: AggregatedFS,
    readonly capabilities: Set<Package.Capability>,
    readonly interactive: boolean
  ) {
    this.crochet = new Crochet(token, false, this.fs, this.signal);
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

  async boot_from_package(name: string, target: Package.Target) {
    const pkg = await this.fs.get_scope(name).read_package("crochet.json");
    return this.boot(pkg, target);
  }

  async boot(entry: Package.Package, target: Package.Target) {
    if (this._booted_system != null) {
      throw new Error(`Crochet already booted.`);
    }

    await this.register_libraries();
    const booted = await this.crochet.boot(entry.meta.name, target);
    await booted.initialise(entry.meta.name, false);
    this._root = entry;
    this._booted_system = booted;
    this._ffi = new ForeignInterface(
      this.system,
      this.system.universe,
      this.system.universe.world.packages.get(this.root.meta.name)!,
      this.root.filename
    );
  }

  private async register_libraries() {
    for (const x of this.crochet.fs.all_scopes()) {
      const pkg = await x.scope.read_package("crochet.json");
      this.crochet.register_package(pkg);
      if (x.scope.is_trusted && this.crochet.trusted_core.has(pkg.meta.name)) {
        this.crochet.trust(pkg);
      }
    }
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

function throw_if_not_200(response: Response, name: string) {
  if (response.status === 404) {
    throw new Error(`internal: resource not found: ${name}`);
  } else if (response.status >= 400) {
    throw new Error(`internal: failed to load resource: ${name}`);
  }
}
