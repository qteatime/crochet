const pkg_meta = require("../../package.json");
import * as Path from "path";
import * as Read from "readline";
import * as Compiler from "./compiler";
import * as VM from "../vm";
import { CrochetForNode } from "../targets/node";
import { logger } from "../utils/logger";

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
      await ast.evaluate(vm, module, env);
    } catch (error) {
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
