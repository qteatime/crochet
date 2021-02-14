import { CrochetVM } from "../vm-js/vm";
import * as IR from "../ir";
import * as Stdlib from "../stdlib";
import { ForeignInterface } from "../vm-js/primitives";
import { Display } from "./display";
import { add_primitives, Primitives } from "./primitives";
import { load_program } from "./loader";

export type Extension = (
  vm: CrochetVM,
  ffi: ForeignInterface,
  display: Display
) => void;

export async function run(
  selector: string,
  programs: string[],
  extension?: Extension
) {
  const ffi = new ForeignInterface();
  const vm = new CrochetVM(ffi);
  Stdlib.add_prelude(vm, ffi);

  const canvas = document.querySelector(selector);
  if (canvas == null) {
    alert("No element ${selector");
    throw new Error(`No element ${selector}`);
  }

  const display = new Display(canvas);

  const primitives = new Primitives(display);
  add_primitives(vm, ffi, primitives);

  for (const program of programs) {
    const module = await load_program(program);
    vm.load_module(module);
  }

  if (extension != null) {
    extension(vm, ffi, display);
  }

  await vm.run().catch((error) => {
    console.error(error);
    display.show_error(error.message);
  });
}
