import { delay } from "../utils/utils";
import { CrochetValue } from "../vm-js/intrinsics";
import { ForeignInterface } from "../vm-js/primitives";
import { CrochetVM, CrochetVMInterface } from "../vm-js/vm";
import { Display } from "./display";

type VMI = CrochetVMInterface;
type Value = CrochetValue;

export function add_primitives(
  vm: CrochetVM,
  ffi: ForeignInterface,
  primitives: Primitives
) {
  const root = vm.root_env;
  ffi.add("crochet.player:say", 1, primitives.say);
  vm.add_foreign_command(root, "say:", ["Text"], [0], "crochet.player:say");
}

export class Primitives {
  constructor(readonly display: Display) {}

  say = async (vm: VMI, text: Value) => {
    vm.assert_text(text);
    this.display.show_text(text.value);
    return vm.nothing;
  };
}
