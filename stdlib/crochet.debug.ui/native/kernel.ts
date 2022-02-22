import type { ForeignInterface } from "../../../build/crochet";
import type { CrochetValue } from "../../../build/vm";
import type {
  CrochetForBrowser,
  Package,
  IR,
  Binary,
  VM,
  Compiler,
  AST,
  REPL,
} from "../../../build/targets/browser";

declare var Crochet: {
  CrochetForBrowser: typeof CrochetForBrowser;
  Package: typeof Package;
  IR: typeof IR;
  Binary: typeof Binary;
  VM: typeof VM;
  Compiler: typeof Compiler;
  AST: typeof AST;
  REPL: typeof REPL;
};
declare var crypto: { randomUUID(): string };

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

    async run_code(language: string, code: string) {
      const result = await (
        await fetch(
          `/playground/api/${encodeURIComponent(
            this.session_id
          )}/pages/${encodeURIComponent(this.page_id)}/run-code`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              language,
              code,
            }),
          }
        )
      ).json();

      if (!result.ok) {
        return result;
      } else if (Array.isArray(result.representations)) {
        return {
          ok: true,
          value: ffi.record(
            new Map([
              ["raw-value", ffi.nothing],
              [
                "representations",
                ffi.list(
                  result.representations.map((x: any) =>
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
        return { ok: true, value: ffi.nothing };
      }
    }
  }

  abstract class BaseVM {
    abstract make_page(kernel: BaseKernel): Promise<BasePage>;
  }

  class KernelVM extends BaseVM {
    constructor(readonly id: string, readonly vm: CrochetForBrowser) {
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
  }

  class FarKernelVM extends BaseVM {
    constructor(readonly session_id: string, readonly id: string) {
      super();
    }

    async make_page(kernel: BaseKernel) {
      const result = await (
        await fetch(
          `/playground/api/${encodeURIComponent(this.session_id)}/make-page`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          }
        )
      ).json();

      if (!result.ok) {
        throw new Error(result.reason);
      }

      const page = new FarKernelPage(this.session_id, result.page_id);
      kernel.add_page(page.page_id, page);
      return page;
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

      const crochet = new Crochet.CrochetForBrowser(
        {
          universe: universe,
          packages: this.package_tokens,
        },
        this.library_root,
        new Set(this.capabilities),
        false
      );

      const result = await crochet
        .boot_from_file(this.app_root, Crochet.Package.target_web())
        .then(
          (_) => true,
          (e) => String(e)
        );

      if (result !== true) {
        return { ok: false, reason: result as string };
      }

      const vm = new KernelVM(session, crochet);
      this.add_vm(session, vm);

      return { ok: true, value: vm };
    }
  }

  class FarKernel extends BaseKernel {
    async make_vm(): Promise<
      { ok: true; value: BaseVM } | { ok: false; reason: string }
    > {
      const id = crypto.randomUUID();
      const vm = new FarKernelVM(this.session_id, id);
      this.add_vm(id, vm);
      return { ok: true, value: vm };
    }
  }

  ffi.defun(
    "kernel.make-kernel",
    (
      kind0,
      session_id0,
      library_root0,
      capabilities0,
      package_tokens0,
      app_root0
    ) => {
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

    const result: RunResult = ffi.unbox(
      yield ffi.await(
        page
          .run_code(language, ffi.text_to_string(code0))
          .then((x) => ffi.box(x))
      )
    ) as any;

    if (result.ok) {
      return ffi.record(
        new Map([
          ["ok", ffi.boolean(true)],
          ["value", result.value],
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
};