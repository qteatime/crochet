import * as FS from "fs";
import * as Path from "path";

import Crochet from "./new-index";
import { logger } from "./utils/logger";

function read_crochet(file: string) {
  const source = FS.readFileSync(file, "utf-8");
  const ast = Crochet.compiler.parse(source, file);
  const ir = Crochet.compiler.lowerToIR(file, source, ast);
  return ir;
}

function read_binary(file: string) {
  const source = FS.readFileSync(file);
  const ir = Crochet.binary.decode_program(source);
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
        const ir = read_crochet(file);
        const target = FS.createWriteStream(file + ".croc");
        Crochet.binary.encode_program(ir, target);
        console.log("Generated ", file + ".croc");
        return;
      }

      case "run": {
        const ir = read(file);

        const universe = Crochet.vm.make_universe();
        const pkg = new Crochet.vm.CrochetPackage(
          universe.world,
          "(anonymous)",
          file
        );
        const module = Crochet.vm.load_module(universe, pkg, ir);

        const value = await Crochet.vm.run_command(
          universe,
          module,
          "main: _",
          [Crochet.vm.Values.make_tuple(universe, [])]
        );

        console.log(Crochet.vm.Location.simple_value(value));
        return;
      }
    }
  } catch (e) {
    console.error(e.stack);
    process.exit(1);
  }
})();
