import { parse } from "../compiler";
import { compileProgram } from "../compiler/compiler";
import { State } from "../runtime";
import { files } from "./files";
import * as Builtin from "../runtime/primitives/builtins";

export async function load(state: State) {
  Builtin.add_prelude(state);

  for (const [filename, source] of files) {
    const ast = parse(source);
    const ir = compileProgram(ast);
    await state.world.load_declarations(ir, state.env);
  }
}
