"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util = require("util");
const Fs = require("fs");
const Path = require("path");
const parser_1 = require("./dialogue/parser");
const env_1 = require("./dialogue/env");
const text_1 = require("./runtime/intrinsics/text");
const record_1 = require("./runtime/intrinsics/record");
const crochet_1 = require("./runtime/core/crochet");
const dialogue_1 = require("./runtime/dialogue/dialogue");
const number_1 = require("./runtime/intrinsics/number");
const algebra_1 = require("./runtime/dialogue/algebra");
const input = new crochet_1.CrochetInput();
const renderer = new crochet_1.CrochetRenderer();
const dialogue = new dialogue_1.CrochetDialogue();
const game = new crochet_1.Crochet(renderer, input, dialogue);
function show(x) {
    return Util.inspect(x, false, null, true);
}
function parseFile(file) {
    const fileName = Path.join(__dirname, "../examples/dialogue", file);
    const source = Fs.readFileSync(fileName, "utf8");
    const ast = parser_1.parse(source);
    return ast;
}
const env = new env_1.Environment();
env.define_procedure("id", (x) => x);
env.define_procedure("pause", (ms) => {
    if (ms instanceof number_1.CrochetInteger) {
        return new algebra_1.Pause(ms);
    }
    else {
        throw new TypeError(`Expected an integer`);
    }
});
env.define("name", new text_1.CrochetText("Stabby"));
env.define("selected", new record_1.CrochetRecord(new Map([
    ["name", new text_1.CrochetText("Stabby")]
])));
const line1 = new algebra_1.Concatenate(parseFile("example1.txt").eval(env), new algebra_1.Wait());
const line2 = new algebra_1.Concatenate(new algebra_1.Text("No pauses here!"), new algebra_1.Pause(new number_1.CrochetInteger(1000n, null)));
const line3 = new algebra_1.Concatenate(parseFile("example2.txt").eval(env), new algebra_1.Wait());
dialogue.push_dialogue(line1);
dialogue.push_dialogue(line2);
dialogue.push_dialogue(line3);
game.run().catch(error => {
    console.error(error);
    process.exit(1);
});
