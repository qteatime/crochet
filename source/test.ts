import * as Fs from "fs";
import * as Util from "util";
import { parse } from "./compiler/syntax/parser"

function show(obj: any) {
  return Util.inspect(obj, false, null, true);
}

const [file] = process.argv.slice(2);
const source = Fs.readFileSync(file, "utf-8");
const ast = parse(source);
console.log(`${file}\n${"-".repeat(file.length)}`);
console.log(show(ast));
