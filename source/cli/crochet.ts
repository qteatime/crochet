import * as Compiler from "../compiler";
import * as Runtime from "../runtime";
import * as Stdlib from "../stdlib";
import * as Server from "./crochet-server";

import { show } from "../utils";
import * as FS from "fs";
import * as Path from "path";

import * as Yargs from "yargs";
import { World } from "../runtime";

const argv = Yargs.usage("crochet <command> [options]")
  .command("run <filename>", "Runs the simulation in the terminal", (Yargs) => {
    Yargs.option("entry", {
      description: "The initial scene to play",
      default: "main",
      type: "string",
    }).positional("filename", {
      description: "Path to the file to run",
      type: "string",
    });
  })
  .command(
    "run-web <directory>",
    "Runs the simulation in the browser",
    (Yargs) => {
      Yargs.option("entry", {
        description: "The initial scene to play",
        default: "main",
        type: "string",
      })
        .positional("directory", {
          description: "Directory containing a crochet.json file",
          type: "string",
        })
        .option("port", {
          description: "Port to bind to",
          default: 8080,
          type: "number",
        });
    }
  )
  .command("show-ast <filename>", "Shows the AST for <filename>", (Yargs) => {
    Yargs.positional("filename", {
      description: "Path to the file to inspect",
      type: "string",
    });
  })
  .command("show-ir <filename>", "Shows the IR for <filename>", (Yargs) => {
    Yargs.positional("filename", {
      description: "Path to the file to inspect",
      type: "string",
    });
  })
  .demandCommand(1).argv;

async function load(source: string, state: Runtime.State) {
  const ast = Compiler.parse(source);
  const ir = Compiler.compileProgram(ast);
  await state.world.load_declarations(ir, state.env);
}

async function initialise() {
  const world = new World();
  const state = Runtime.State.root(world);
  await Stdlib.load(state);
  return state;
}

function read(filename: string) {
  return FS.readFileSync(filename, "utf-8");
}

async function run(filename: string, entry: string = "main") {
  try {
    const state = await initialise();
    const source = read(filename);
    await load(source, state);
    await state.world.run(entry);
  } catch (error) {
    console.error(error.stack);
    process.exit(1);
  }
}

function show_ast(filename: string) {
  const source = read(filename);
  const ast = Compiler.parse(source);
  console.log(show(ast));
}

function show_ir(filename: string) {
  const source = read(filename);
  const ast = Compiler.parse(source);
  const ir = Compiler.compileProgram(ast);
  console.log(show(ir));
}

switch (argv._[0]) {
  case "run": {
    run(argv["filename"] as string, argv["entry"] as string);
    break;
  }

  case "run-web": {
    Server.serve(argv["directory"] as string, argv["port"] as number);
    break;
  }

  case "show-ast": {
    show_ast(argv["filename"] as string);
    break;
  }

  case "show-ir": {
    show_ir(argv["filename"] as string);
    break;
  }

  default:
    throw new Error(`Unknown command ${argv._[0]}`);
}
