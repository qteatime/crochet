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
import { TCrochetUnknown } from "../unknown";
import { TCrochetBoolean, TCrochetFalse, TCrochetTrue } from "../boolean";
import { TCrochetInteger } from "../integer";
import { TCrochetRecord } from "../record";
import { TCrochetStream } from "../stream";
import { TCrochetText } from "../text";
import { TAnyCrochetPartial, TCrochetPartial } from "../partial";
import { TCrochetInterpolation } from "../interpolation";
import { ForeignBag } from "../../world";

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
    ffi.add(bag);
  }
}

export function add_types(state: State) {
  const types = state.world.types;
  types.add("any", Types.TCrochetAny.type);
  types.add("unknown", TCrochetUnknown.type);
  types.add("true", TCrochetTrue.type);
  types.add("false", TCrochetFalse.type);
  types.add("boolean", TCrochetBoolean.type);
  types.add("integer", TCrochetInteger.type);
  types.add("record", TCrochetRecord.type);
  types.add("stream", TCrochetStream.type);
  types.add("text", TCrochetText.type);
  types.add("partial", TAnyCrochetPartial.type);
  types.add("interpolation", TCrochetInterpolation.type);
}
