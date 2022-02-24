import { randomUUID } from "crypto";
import { contextBridge, ipcRenderer } from "electron";
import * as REPL from "../node-repl";
import * as Pkg from "../pkg";
import * as Spec from "../utils/spec";

let repl: REPL.NodeRepl | null = null;

export interface Playground {
  initialise(id: string): Promise<void>;
  make_page(session_id: string): Promise<string>;
  run_code(
    session_id: string,
    page_id: string,
    language: string,
    code: string
  ): Promise<REPL.Representation[] | undefined>;
}

declare var Playground: Playground;

contextBridge.exposeInMainWorld("Playground", <Playground>{
  async initialise(id: string) {
    if (repl == null) {
      const config = await ipcRenderer.invoke("playground:get-config");
      repl = await REPL.NodeRepl.bootstrap(
        config.root,
        Spec.parse(config.target, Pkg.target_spec),
        new Set(config.capabilities),
        randomUUID(),
        id,
        new Map(config.package_tokens)
      );
    } else {
      throw new Error(`Playground is already initialised.`);
    }
  },

  async make_page(session_id: string) {
    if (repl == null || session_id != repl.session) {
      throw new Error(`Cannot create a new playground page.`);
    }

    const page = await repl.make_page();
    return page.id;
  },

  async run_code(
    session_id: string,
    page_id: string,
    language: string,
    code: string
  ) {
    if (repl == null || session_id != repl.session) {
      throw new Error(`Cannot run code in the page`);
    }

    const page = repl.get_page(page_id);
    const result = await page.run_code(language, code);
    return result?.representations;
  },
});
