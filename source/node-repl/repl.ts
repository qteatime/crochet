const pkg_meta = require("../../package.json");
import * as Path from "path";
import * as Read from "readline";
import * as Compiler from "./compiler";
import * as VM from "../vm";
import * as Pkg from "../pkg";
import { CrochetForNode } from "../targets/node";
import { logger } from "../utils/logger";
import { randomUUID } from "crypto";

async function readline(rl: Read.Interface, prompt: string) {
  return new Promise<string>((resolve, reject) => {
    rl.question(prompt, (answer) => resolve(answer));
  });
}

async function get_line(rl: Read.Interface) {
  let source = "";
  let prompt = ">>> ";
  while (true) {
    const line = await readline(rl, prompt);
    source += line;
    try {
      const ast = Compiler.compile(source);
      return ast;
    } catch (error) {
      if (!line.trim()) throw error;
      prompt = "... ";
    }
  }
}

export async function repl(vm: CrochetForNode, pkg_name: string) {
  const rl = Read.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const pkg = vm.system.universe.world.packages.get(pkg_name)!;
  const module = new VM.CrochetModule(pkg, "(repl)", null);
  const env = new VM.Environment(null, null, module, null);

  console.log(`Crochet v${pkg_meta.version} | interactive shell`);
  console.log(
    `(Press Ctrl+D to exit. Multi-line can be done with partial parses)`
  );
  console.log("");

  while (true) {
    try {
      const ast = await get_line(rl);
      const result = await ast.evaluate(vm.system, module, env);
      if (result != null) {
        console.log(VM.Location.simple_value(result.value));
      }
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        console.error(error.name + ":", error.message);
      } else if (logger.verbose) {
        console.error(error.stack);
      } else {
        console.error(error.message);
      }
    }
  }
}

export function resolve_file(x: string) {
  switch (x) {
    case ":basic": {
      return Path.resolve(__dirname, "../../repl/basic-repl.json");
    }
    case ":node": {
      return Path.resolve(__dirname, "../../repl/node-repl.json");
    }
    default:
      return x;
  }
}

export class NodeRepl {
  readonly pages: Map<string, ReplPage> = new Map();
  constructor(readonly vm: CrochetForNode, readonly session: string) {}

  get_page(id: string) {
    const page = this.pages.get(id);
    if (page == null) {
      throw new Error(`Unknown page id ${id}`);
    }
    return page;
  }

  static async bootstrap(
    file: string,
    target: Pkg.Target,
    capabilities: Set<string>,
    universe: string,
    session: string,
    package_tokens: Map<string, string>,
    bare: boolean
  ) {
    const disclose_debug = false;
    const library_paths: string[] = [];
    const interactive = false;
    const safe_mode = bare;
    const crochet = new CrochetForNode(
      { universe: universe, packages: package_tokens },
      disclose_debug,
      library_paths,
      capabilities,
      interactive,
      safe_mode
    );
    await crochet.boot_from_file(file, target);
    return new NodeRepl(crochet, session);
  }

  async make_page() {
    const id = randomUUID();
    const root_pkg = this.vm.root;
    const root_cpkg = this.vm.system.universe.world.packages.get(
      root_pkg.meta.name
    );
    if (root_cpkg == null) {
      throw new Error(`internal: root package not found`);
    }

    const module = new VM.CrochetModule(root_cpkg, "(playground)", null);
    const env = new VM.Environment(null, null, module, null);
    const page = new ReplPage(id, this.vm, root_cpkg, module, env);
    this.pages.set(id, page);
    return page;
  }
}

export class ReplPage {
  constructor(
    readonly id: string,
    readonly vm: CrochetForNode,
    readonly pkg: VM.CrochetPackage,
    readonly module: VM.CrochetModule,
    readonly env: VM.Environment
  ) {}

  async run_code(language: string, code: string) {
    if (language !== "crochet") {
      throw new Error(`Language ${language} is currently unsupported`);
    }

    const expr = await Compiler.compile(code);
    return await expr.evaluate(this.vm.system, this.module, this.env);
  }
}
