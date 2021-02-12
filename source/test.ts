import * as Fs from "fs";
import * as Yargs from "yargs";
import { parse } from "./compiler/syntax/parser";
import { show } from "./utils/utils";
import { CrochetInteger, CrochetText, nothing } from "./vm-js/intrinsics";
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

ffi.add("concat", 2, (vm: CrochetVM, activation, x, y) => {
  vm.assert_text(activation, x);
  vm.assert_text(activation, y);
  activation.push(new CrochetText(x.value + y.value));
  return activation;
});

ffi.add("show", 1, (vm: CrochetVM, activation, value) => {
  console.log(show(value.to_js()));
  activation.push(nothing);
  return activation;
});

ffi.add("show-db", 0, (vm: CrochetVM, activation) => {
  console.log(show(vm.database));
  activation.push(nothing);
  return activation;
});

ffi.add("to-text", 1, (vm: CrochetVM, activation, value) => {
  if (value instanceof CrochetInteger) {
    activation.push(new CrochetText(value.value.toString()));
    return activation;
  } else {
    throw new Error(`Invalid type: ${value.type}`);
  }
});

ffi.add("say", 1, (vm: CrochetVM, activation, phrase) => {
  vm.assert_text(activation, phrase);
  console.log(">>", phrase.value);
  activation.push(nothing);
  return activation;
});

ffi.add("wait", 1, (vm: CrochetVM, activation, time) => {
  vm.assert_integer(activation, time);
  console.log(`[Wait ${time.value}]`);
  activation.push(nothing);
  return activation;
});

ffi.add("show-front", 1, (vm: CrochetVM, activation, image) => {
  vm.assert_text(activation, image);
  console.log(`[Show ${image.value}]`);
  activation.push(nothing);
  return activation;
});

console.log("-".repeat(72));
vm.trace(argv.trace === true);
vm.load_module(ir);
vm.run().catch((error) => console.error(error.stack));
