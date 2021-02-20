const fs = require("fs");
const path = require("path");
import * as linguist from "./build/source/App";
const yargs = require("yargs");
const prettier = require("prettier");

const argv = yargs.argv;

const [file] = argv._;

const source = fs.readFileSync(file, "utf8");
const ast = linguist.parse(source)(file);
const out = linguist.generate(ast);
const pretty = prettier.format(out, { parser: "typescript" });

console.log(pretty);