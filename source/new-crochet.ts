import * as FS from "fs";
import * as Path from "path";

import * as IR from "./ir";
import * as Compiler from "./compiler";
import * as Binary from "./binary-serialisation";
import * as VM from "./vm";
import * as Package from "./pkg";
import { logger } from "./utils/logger";

export { IR, Compiler, Binary, VM, Package };

void (async function main() {
  try {
    const [file, verbose] = process.argv.slice(2);
    logger.verbose = !!verbose;

    debugger;
    const source = FS.readFileSync(file, "utf-8");
    const ast = Compiler.parse(source, file);
    const ir = Compiler.lowerToIR(file, source, ast);

    const universe = VM.make_universe();
    const pkg = new VM.CrochetPackage(universe.world, "(anonymous)", file);
    const module = VM.load_module(universe, pkg, ir);

    debugger;
    const value = await VM.run_command(universe, module, "main: _", [
      VM.Values.make_tuple(universe, []),
    ]);

    console.log(VM.Location.simple_value(value));
  } catch (e) {
    console.error(e.stack);
    process.exit(1);
  }
})();
