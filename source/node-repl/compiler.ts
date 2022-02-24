import * as Compiler from "../compiler";
import * as IR from "../ir";
import * as Ast from "../generated/crochet-grammar";
import * as VM from "../vm";
import type { BootedCrochet } from "../crochet/index";

export type Representation = {
  name: string;
  document: string; // JSON
};

type ReplResponse = null | {
  value: VM.CrochetValue;
  representations: Representation[];
};

export abstract class ReplExpr {
  abstract evaluate(
    vm: BootedCrochet,
    module: VM.CrochetModule,
    env: VM.Environment
  ): Promise<ReplResponse>;
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
    vm: BootedCrochet,
    module: VM.CrochetModule,
    env: VM.Environment
  ): Promise<ReplResponse> {
    for (const x of this.declarations) {
      await vm.load_declaration(x, module);
    }

    return null;
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
    vm: BootedCrochet,
    module: VM.CrochetModule,
    env: VM.Environment
  ): Promise<ReplResponse> {
    const new_env = VM.Environments.clone(env);
    const value = await vm.run_block(this.block, new_env);
    // Copy only non-generated bindings back to the top-level environment
    for (const [k, v] of new_env.bindings.entries()) {
      if (!/\$/.test(k)) {
        env.define(k, v);
      }
    }

    const perspectives = await vm.debug_perspectives(value);
    const representations = await vm.debug_representations(value, perspectives);

    return {
      value,
      representations: representations.map((x) => ({
        name: x.name,
        document: JSON.stringify(x.document),
      })),
    };
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
