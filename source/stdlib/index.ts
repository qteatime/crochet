import { parse } from "../compiler";
import { compileProgram } from "../compiler/compiler";
import { State } from "../runtime";

import { HtmlFfi } from "./html/ffi";
import {
  DebugFfi,
  IntegerFfi,
  InterpolationFfi,
  RecordFfi,
  StreamFfi,
  TimeFfi,
  CoreFfi,
} from "./native";

export async function load(state: State) {
  state.world.ffi.add(CoreFfi as any);
  state.world.ffi.add(IntegerFfi as any);
  state.world.ffi.add(InterpolationFfi as any);
  state.world.ffi.add(RecordFfi as any);
  state.world.ffi.add(StreamFfi as any);

  state.world.ffi.add(HtmlFfi as any);
  state.world.ffi.add(DebugFfi as any);
  state.world.ffi.add(TimeFfi as any);
}

import * as Html from "./html";
export { Html };
