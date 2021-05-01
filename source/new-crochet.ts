import * as FS from "fs";
import * as Path from "path";

import * as IR from "./ir";
import * as Compiler from "./compiler";
import * as Binary from "./binary-serialisation";
import * as VM from "./vm";
import * as Package from "./pkg";
import { logger } from "./utils/logger";

export { IR, Compiler, Binary, VM, Package };

function read_crochet(file: string) {
  const source = FS.readFileSync(file, "utf-8");
  const ast = Compiler.parse(source, file);
  const ir = Compiler.lowerToIR(file, source, ast);
  return ir;
}

function read_binary(file: string) {
  const source = FS.readFileSync(file);
  const ir = Binary.decode_program(source);
  return ir;
}

function read(file: string) {
  switch (Path.extname(file)) {
    case ".crochet":
      return read_crochet(file);
    case ".croc":
      return read_binary(file);
    default:
      throw Error(`Unsupported file ${file}`);
  }
}

void (async function main() {
  try {
    const [command, file, verbose] = process.argv.slice(2);
    logger.verbose = !!verbose;
    if (!file) {
      throw new Error(`Usage: new-crochet <run|compile> <file> [verbose]`);
    }

    switch (command) {
      case "compile": {
        const source = FS.readFileSync(file, "utf-8");
        const ast = Compiler.parse(source, file);
        const ir = Compiler.lowerToIR(file, source, ast);
        const target = FS.createWriteStream(file + ".croc");
        Binary.encode_program(ir, target);
        console.log("Generated ", file + ".croc");
        return;
      }

      case "run": {
        const ir = read(file);

        const universe = VM.make_universe();
        const pkg = new VM.CrochetPackage(universe.world, "(anonymous)", file);
        const module = VM.load_module(universe, pkg, ir);

        const value = await VM.run_command(universe, module, "main: _", [
          VM.Values.make_tuple(universe, []),
        ]);

        console.log(VM.Location.simple_value(value));
        return;
      }
    }
  } catch (e) {
    console.error(e.stack);
    process.exit(1);
  }
})();
