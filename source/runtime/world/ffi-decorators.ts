import { CrochetType, CrochetValue, NativeProcedureFn } from "../primitives";
import { Machine, State } from "../vm";

type BasicFFI = (...args: CrochetValue[]) => CrochetValue;

type MachineFFI =
  | ((state: State, ...args: CrochetValue[]) => Machine)
  | BasicFFI;

interface FunDescriptor<T> {
  value?: T;
}

export function machine() {
  return (target: any, key: string, descriptor: FunDescriptor<BasicFFI>) => {
    const fn = descriptor.value as any;
    if (fn == null) {
      throw new Error(`Cannot transform a null property`);
    }

    fn.machine = function* (state: State, ...args: CrochetValue[]): Machine {
      return fn(...args);
    };
  };
}

export function foreign(name?: string) {
  return (target: any, key: string, descriptor: FunDescriptor<MachineFFI>) => {
    target.$ffi ||= new Map();
    target.$ffi.set(
      name ?? key,
      (descriptor.value as any)?.machine ?? descriptor.value
    );
  };
}

export function foreign_type(name?: string) {
  return (
    target: any,
    key: string,
    descriptor: TypedPropertyDescriptor<CrochetType>
  ) => {
    target.$ffi_types ||= new Map();
    target.$ffi_types.set(
      name ?? key,
      () => descriptor.get?.() ?? descriptor.value
    );
  };
}

export function foreign_namespace(prefix: string) {
  return (target: any) => {
    target.$ffi_namespace = prefix;
    target.$ffi ||= new Map();
    target.$ffi_types ||= new Map();
  };
}
