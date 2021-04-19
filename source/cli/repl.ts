const pkg_meta = require("../../package.json");
import * as Read from "readline";
import * as Compiler from "../compiler";
import * as Rt from "../runtime";
import { NodeTarget } from "../runtime/pkg";
import { Crochet } from "../targets/cli";

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
      const ast = Compiler.parse_repl(source, "(repl)");
      return ast;
    } catch (error) {
      if (!line.trim()) throw error;
      prompt = "... ";
    }
  }
}

export async function repl(vm: Crochet, pkg_name: string) {
  const rl = Read.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const pkg = (await vm.registered_packages.get(pkg_name)!).restricted_to(
    new NodeTarget()
  );
  const module = new Rt.CrochetModule(vm.world, "(repl)", pkg);
  const state0 = Rt.State.root(vm.world);
  const env = state0.env.clone_with_module(module);
  const state = state0.with_env(env);

  console.log(`Crochet v${pkg_meta.version} | interactive shell`);
  console.log(
    `(Press Ctrl+D to exit. Multi-line can be done with partial parses)`
  );
  console.log("");

  while (true) {
    try {
      const ast = await get_line(rl);
      const expr = Compiler.compileRepl(ast);
      await expr.evaluate(state);
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error(error.name + ":", error.message);
      } else {
        vm.show_error(error);
      }
    }
  }
}
