import * as Compiler from "../compiler";
import * as IR from "../ir";
import * as Ast from "../generated/crochet-grammar";
import * as VM from "../vm";
import type { CrochetForNode } from "../targets/node";

export abstract class ReplExpr {
  abstract evaluate(
    vm: CrochetForNode,
    module: VM.CrochetModule,
    env: VM.Environment
  ): Promise<void>;
}

export class ReplDeclaration extends ReplExpr {
  constructor(
    readonly declarations: IR.Declaration[],
    readonly source: string,
    readonly meta: Map<number, IR.Interval>
  ) {
    super();
  }

  async evaluate(
    vm: CrochetForNode,
    module: VM.CrochetModule,
    env: VM.Environment
  ): Promise<void> {
    for (const x of this.declarations) {
      await vm.system.load_declaration(x, module);
    }
  }
}

export class ReplStatements extends ReplExpr {
  constructor(
    readonly block: IR.BasicBlock,
    readonly source: string,
    readonly meta: Map<number, IR.Interval>
  ) {
    super();
  }

  async evaluate(
    vm: CrochetForNode,
    module: VM.CrochetModule,
    env: VM.Environment
  ): Promise<void> {
    const new_env = VM.Environments.clone(env);
    const value = await vm.system.run_block(this.block, new_env);
    // Copy only non-generated bindings back to the top-level environment
    for (const [k, v] of new_env.bindings.entries()) {
      if (!/\$/.test(k)) {
        env.define(k, v);
      }
    }
    console.log(vm.renderer.render_value(value));
  }
}

export function lower(x: Ast.REPL, source: string) {
  return x.match<ReplExpr>({
    Declarations: (xs) => {
      const { declarations, meta } = Compiler.lower_declarations(source, xs);
      return new ReplDeclaration(declarations, source, meta);
    },

    Statements: (xs) => {
      const { block, meta } = Compiler.lower_statements(source, xs);
      return new ReplStatements(block, source, meta);
    },

    Command: (command) => {
      throw new Error(`Unsupported`);
    },
  });
}

export function compile(source: string) {
  const ast = Compiler.parse_repl(source, "(repl)");
  return lower(ast, source);
}
