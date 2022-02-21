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
} from "../../../build/targets/browser";

declare var Crochet: {
  CrochetForBrowser: typeof CrochetForBrowser;
  Package: typeof Package;
  IR: typeof IR;
  Binary: typeof Binary;
  VM: typeof VM;
  Compiler: typeof Compiler;
  AST: typeof AST;
};
declare var crypto: { randomUUID(): string };

export default (ffi: ForeignInterface) => {
  type Meta = Map<number, IR.Interval>;

  abstract class ReplExpr {
    abstract evaluate(
      page: KernelPage
    ): Promise<
      { ok: true; value: CrochetValue } | { ok: false; error: unknown }
    >;
  }

  class ReplDeclaration extends ReplExpr {
    constructor(
      readonly declarations: IR.Declaration[],
      readonly source: string,
      readonly meta: Meta
    ) {
      super();
    }

    async evaluate(
      page: KernelPage
    ): Promise<
      { ok: true; value: CrochetValue } | { ok: false; error: unknown }
    > {
      try {
        for (const x of this.declarations) {
          await page.vm.system.load_declaration(x, page.module);
        }
        return { ok: true, value: ffi.nothing };
      } catch (e) {
        return { ok: false, error: e };
      }
    }
  }

  class ReplStatements extends ReplExpr {
    constructor(
      readonly block: IR.BasicBlock,
      readonly source: string,
      readonly meta: Meta
    ) {
      super();
    }

    async evaluate(
      page: KernelPage
    ): Promise<
      { ok: true; value: CrochetValue } | { ok: false; error: unknown }
    > {
      const new_env = Crochet.VM.Environments.clone(page.env);
      try {
        const value = await page.vm.system.run_block(this.block, new_env);
        for (const [k, v] of new_env.bindings.entries()) {
          if (!/\$/.test(k)) {
            page.env.define(k, v);
          }
        }
        return { ok: true, value };
      } catch (e) {
        return { ok: false, error: e };
      }
    }
  }

  function lower(x: AST.REPL, source: string) {
    return x.match<ReplExpr>({
      Declarations: (xs) => {
        const { declarations, meta } = Crochet.Compiler.lower_declarations(
          source,
          xs
        );
        return new ReplDeclaration(declarations, source, meta);
      },

      Statements: (xs) => {
        const { block, meta } = Crochet.Compiler.lower_statements(source, xs);
        return new ReplStatements(block, source, meta);
      },

      Command: (command) => {
        throw new Error(`internal: Unsupported`);
      },
    });
  }

  function compile(source: string) {
    const ast = Crochet.Compiler.parse_repl(source, "(playground)");
    return lower(ast, source);
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

    yield ffi.await(
      crochet
        .boot_from_file(kernel.app_root, Crochet.Package.target_web())
        .then((_) => ffi.nothing)
    );

    const vm = new KernelVM(session, crochet);
    kernel.add_vm(session, vm);

    return ffi.box(vm);
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
    let expr: ReplExpr;
    try {
      expr = compile(code);
    } catch (error) {
      return ffi.record(
        new Map([
          ["ok", ffi.boolean(false)],
          ["reason", ffi.text(String(error))],
        ])
      );
    }

    const value:
      | { ok: true; value: CrochetValue }
      | { ok: false; error: unknown } = ffi.unbox(
      yield ffi.await(expr.evaluate(page).then((x) => ffi.box(x)))
    ) as any;
    if (value.ok) {
      return ffi.record(
        new Map([
          ["ok", ffi.boolean(true)],
          ["value", ffi.box(value.value)],
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
