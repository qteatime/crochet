import * as Fs from "fs";
import * as Yargs from "yargs";
import { parse } from "./compiler/syntax/parser";
import { show } from "./utils/utils";
import {
  CrochetBoolean,
  CrochetInteger,
  CrochetText,
  nothing,
} from "./vm-js/intrinsics";
import { ForeignInterface } from "./vm-js/primitives";
import { CrochetVM, CrochetVMInterface } from "./vm-js/vm";
import { add_prelude } from "./stdlib";

const argv = Yargs.option("show-ast", {
  type: "boolean",
  description: "Show the AST in the stdout",
})
  .option("show-ir", {
    type: "boolean",
    description: "Show the IR in the stdout",
  })
  .option("trace", {
    type: "boolean",
    description: "Show the execution trace in the stdout",
  }).argv;

const [file] = argv._ as string[];

const source = Fs.readFileSync(
  file || __dirname + "../examples/hello.crochet",
  "utf-8"
);
const ast = parse(file, source);
if (argv["show-ast"]) {
  console.log(`${file}\n${"-".repeat(file.length)}`);
  console.log(show(ast));
}

const ir = ast.compile();
if (argv["show-ir"]) {
  console.log("-".repeat(72));
  console.log(show(ir));
}

const ffi = new ForeignInterface();
const vm = new CrochetVM(ffi);
add_prelude(vm, ffi);

ffi.add("show", 1, (vm, value) => {
  console.log(show(value.to_js()));
  return nothing;
});

ffi.add("say", 1, (vm: CrochetVMInterface, phrase) => {
  vm.assert_text(phrase);
  console.log(">>", phrase.value);
  return nothing;
});

ffi.add("wait", 1, (vm: CrochetVMInterface, time) => {
  vm.assert_integer(time);
  console.log(`[Wait ${time.value}]`);
  return nothing;
});

ffi.add("first", 1, (vm: CrochetVMInterface, x) => {
  vm.assert_stream(x);
  if (x.values.length === 0) {
    throw new Error(`Empty stream`);
  }
  return x.values[0];
});

ffi.add("at", 2, (vm: CrochetVMInterface, x, k) => {
  vm.assert_record(x);
  vm.assert_text(k);
  const value = x.values.get(k.value);
  if (value == null) {
    throw new Error(`Invalid key ${k.value}`);
  }
  return value;
});

console.log("-".repeat(72));
vm.trace(argv.trace === true);
vm.load_module(ir);
vm.run().catch((error) => console.error(error.stack));
