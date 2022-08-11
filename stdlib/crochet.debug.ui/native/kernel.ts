import type { ForeignInterface } from "../../../build/crochet";
import type { CrochetValue } from "../../../build/vm";
import {
  CrochetForBrowser,
  BrowserFS,
  Package,
  IR,
  Binary,
  VM,
  Compiler,
  AST,
  REPL,
} from "../../../build/targets/browser";
import type * as PlaygroundKernel from "../../../build/node-cli/playground-kernel";

declare var Crochet: {
  CrochetForBrowser: typeof CrochetForBrowser;
  BrowserFS: typeof BrowserFS;
  Package: typeof Package;
  IR: typeof IR;
  Binary: typeof Binary;
  VM: typeof VM;
  Compiler: typeof Compiler;
  AST: typeof AST;
  REPL: typeof REPL;
};
declare var crypto: { randomUUID(): string };
declare var Playground: PlaygroundKernel.Playground;

export default (ffi: ForeignInterface) => {
  type RunResult =
    | { ok: true; value: CrochetValue }
    | { ok: false; error: unknown };

  async function run(page: KernelPage, code: string) {
    try {
      const expr = Crochet.REPL.compile(code);
      const result = await expr.evaluate(page.vm.system, page.module, page.env);
      if (result == null) {
        return { ok: true, value: ffi.nothing };
      } else {
        return {
          ok: true,
          value: ffi.record(
            new Map([
              ["raw-value", ffi.box(result.value)],
              [
                "representations",
                ffi.list(
                  result.representations.map((x) =>
                    ffi.record(
                      new Map([
                        ["name", ffi.text(x.name)],
                        ["document", ffi.text(x.document)],
                      ])
                    )
                  )
                ),
              ],
            ])
          ),
        };
      }
    } catch (e) {
      return { ok: false, error: e };
    }
  }

  abstract class BasePage {
    abstract run_code(language: string, code: string): Promise<RunResult>;
  }

  class KernelPage extends BasePage {
    constructor(
      readonly id: string,
      readonly vm: CrochetForBrowser,
      readonly pkg: VM.CrochetPackage,
      readonly module: VM.CrochetModule,
      readonly env: VM.Environment
    ) {
      super();
    }

    async run_code(language: string, code: string) {
      if (language !== "crochet") {
        throw new Error(`Language ${language} is currently unsupported`);
      }

      return (await run(this, code)) as RunResult;
    }
  }

  class FarKernelPage extends BasePage {
    constructor(readonly session_id: string, readonly page_id: string) {
      super();
    }

    async run_code(language: string, code: string): Promise<RunResult> {
      try {
        const result = await Playground.run_code(
          this.session_id,
          this.page_id,
          language,
          code
        );
        if (result == null) {
          return { ok: true, value: ffi.nothing };
        } else if (Array.isArray(result)) {
          return {
            ok: true,
            value: ffi.record(
              new Map([
                ["raw-value", ffi.nothing],
                [
                  "representations",
                  ffi.list(
                    result.map((x: any) =>
                      ffi.record(
                        new Map([
                          ["name", ffi.text(x.name)],
                          ["document", ffi.text(x.document)],
                        ])
                      )
                    )
                  ),
                ],
              ])
            ),
          };
        } else {
          console.error("Unexpected value", result);
          return { ok: false, error: `Unexpected value` };
        }
      } catch (e) {
        return { ok: false, error: String(e) };
      }
    }
  }

  abstract class BaseVM {
    abstract make_page(kernel: BaseKernel): Promise<BasePage>;
    abstract readme(): Promise<string>;
    abstract update_root_readme(code: string): Promise<void>;
  }

  class KernelVM extends BaseVM {
    constructor(
      readonly kernel: BaseKernel,
      readonly id: string,
      readonly vm: CrochetForBrowser
    ) {
      super();
    }

    async make_page(kernel: BaseKernel) {
      const root_pkg = this.vm.root;
      const root_cpkg = this.vm.system.universe.world.packages.get(
        root_pkg.meta.name
      );
      if (root_cpkg == null) {
        throw new Error(`internal: root package not found`);
      }
      const module = new Crochet.VM.CrochetModule(
        root_cpkg,
        "(playground)",
        null
      );
      const env = new Crochet.VM.Environment(null, null, module, null);

      const id = crypto.randomUUID();
      const page = new KernelPage(id, this.vm, root_cpkg, module, env);
      kernel.add_page(this.id, page);

      return page;
    }

    async readme() {
      const root_pkg = this.vm.system.graph.root;
      return await this.vm.system.readme(root_pkg.pkg);
    }

    async update_root_readme(code: string) {
      await Playground.update_root_readme(this.kernel.session_id, code);
    }
  }

  class FarKernelVM extends BaseVM {
    constructor(readonly session_id: string, readonly id: string) {
      super();
    }

    async make_page(kernel: BaseKernel) {
      const id = await Playground.make_page(this.session_id);
      const page = new FarKernelPage(this.session_id, id);
      kernel.add_page(page.page_id, page);
      return page;
    }

    async readme() {
      return await Playground.readme(this.session_id);
    }

    async update_root_readme(code: string): Promise<void> {
      await Playground.update_root_readme(this.session_id, code);
    }
  }

  abstract class BaseKernel {
    private vms: Map<string, BaseVM> = new Map();
    private pages: Map<string, BasePage> = new Map();

    constructor(
      readonly session_id: string,
      readonly library_root: string,
      readonly capabilities: string[],
      readonly package_tokens: Map<string, string>,
      readonly app_root: string
    ) {}

    get_vm(id: string) {
      const vm = this.vms.get(id);
      if (vm == null) {
        throw new Error(`Undefined VM id: ${id}`);
      }
      return vm;
    }

    add_vm(id: string, vm: BaseVM) {
      if (this.vms.has(id)) {
        throw new Error(`Duplicated VM id: ${id}`);
      }
      this.vms.set(id, vm);
    }

    add_page(id: string, page: BasePage) {
      if (this.pages.has(id)) {
        throw new Error(`Duplicated kernel page: ${id}`);
      }
      this.pages.set(id, page);
    }

    get_page(id: string) {
      const page = this.pages.get(id);
      if (page == null) {
        throw new Error(`Undefined kernel page: ${id}`);
      }
      return page;
    }

    abstract make_vm(): Promise<
      { ok: true; value: BaseVM } | { ok: false; reason: string }
    >;
  }

  class BrowserKernel extends BaseKernel {
    async make_vm(): Promise<
      { ok: true; value: BaseVM } | { ok: false; reason: string }
    > {
      const universe = crypto.randomUUID();
      const session = crypto.randomUUID();

      // FIXME: load the correct files
      await Playground.initialise(this.session_id, true);
      const crochet = new Crochet.CrochetForBrowser(
        {
          universe: universe,
          packages: this.package_tokens,
        },
        await new BrowserFS(),
        new Set(this.capabilities),
        false
      );

      const result = await crochet
        .boot_from_package(this.app_root, Crochet.Package.target_web())
        .then(
          (_) => true,
          (e) => String(e)
        );

      if (result !== true) {
        return { ok: false, reason: result as string };
      }

      const vm = new KernelVM(this, session, crochet);
      this.add_vm(session, vm);

      return { ok: true, value: vm };
    }
  }

  class FarKernel extends BaseKernel {
    async make_vm(): Promise<
      { ok: true; value: BaseVM } | { ok: false; reason: string }
    > {
      const id = crypto.randomUUID();
      await Playground.initialise(this.session_id, false);
      const vm = new FarKernelVM(this.session_id, id);
      this.add_vm(id, vm);
      return { ok: true, value: vm };
    }
  }

  ffi.defmachine(
    "kernel.make-kernel",
    function* (
      kind0,
      session_id0,
      library_root0,
      capabilities0,
      package_tokens0,
      app_root0
    ) {
      const kind = ffi.text_to_string(kind0);
      const session_id = ffi.text_to_string(session_id0);
      const library_root = ffi.text_to_string(library_root0);
      const capabilities = ffi
        .list_to_array(capabilities0)
        .map((x) => ffi.text_to_string(x));
      const package_tokens = new Map(
        ffi.list_to_array(package_tokens0).map((x) => {
          const [k, v] = ffi.list_to_array(x);
          return [ffi.text_to_string(k), ffi.text_to_string(v)];
        })
      );
      const app_root = ffi.text_to_string(app_root0);

      switch (kind) {
        case "node":
          return ffi.box(
            new FarKernel(
              session_id,
              library_root,
              capabilities,
              package_tokens,
              app_root
            )
          );

        case "browser":
          return ffi.box(
            new BrowserKernel(
              session_id,
              library_root,
              capabilities,
              package_tokens,
              app_root
            )
          );

        default:
          throw new Error(`internal: Unknown kind ${kind}`);
      }
    }
  );

  ffi.defmachine("kernel.make-vm", function* (kernel0) {
    const kernel = ffi.unbox_typed(BaseKernel, kernel0);
    const result = ffi.unbox(
      yield ffi.await(kernel.make_vm().then((x) => ffi.box(x)))
    ) as any;

    if (result.ok) {
      return ffi.record(
        new Map([
          ["ok", ffi.boolean(true)],
          ["value", ffi.box(result.value)],
        ])
      );
    } else {
      return ffi.record(
        new Map([
          ["ok", ffi.boolean(false)],
          ["reason", ffi.text(String(result.reason))],
        ])
      );
    }
  });

  ffi.defmachine("kernel.make-page", function* (kernel0, vm0) {
    const kernel = ffi.unbox_typed(BaseKernel, kernel0);
    const vm = ffi.unbox_typed(BaseVM, vm0);
    const page = yield ffi.await(vm.make_page(kernel).then((x) => ffi.box(x)));
    return ffi.box(page);
  });

  ffi.defmachine("kernel.run-code", function* (page0, language0, code0) {
    const page = ffi.unbox_typed(BasePage, page0);
    const language = ffi.text_to_string(language0);

    // we only care about *long-running* processes, and we use performance.now
    // for the monotonicity, but we don't need something more accurate than
    // milliseconds-range.
    const start = Math.round(performance.now());
    const result: RunResult = ffi.unbox(
      yield ffi.await(
        page
          .run_code(language, ffi.text_to_string(code0))
          .then((x) => ffi.box(x))
      )
    ) as any;
    const end = Math.round(performance.now());
    const elapsed = BigInt(end - start);

    if (result.ok) {
      return ffi.record(
        new Map([
          ["ok", ffi.boolean(true)],
          ["value", result.value],
          ["duration", ffi.integer(elapsed)],
        ])
      );
    } else {
      return ffi.record(
        new Map([
          ["ok", ffi.boolean(false)],
          ["reason", ffi.text(String(result.error))],
        ])
      );
    }
  });

  ffi.defmachine("kernel.readme", function* (vm0) {
    const vm = ffi.unbox_typed(BaseVM, vm0);
    const text = yield ffi.await(vm.readme().then((x) => ffi.text(x)));
    return text;
  });

  ffi.defmachine("kernel.update-root-readme", function* (vm0, code) {
    const vm = ffi.unbox_typed(BaseVM, vm0);
    try {
      yield ffi.await(
        vm.update_root_readme(ffi.text_to_string(code)).then((_) => ffi.nothing)
      );
      return ffi.record(new Map([["ok", ffi.boolean(true)]]));
    } catch (e) {
      return ffi.record(
        new Map([
          ["ok", ffi.boolean(false)],
          ["reason", ffi.text(String(e))],
        ])
      );
    }
  });
};
