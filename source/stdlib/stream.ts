import { CrochetValue } from "../vm-js/intrinsics";
import { CrochetVMInterface } from "../vm-js/vm";

export function first(vm: CrochetVMInterface, stream: CrochetValue) {
  vm.assert_stream(stream);
  if (stream.values.length === 0) {
    throw new Error(`Empty stream`);
  }
  return stream.values[0];
}
