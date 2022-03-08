import { randomUUID } from "crypto";
import { contextBridge, ipcRenderer } from "electron";
import * as REPL from "../node-repl";
import * as Pkg from "../pkg";
import * as Spec from "../utils/spec";
import * as Path from "path";
import * as FS from "fs";
import * as OS from "os";

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
    const tmp_path = make_tmp_path();
    FS.writeFileSync(tmp_path, code);
    FS.renameSync(tmp_path, Path.resolve(root_pkg.readme.absolute_filename));
  },
});

function make_tmp_path(retries = 10): string {
  if (retries <= 0) {
    throw new Error(`internal: failed to create temporary file`);
  }

  const path = Path.join(OS.tmpdir(), randomUUID());
  if (!FS.existsSync(path)) {
    return path;
  } else {
    return make_tmp_path(retries - 1);
  }
}
