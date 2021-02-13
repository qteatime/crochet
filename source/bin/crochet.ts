import * as Yargs from "yargs";
import * as Compiler from "../compiler";
import * as Fs from "fs";
import * as Path from "path";
import { show } from "../utils/utils";

const argv = Yargs.command(
  "compile <file>",
  "Compiles Crochet files",
  (Yargs) => {
    Yargs.positional("file", {
      description: "Path to the file to compile.",
    }).option("output", {
      description: "Path to output the file (by default stdout)",
    });
  }
)
  .command(
    "inspect <file>",
    "Inspects the internal representation of a Crochet file",
    (Yargs) => {
      Yargs.positional("file", { description: "Path to the file to inspect." })
        .option("show-ast", {
          description: "Displays the AST as seen by the parser",
          boolean: true,
        })
        .option("show-ir", {
          description:
            "Displays the intermediate representation executed by the VM",
          boolean: true,
        });
    }
  )
  .demandCommand(1).argv;

const [command] = argv._;
switch (command) {
  case "compile": {
    const file = argv.file as string;
    const output = argv.output as string | null;
    const ast = Compiler.parse(file);
    const ir = Compiler.compile(ast);
    const text = JSON.stringify(ir, null, 2);
    if (output == null) {
      console.log(text);
    } else {
      Fs.writeFileSync(output, text);
    }
    break;
  }

  case "inspect": {
    const file = argv.file as string;
    const ast = Compiler.parse(file);
    if (argv["show-ast"]) {
      console.log("AST");
      console.log("-".repeat(72));
      console.log(show(ast));
    }

    if (argv["show-ir"]) {
      const ir = Compiler.compile(ast);
      console.log("IR");
      console.log("-".repeat(72));
      console.log(show(ir));
    }
    break;
  }

  default: {
    throw new Error(`Invalid command ${command}`);
  }
}
