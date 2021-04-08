import * as Crochet from "../generated/crochet-grammar";

export function parse(source: string) {
  const result = Crochet.parse(source, "program");
  if (result.ok) {
    return result.value;
  } else {
    throw new SyntaxError(result.error);
  }
}

export function parse_repl(
  source: string
): Crochet.Declaration | Crochet.Statement {
  const matched = Crochet.grammar.match(source, "repl");
  if (matched.failed()) {
    throw new SyntaxError(matched.message!);
  } else {
    return Crochet.toAst(matched);
  }
}
