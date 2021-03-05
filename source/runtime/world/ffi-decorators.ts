import { CrochetType, CrochetValue, NativeProcedureFn } from "../primitives";
import { Machine, State } from "../vm";

export function machine() {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const fn = descriptor.value as any;
    if (fn == null) {
      throw new Error(`Cannot transform a null property`);
    }
    descriptor.value.machine = async function* (
      state: State,
      ...args: CrochetValue[]
    ): Machine {
      return fn(...args);
    };
  };
}

export function foreign(name?: string) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    target.$ffi ||= new Map();
    target.$ffi[name ?? key] = descriptor.value?.machine ?? descriptor.value;
  };
}

export function foreign_type(name?: string) {
  return (
    target: any,
    key: string,
    descriptor: TypedPropertyDescriptor<CrochetType>
  ) => {
    target.$ffi_types ||= new Map();
    target.$ffi_types[name ?? key] = descriptor.value;
  };
}

export function foreign_namespace(prefix: string) {
  return (target: any) => {
    target.$ffi_namespace = prefix;
    target.$ffi ||= new Map();
    target.$ffi_types ||= new Map();
  };
}
