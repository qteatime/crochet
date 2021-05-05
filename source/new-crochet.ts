import * as FS from "fs";
import * as Path from "path";

import { CrochetForNode } from "./targets/node";
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
      throw new Error(
        `Usage: new-crochet <show-ir|run|test|compile> <file> [verbose]`
      );
    }

    switch (command) {
      case "show-ir": {
        const ir = read_crochet(file);

        const t = Crochet.ir.DeclarationTag;
        for (const x of ir.declarations) {
          switch (x.tag) {
            case t.COMMAND: {
              console.log(`Command ${x.name} ${x.types}`);
              console.log(
                x.body.ops
                  .map((x) => `  ${Crochet.vm.Location.simple_op(x)}\n`)
                  .join("")
              );
              break;
            }

            case t.DEFINE: {
              console.log(`Define ${x.name}`);
              console.log(
                x.body.ops
                  .map((x) => `  ${Crochet.vm.Location.simple_op(x)}\n`)
                  .join("")
              );
              break;
            }

            case t.PRELUDE: {
              console.log(`Prelude`);
              console.log(
                x.body.ops
                  .map((x) => `  ${Crochet.vm.Location.simple_op(x)}\n`)
                  .join("")
              );
              break;
            }

            case t.TEST: {
              console.log(`Test ${x.name}`);
              console.log(
                x.body.ops
                  .map((x) => `  ${Crochet.vm.Location.simple_op(x)}\n`)
                  .join("")
              );
              break;
            }

            default:
              console.log(t[x.tag], x);
          }
        }
        console.log("");
        break;
      }

      case "compile": {
        const ir = read_crochet(file);
        const target = FS.createWriteStream(file + ".croc");
        Crochet.binary.encode_program(ir, target);
        console.log("Generated ", file + ".croc");
        return;
      }

      case "run": {
        const crochet = new CrochetForNode([], new Set([]), true);
        await crochet.boot(file, Crochet.pkg.target_node());
        const value = await crochet.run("main: _", [crochet.ffi.tuple([])]);

        console.log(Crochet.vm.Location.simple_value(value));
        return;
      }

      case "test": {
        const crochet = new CrochetForNode([], new Set([]), true);
        await crochet.boot(file, Crochet.pkg.target_node());
        await crochet.run_tests((_) => true);
        return;
      }
    }
  } catch (e) {
    console.error(e.stack);
    process.exit(1);
  }
})();
