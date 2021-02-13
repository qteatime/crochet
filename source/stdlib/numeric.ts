import { CrochetValue } from "../vm-js/intrinsics";
import { CrochetVMInterface } from "../vm-js/vm";

export function less_than(
  vm: CrochetVMInterface,
  x: CrochetValue,
  y: CrochetValue
) {
  vm.assert_integer(x);
  vm.assert_integer(y);
  return x.less_than(y);
}

export function greater_than(
  vm: CrochetVMInterface,
  x: CrochetValue,
  y: CrochetValue
) {
  vm.assert_integer(x);
  vm.assert_integer(y);
  return x.greater_than(y);
}

export function less_than_or_equal(
  vm: CrochetVMInterface,
  x: CrochetValue,
  y: CrochetValue
) {
  vm.assert_integer(x);
  vm.assert_integer(y);
  return x.less_than(y).or(vm.boolean(x.equals(y)));
}

export function greater_than_or_equal(
  vm: CrochetVMInterface,
  x: CrochetValue,
  y: CrochetValue
) {
  vm.assert_integer(x);
  vm.assert_integer(y);
  return x.greater_than(y).or(vm.boolean(x.equals(y)));
}

export function add(vm: CrochetVMInterface, x: CrochetValue, y: CrochetValue) {
  vm.assert_integer(x);
  vm.assert_integer(y);
  return x.add(y);
}

export function subtract(
  vm: CrochetVMInterface,
  x: CrochetValue,
  y: CrochetValue
) {
  vm.assert_integer(x);
  vm.assert_integer(y);
  return x.subtract(y);
}

export function multiply(
  vm: CrochetVMInterface,
  x: CrochetValue,
  y: CrochetValue
) {
  vm.assert_integer(x);
  vm.assert_integer(y);
  return x.multiply(y);
}

export function divide(
  vm: CrochetVMInterface,
  x: CrochetValue,
  y: CrochetValue
) {
  vm.assert_integer(x);
  vm.assert_integer(y);
  return x.divide(y);
}

export function remainder(
  vm: CrochetVMInterface,
  x: CrochetValue,
  y: CrochetValue
) {
  vm.assert_integer(x);
  vm.assert_integer(y);
  return x.remainder(y);
}
