import { randomUUID } from "crypto";
import { contextBridge, ipcRenderer } from "electron";
import * as REPL from "../node-repl";
import * as Pkg from "../pkg";
import * as Spec from "../utils/spec";
import { NativeFSMapper } from "../scoped-fs/backend/native-mapper";
import { ScopedFS } from "../scoped-fs/api";

let repl: REPL.NodeRepl | null = null;

export interface Playground {
  initialise(id: string, bare: boolean): Promise<void>;
  make_page(session_id: string): Promise<string>;
  run_code(
    session_id: string,
    page_id: string,
    language: string,
    code: string
  ): Promise<REPL.Representation[] | undefined>;
  readme(session_id: string): Promise<string>;
  update_root_readme(session_id: string, code: string): Promise<void>;
  update_readme(session_id: string, pkg: string, code: string): Promise<void>;
}

declare var Playground: Playground;

function assert_repl(
  repl: REPL.NodeRepl | null,
  session_id: string
): asserts repl is REPL.NodeRepl {
  if (repl == null || session_id != repl.session) {
    throw new Error(`REPL not initialised.`);
  }
}

const configp = ipcRenderer.invoke("playground:get-config");

contextBridge.exposeInMainWorld("Playground", <Playground>{
  async initialise(id: string, bare: boolean) {
    if (repl == null) {
      const config = await configp;
      repl = await REPL.NodeRepl.bootstrap(
        config.root,
        Spec.parse(config.target, Pkg.target_spec),
        new Set(config.capabilities),
        randomUUID(),
        id,
        new Map(config.package_tokens),
        bare
      );
    } else {
      throw new Error(`Playground is already initialised.`);
    }
  },

  async make_page(session_id: string) {
    assert_repl(repl, session_id);
    const page = await repl.make_page();
    return page.id;
  },

  async run_code(
    session_id: string,
    page_id: string,
    language: string,
    code: string
  ) {
    assert_repl(repl, session_id);
    const page = repl.get_page(page_id);
    const result = await page.run_code(language, code);
    return result?.representations;
  },

  async readme(session_id: string) {
    assert_repl(repl, session_id);
    const root_pkg = repl.vm.system.graph.root;
    const result = await repl.vm.system.readme(root_pkg.pkg);
    return result;
  },

  async update_root_readme(session_id: string, code: string) {
    assert_repl(repl, session_id);
    const root_pkg = repl.vm.system.graph.root;
    await get_native_fs(repl.vm.fs.get_scope(root_pkg.name)).write_text(
      root_pkg.readme.relative_filename,
      code
    );
  },
});

function get_native_fs(scope: ScopedFS) {
  if (scope.backend instanceof NativeFSMapper) {
    return scope.backend;
  } else {
    throw new Error(
      `Scope ${scope.name} is not backed by a writable filesystem.`
    );
  }
}
