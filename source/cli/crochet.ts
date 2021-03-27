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
    })
      .positional("filename", {
        description: "Path to the file to run",
        type: "string",
      })
      .option("seed", {
        description: "The initial seed for the PRNG",
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
  .option("verbose", {
    description: "Log debugging information",
    default: false,
    type: "boolean",
  })
  .demandCommand(1).argv;

async function initialise(seed: string | null) {
  const world = new World();
  if (seed != null) {
    world.global_random.reseed(Number(seed));
  }
  const state = Runtime.State.root(world);
  await Stdlib.load(state);
  return state;
}

function read(filename: string) {
  return FS.readFileSync(filename, "utf-8");
}

async function load_file(filename: string, state: Runtime.State) {
  const source = read(filename);
  const ast = Compiler.parse(source);
  const ir = Compiler.compileProgram(ast);
  await state.world.load_declarations(filename, ir, state.env);
}

async function load_package(filename: string, state: Runtime.State) {
  const data = JSON.parse(read(filename));
  const root = Path.dirname(filename);
  for (const native of data.native ?? []) {
    require(Path.resolve(root, native));
  }
  for (const file of data.sources ?? []) {
    await load_file(Path.resolve(root, file), state);
  }
}

async function load(filename: string, state: Runtime.State) {
  switch (Path.extname(filename)) {
    case ".json": {
      return load_package(filename, state);
    }
    case ".crochet": {
      return load_file(filename, state);
    }
    default:
      throw new Error(`Unsupported file ${filename}`);
  }
}

async function run(
  filename: string,
  entry: string = "main",
  seed: string | null
) {
  try {
    const state = await initialise(seed);
    console.debug("[DEBUG] Using seed:", state.random.seed);
    await load(filename, state);
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

if (!argv.verbose) {
  console.debug = () => {};
}

switch (argv._[0]) {
  case "run": {
    run(
      argv["filename"] as string,
      argv["entry"] as string,
      argv["seed"] as string | null
    );
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
