import { CrochetText, CrochetValue } from "../vm-js/intrinsics";
import { CrochetVMInterface } from "../vm-js/vm";

export function concat(
  vm: CrochetVMInterface,
  x: CrochetValue,
  y: CrochetValue
) {
  vm.assert_text(x);
  vm.assert_text(y);
  return x.concat(y);
}

export function title_case(vm: CrochetVMInterface, x: CrochetValue) {
  vm.assert_text(x);
  return new CrochetText(x.value.replace(/^[a-z]/, (m) => m.toUpperCase()));
}
