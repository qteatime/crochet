import * as Util from "util";
import * as Fs from "fs";
import * as Path from "path";
import { parse } from "./dialogue/parser";
import { Environment } from "./dialogue/env";
import { CrochetText } from "./runtime/intrinsics/text";
import { CrochetRecord } from "./runtime/intrinsics/record";
import { Crochet, CrochetInput, CrochetRenderer } from "./runtime/core/crochet";
import { CrochetDialogue } from "./runtime/dialogue/dialogue";
import { CrochetInteger } from "./runtime/intrinsics/number";
import { Concatenate, Pause, Text, Wait } from "./runtime/dialogue/algebra";

const input = new CrochetInput();
const renderer = new CrochetRenderer();
const dialogue = new CrochetDialogue();
const game = new Crochet(renderer, input, dialogue);

function show(x: any) {
  return Util.inspect(x, false, null, true);
}

function parseFile(file: string) {
  const fileName = Path.join(__dirname, "../examples/dialogue", file);
  const source = Fs.readFileSync(fileName, "utf8");
  const ast = parse(source);
  return ast;
}

const env = new Environment();
env.define_procedure("id", (x) => x);
env.define_procedure("pause", (ms) => {
  if (ms instanceof CrochetInteger) {
    return new Pause(ms);
  } else {
    throw new TypeError(`Expected an integer`);
  }
})
env.define("name", new CrochetText("Stabby"));
env.define("selected", new CrochetRecord(new Map([
  ["name", new CrochetText("Stabby")]
])));

const line1 = new Concatenate(parseFile("example1.txt").eval(env), new Wait());
const line2 = new Concatenate(new Text("No pauses here!\n"), new Pause(new CrochetInteger(1000n, null)));
const line3 = new Concatenate(parseFile("example2.txt").eval(env), new Wait());
dialogue.push_dialogue(line1);
dialogue.push_dialogue(line2);
dialogue.push_dialogue(line3);

game.run().catch(error => {
  console.error(error);
  process.exit(1);
})