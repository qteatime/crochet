import * as Crochet from "../generated/crochet-grammar";

export function parse(source: string, filename: string) {
  const result = Crochet.parse(source, "program");
  if (result.ok) {
    return result.value;
  } else {
    throw new SyntaxError(`In ${filename}\n${result.error}`);
  }
}

export function parse_repl(source: string, filename: string): Crochet.REPL {
  const matched = Crochet.get_grammar().match(source, "repl");
  if (matched.failed()) {
    throw new SyntaxError(`In ${filename}\n${matched.message!}`);
  } else {
    return Crochet.toAst(matched);
  }
}
