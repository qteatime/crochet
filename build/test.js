"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Fs = require("fs");
const Util = require("util");
const parser_1 = require("./syntax/parser");
function show(obj) {
    return Util.inspect(obj, false, null, true);
}
const [file] = process.argv.slice(2);
const source = Fs.readFileSync(file, "utf-8");
const ast = parser_1.parse(source);
console.log(`${file}\n${"-".repeat(file.length)}`);
console.log(show(ast));
