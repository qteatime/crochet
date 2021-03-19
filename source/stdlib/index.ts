import { parse } from "../compiler";
import { compileProgram } from "../compiler/compiler";
import { State } from "../runtime";

import Core from "./generated/core.crochet";
import HtmlUi from "./generated/html-ui.crochet";
import Integer from "./generated/integer.crochet";
import Record from "./generated/record.crochet";
import Stream from "./generated/stream.crochet";
import Text from "./generated/text.crochet";
import Debug from "./generated/debug.crochet";
import Time from "./generated/time.crochet";
import { HtmlFfi } from "./html/ffi";
import {
  DebugFfi,
  FloatFfi,
  IntegerFfi,
  InterpolationFfi,
  RecordFfi,
  StreamFfi,
  TimeFfi,
  CoreFfi,
} from "./native";

const sources = [Core, Integer, Record, Stream, Text, Debug, Time, HtmlUi];

export async function load(state: State) {
  state.world.ffi.add(CoreFfi as any);
  state.world.ffi.add(IntegerFfi as any);
  state.world.ffi.add(FloatFfi as any);
  state.world.ffi.add(InterpolationFfi as any);
  state.world.ffi.add(RecordFfi as any);
  state.world.ffi.add(StreamFfi as any);

  state.world.ffi.add(HtmlFfi as any);
  state.world.ffi.add(DebugFfi as any);
  state.world.ffi.add(TimeFfi as any);

  for (const source of sources) {
    const ast = parse(source);
    const ir = compileProgram(ast);
    await state.world.load_declarations(ir, state.env);
  }
}

import * as Html from "./html";
export { Html };
