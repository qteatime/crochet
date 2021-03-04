import { Machine, State } from "../../vm";
import { NativeProcedureFn } from "../procedure";
import { CrochetValue } from "../value";
import { Core } from "./core";
import { Integer } from "./integer";
import { Record } from "./record";
import { Stream } from "./stream";
import { Text } from "./text";
import * as Types from "../types";
import { Interpolation } from "./interpolation";

interface ForeignBag {
  $ffi_namespace: string;
  $ffi: { [key: string]: (state: State, ...args: CrochetValue[]) => Machine };
}

export const bags = ([
  Core,
  Integer,
  Record,
  Stream,
  Text,
  Interpolation,
] as any) as ForeignBag[];

export function add_prelude(state: State) {
  add_types(state);
  add_native_commands(state);
}

export function add_native_commands(state: State) {
  const ffi = state.world.ffi;
  for (const bag of bags) {
    for (const [fun, code] of Object.entries(bag.$ffi)) {
      ffi.add(`${bag.$ffi_namespace}.${fun}`, code);
    }
  }
}

export function add_types(state: State) {
  const types = state.world.types;
  types.add("any", Types.tAny);
  types.add("unknown", Types.tUnknown);
  types.add("true", Types.tTrue);
  types.add("false", Types.tFalse);
  types.add("boolean", new Types.TCrochetUnion(Types.tTrue, Types.tFalse));
  types.add("integer", Types.tInteger);
  types.add("record", Types.tRecord);
  types.add("stream", Types.tStream);
  types.add("text", Types.tText);
  types.add("partial", Types.tAnyPartial);
  types.add("interpolation", Types.tInterpolation);
}
