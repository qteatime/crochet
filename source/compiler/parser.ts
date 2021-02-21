import * as Crochet from "../generated/crochet-grammar";

export function parse(source: string) {
  const result = Crochet.parse(source, "program");
  if (result.ok) {
    return result.value;
  } else {
    throw new SyntaxError(result.error);
  }
}
