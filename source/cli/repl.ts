const pkg_meta = require("../../package.json");
import * as Read from "readline";
import * as Compiler from "../compiler";
import * as IR from "../runtime/ir";
import * as Rt from "../runtime";
import * as Ast from "../generated/crochet-grammar";
import { cvalue, Environment } from "../runtime";
import { AnyTarget, CliTarget, CrochetPackage } from "../runtime/pkg";
import { Crochet } from "../targets/cli";
import { unreachable } from "../utils";

abstract class ReplExpr {
  abstract evaluate(state: Rt.State): Promise<void>;
}

export class ReplStatement extends ReplExpr {
  constructor(readonly ir: IR.Statement) {
    super();
  }

  async evaluate(state: Rt.State) {
    const machine = this.ir.evaluate(state);
    const result = cvalue(await Rt.Thread.for_machine(machine).run_and_wait());
    console.log(result.to_text());
  }
}

export class ReplDeclaration extends ReplExpr {
  constructor(readonly ir: IR.Declaration[]) {
    super();
  }

  async evaluate(state: Rt.State) {
    for (const ir of this.ir) {
      await ir.apply(
        {
          filename: state.env.module.filename,
          module: state.env.module,
          package: state.env.module.pkg,
        },
        state
      );
    }
  }
}

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

function compile(ast: Ast.Statement | Ast.Declaration) {
  if (ast instanceof Ast.Statement) {
    const ir = Compiler.compileStatement(ast);
    return new ReplStatement(ir);
  } else if (ast instanceof Ast.Declaration) {
    const ir = Compiler.compileDeclaration(
      ast,
      Compiler.DeclarationLocality.PUBLIC
    );
    return new ReplDeclaration(ir);
  } else {
    throw unreachable(ast, "AST");
  }
}

export async function repl(vm: Crochet, pkg_name: string) {
  const rl = Read.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const pkg = (await vm.registered_packages.get(pkg_name)!).restricted_to(
    new CliTarget()
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
      const expr = compile(ast);
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
