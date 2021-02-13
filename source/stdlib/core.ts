import { CrochetValue } from "../vm-js/intrinsics";
import { CrochetVMInterface } from "../vm-js/vm";

export function equals(
  vm: CrochetVMInterface,
  x: CrochetValue,
  y: CrochetValue
) {
  return vm.boolean(x.equals(y));
}

export function not_equals(
  vm: CrochetVMInterface,
  x: CrochetValue,
  y: CrochetValue
) {
  return vm.boolean(!x.equals(y));
}

export function to_text(vm: CrochetVMInterface, x: CrochetValue) {
  return vm.text(x.to_text());
}
