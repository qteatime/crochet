import { Bag } from "../../utils";
import { Error } from "../../utils/result";
import { CrochetType, CrochetValue, NativeProcedureFn } from "../primitives";
import { Machine, State } from "../vm";

export class ForeignInterface {
  readonly methods = new Bag<string, NativeProcedureFn>("foreign function");
  readonly types = new Bag<string, CrochetType>("foreign type");

  add(bag: ForeignBag) {
    const prefix = bag.$ffi_namespace;
    if (prefix == null) {
      throw new Error(`Undefined prefix`);
    }
    for (const [fun, code] of bag.$ffi.entries()) {
      this.methods.add(`${prefix}.${fun}`, code);
    }
    for (const [key, type] of bag.$ffi_types.entries()) {
      this.types.add(`${prefix}.${key}`, type());
    }
  }
}

export interface ForeignBag {
  $ffi_namespace: string;
  $ffi: Map<string, (state: State, ...args: CrochetValue[]) => Machine>;
  $ffi_types: Map<string, () => CrochetType>;
}
