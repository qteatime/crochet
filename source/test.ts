import * as Fs from "fs";
import { parse } from "./compiler/syntax/parser";
import { show } from "./utils/utils";
import { nothing } from "./vm-js/intrinsics";
import { ForeignInterface } from "./vm-js/primitives";
import { CrochetVM } from "./vm-js/vm";

const [file, trace] = process.argv.slice(2);
const source = Fs.readFileSync(file, "utf-8");
const ast = parse(file, source);
console.log(`${file}\n${"-".repeat(file.length)}`);
console.log(show(ast));

const ir = ast.compile();
console.log("-".repeat(72));
console.log(show(ir));

const ffi = new ForeignInterface();
const vm = new CrochetVM(ffi);

ffi.add("Jump", 1, (vm: CrochetVM, activation, name) => {
  vm.assert_text(activation, name);
  console.log(`[Jump to ${name.value}]`);
  const scene = vm.get_scene(activation, name.value);
  return vm.make_scene_activation(activation, scene);
});

ffi.add("Say", 1, (vm: CrochetVM, activation, phrase) => {
  vm.assert_text(activation, phrase);
  console.log(">>", phrase.value);
  return activation;
});

ffi.add("Wait", 1, (vm: CrochetVM, activation, time) => {
  vm.assert_integer(activation, time);
  console.log(`[Wait ${time.value}]`);
  return activation;
});

ffi.add("ShowFront", 1, (vm: CrochetVM, activation, image) => {
  vm.assert_text(activation, image);
  console.log(`[Show ${image.value}]`);
  return activation;
});

console.log("-".repeat(72));
vm.trace(trace === "--trace");
vm.load_module(ir);
vm.run().catch((error) => console.error(error.stack));
