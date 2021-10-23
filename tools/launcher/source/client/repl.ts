import * as Compiler from "../../../../build/compiler";
import * as IR from "../../../../build/ir";
import * as Ast from "../../../../build/generated/crochet-grammar";
import * as VM from "../../../../build/vm";
import type { CrochetForBrowser } from "../../../../build/targets/browser";
import type { SnippetClient, PlaygroundProcess } from "./client";

export abstract class ReplExpr {
  abstract evaluate(
    client: SnippetClient,
    process: PlaygroundProcess
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
    client: SnippetClient,
    process: PlaygroundProcess
  ): Promise<void> {
    for (const x of this.declarations) {
      await process.vm.system.load_declaration(x, process.module);
      client.post_message("playground/declaration-loaded", {
        message: declaration_name(x),
      });
    }
    client.post_message("playground/success", { value: null });
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
    client: SnippetClient,
    process: PlaygroundProcess
  ): Promise<void> {
    const new_env = VM.Environments.clone(process.environment);
    const value = await process.vm.system.run_block(this.block, new_env);
    // Copy only non-generated bindings back to the top-level environment
    for (const [k, v] of new_env.bindings.entries()) {
      if (!/\$/.test(k)) {
        process.environment.define(k, v);
      }
    }

    client.post_message("playground/success", {
      value: {
        tag: "RAW",
        code: VM.Location.simple_value(value),
      },
    });
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

function declaration_name(x: IR.Declaration) {
  switch (x.tag) {
    case IR.DeclarationTag.ACTION:
      return `added action ${x.name}`;

    case IR.DeclarationTag.CAPABILITY:
      return `added capability group ${x.name}`;

    case IR.DeclarationTag.COMMAND:
      return `added command ${x.name}`;

    case IR.DeclarationTag.CONTEXT:
      return `added context ${x.name}`;

    case IR.DeclarationTag.DEFINE:
      return `defined ${x.name}`;

    case IR.DeclarationTag.EFFECT:
      return `added effect ${x.name}`;

    case IR.DeclarationTag.FOREIGN_TYPE:
      return `added foreign type ${x.name}`;

    case IR.DeclarationTag.IMPLEMENT_TRAIT:
      return `registered trait implementation for ${x.trait.name}`;

    case IR.DeclarationTag.OPEN:
      return `opened ${x.namespace}`;

    case IR.DeclarationTag.PRELUDE:
      return `scheduled prelude`;

    case IR.DeclarationTag.PROTECT:
      return `protected type`;

    case IR.DeclarationTag.RELATION:
      return `added relation ${x.name}`;

    case IR.DeclarationTag.SEAL:
      return `sealed type`;

    case IR.DeclarationTag.TEST:
      return `added test ${x.name}`;

    case IR.DeclarationTag.TRAIT:
      return `added trait ${x.name}`;

    case IR.DeclarationTag.TYPE:
      return `added type ${x.name}`;

    case IR.DeclarationTag.WHEN:
      return `added logical event`;

    default:
      throw new Error(`unknown declaration`);
  }
}
