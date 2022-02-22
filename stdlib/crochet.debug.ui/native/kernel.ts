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
    const expr = Crochet.REPL.compile(code);
    try {
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

  class KernelPage {
    constructor(
      readonly id: string,
      readonly vm: CrochetForBrowser,
      readonly pkg: VM.CrochetPackage,
      readonly module: VM.CrochetModule,
      readonly env: VM.Environment
    ) {}
  }

  class KernelVM {
    constructor(readonly id: string, readonly vm: CrochetForBrowser) {}
  }

  class Kernel {
    private vms: Map<string, KernelVM> = new Map();
    private pages: Map<string, KernelPage> = new Map();

    constructor(
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

    add_vm(id: string, vm: KernelVM) {
      if (this.vms.has(id)) {
        throw new Error(`Duplicated VM id: ${id}`);
      }
      this.vms.set(id, vm);
    }

    add_page(id: string, page: KernelPage) {
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
  }

  ffi.defun(
    "kernel.make-kernel",
    (library_root0, capabilities0, package_tokens0, app_root0) => {
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
      return ffi.box(
        new Kernel(library_root, capabilities, package_tokens, app_root)
      );
    }
  );

  ffi.defmachine("kernel.make-vm", function* (kernel0) {
    const kernel = ffi.unbox_typed(Kernel, kernel0);

    const universe = crypto.randomUUID();
    const session = crypto.randomUUID();

    const crochet = new Crochet.CrochetForBrowser(
      {
        universe: universe,
        packages: kernel.package_tokens,
      },
      kernel.library_root,
      new Set(kernel.capabilities),
      false
    );

    const result = ffi.unbox(
      yield ffi.await(
        crochet
          .boot_from_file(kernel.app_root, Crochet.Package.target_web())
          .then(
            (_) => ffi.box(true),
            (e) => ffi.box(String(e))
          )
      )
    );

    if (result !== true) {
      return ffi.record(
        new Map([
          ["ok", ffi.boolean(false)],
          ["reason", ffi.text(result as any)],
        ])
      );
    }

    const vm = new KernelVM(session, crochet);
    kernel.add_vm(session, vm);

    return ffi.record(
      new Map([
        ["ok", ffi.boolean(true)],
        ["value", ffi.box(vm)],
      ])
    );
  });

  ffi.defun("kernel.make-page", (kernel0, vm0) => {
    const kernel = ffi.unbox_typed(Kernel, kernel0);
    const vm = ffi.unbox_typed(KernelVM, vm0).vm;

    const root_pkg = vm.root;
    const root_cpkg = vm.system.universe.world.packages.get(root_pkg.meta.name);
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
    const page = new KernelPage(id, vm, root_cpkg, module, env);

    kernel.add_page(id, page);
    return ffi.box(page);
  });

  ffi.defmachine("kernel.run-code", function* (page0, language0, code0) {
    const page = ffi.unbox_typed(KernelPage, page0);
    const language = ffi.text_to_string(language0);
    if (language !== "crochet") {
      throw new Error(`Language ${language} is currently unsupported`);
    }

    const code = ffi.text_to_string(code0);

    const value: RunResult = ffi.unbox(
      yield ffi.await(run(page, code).then((x) => ffi.box(x)))
    ) as any;

    if (value.ok) {
      return ffi.record(
        new Map([
          ["ok", ffi.boolean(true)],
          ["value", value.value],
        ])
      );
    } else {
      return ffi.record(
        new Map([
          ["ok", ffi.boolean(false)],
          ["reason", ffi.text(String(value.error))],
        ])
      );
    }
  });
};
