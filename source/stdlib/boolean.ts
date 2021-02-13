import { CrochetValue } from "../vm-js/intrinsics";
import { CrochetVMInterface } from "../vm-js/vm";

export function and(vm: CrochetVMInterface, x: CrochetValue, y: CrochetValue) {
  vm.assert_boolean(x);
  vm.assert_boolean(y);
  return x.and(y);
}

export function or(vm: CrochetVMInterface, x: CrochetValue, y: CrochetValue) {
  vm.assert_boolean(x);
  vm.assert_boolean(y);
  return x.or(y);
}

export function not(vm: CrochetVMInterface, x: CrochetValue) {
  vm.assert_boolean(x);
  return x.not();
}
