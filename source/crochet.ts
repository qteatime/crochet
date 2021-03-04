import * as rt from "./runtime";
import { cvalue, False, State } from "./runtime";
import { World } from "./runtime/world";
import { show } from "./utils/utils";
import { parse } from "./compiler";
import { compileProgram } from "./compiler/compiler";
import * as Stdlib from "./stdlib";
import * as FS from "fs";

const [filename] = process.argv.slice(2);
if (!filename) {
  console.error("Usage: crochet <file.crochet>");
  process.exit(1);
}

const prelude = `% crochet

command X show = show(X);
`;

async function load(source: string, state: State) {
  const ast = parse(source);
  const ir = compileProgram(ast);
  await state.world.load_declarations(ir, state.env);
}

void (async function main() {
  try {
    const world = new World();
    const state = State.root(world);
    await Stdlib.load(state);

    world.ffi.add("show", async function* (state, x) {
      console.log("[SHOW]", x.to_text());
      return False.instance;
    });

    const source = FS.readFileSync(filename, "utf8");
    await load(prelude, state);
    await load(source, state);

    const result = await world.run("main");
    console.log(">>>", show(cvalue(result).to_js()));
    debugger;
  } catch (e) {
    console.error(e.stack);
    process.exit(1);
  }
})();
