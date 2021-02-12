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
import { CrochetVM } from "./vm-js/vm";

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

ffi.add("concat", 2, async (vm: CrochetVM, activation, x, y) => {
  vm.assert_text(activation, x);
  vm.assert_text(activation, y);
  return new CrochetText(x.value + y.value);
});

ffi.add("show", 1, async (vm: CrochetVM, activation, value) => {
  console.log(show(value.to_js()));
  return nothing;
});

ffi.add("show-db", 0, async (vm: CrochetVM, activation) => {
  console.log(show(vm.database));
  return nothing;
});

ffi.add("to-text", 1, async (vm: CrochetVM, activation, value) => {
  if (value instanceof CrochetInteger) {
    return new CrochetText(value.value.toString());
  } else {
    throw new Error(`Invalid type: ${value.type}`);
  }
});

ffi.add("say", 1, async (vm: CrochetVM, activation, phrase) => {
  vm.assert_text(activation, phrase);
  console.log(">>", phrase.value);
  return nothing;
});

ffi.add("wait", 1, async (vm: CrochetVM, activation, time) => {
  vm.assert_integer(activation, time);
  console.log(`[Wait ${time.value}]`);
  return nothing;
});

ffi.add("first", 1, async (vm: CrochetVM, activation, x) => {
  vm.assert_stream(activation, x);
  if (x.values.length === 0) {
    throw new Error(`Empty stream`);
  }
  return x.values[0];
});

ffi.add("at", 2, async (vm: CrochetVM, activation, x, k) => {
  vm.assert_record(activation, x);
  vm.assert_text(activation, k);
  const value = x.values.get(k.value);
  if (value == null) {
    throw new Error(`Invalid key ${k.value}`);
  }
  return value;
});

ffi.add("equals", 2, async (_, __, x, y) => {
  return new CrochetBoolean(x.equals(y));
});

console.log("-".repeat(72));
vm.trace(argv.trace === true);
vm.load_module(ir);
vm.run().catch((error) => console.error(error.stack));
