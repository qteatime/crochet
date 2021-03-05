import { parse } from "../compiler";
import { compileProgram } from "../compiler/compiler";
import { State } from "../runtime";
import * as Builtin from "../runtime/primitives/builtins";

import Core from "./generated/core.crochet";
import HtmlUi from "./generated/html-ui.crochet";
import Integer from "./generated/integer.crochet";
import Record from "./generated/record.crochet";
import Stream from "./generated/stream.crochet";
import Text from "./generated/text.crochet";
import { HtmlFfi } from "./html/ffi";

const sources = [Core, Integer, Record, Stream, Text, HtmlUi];

export async function load(state: State) {
  Builtin.add_prelude(state);
  state.world.ffi.add(HtmlFfi as any);

  for (const source of sources) {
    const ast = parse(source);
    const ir = compileProgram(ast);
    await state.world.load_declarations(ir, state.env);
  }
}

export * from "./html";
