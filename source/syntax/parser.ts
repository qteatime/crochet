import * as Ohm from "ohm-js";
import * as Fs from "fs";
import * as Path from "path";

const grammarFile = Path.join(__dirname, "../../grammar/crochet.ohm");
const grammar = Ohm.grammar(Fs.readFileSync(grammarFile, "utf-8"));

export function parse(source: string) {
  const match = grammar.match(source);
  if (match.failed()) {
    throw new Error(match.message);
  } else {
    console.log("Match:", match);
  }
}