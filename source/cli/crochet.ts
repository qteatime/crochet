import * as Compiler from "../compiler";
import * as Server from "./crochet-server";
import { Crochet } from "../targets/cli";
import * as REPL from "./repl";

import { array, logger, parse, show } from "../utils";
import * as FS from "fs";
import * as Path from "path";

import * as Yargs from "yargs";
import { CrochetVM, World } from "../runtime";
import { Capabilities, CliTarget, CrochetCapability } from "../runtime/pkg";

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
      })
      .option("capability", {
        description: "The capabilities to grant the program",
        type: "array",
        default: [],
      });
  })
  .command(
    "repl <filename>",
    "Starts a REPL for the given package",
    (Yargs) => {
      Yargs.positional("filename", {
        description: "The package context",
        type: "string",
      })
        .option("capability", {
          description: "The capabilities to grant the program",
          type: "array",
          default: [],
        })
        .option("seed", {
          description: "The initial seed for the PRNG",
          type: "string",
        });
    }
  )
  .command(
    "run-tests <filename>",
    "Runs tests for the given package",
    (Yargs) => {
      Yargs.positional("filename", {
        description: "Path to the file to run",
        type: "string",
      })
        .option("seed", {
          description: "The initial seed for the PRNG",
          type: "string",
        })
        .option("package", {
          description: "Test only a set of packages",
          type: "array",
        })
        .option("capabilities", {
          description: "The capabilities to grant the program",
          type: "array",
          default: [],
        });
    }
  )
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
        })
        .option("capabilities", {
          description: "The capabilities to grant the program",
          type: "array",
          default: [],
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

function read(filename: string) {
  return FS.readFileSync(filename, "utf-8");
}

async function setup_vm(
  vm: CrochetVM,
  filename: string,
  seed: string | null,
  capabilities: Capabilities
) {
  if (seed != null) {
    vm.reseed(Number(seed));
  }
  await vm.initialise();
  logger.debug(
    "Granting capabilities:",
    [...capabilities.capabilities].join(", ")
  );
  logger.debug("Using seed:", vm.world.global_random.seed);
  await vm.load_with_capabilities(filename, new CliTarget(), capabilities);
}

async function run(
  filename: string,
  entry: string = "main",
  seed: string | null,
  capabilities: Capabilities
) {
  const vm = new Crochet();
  try {
    await setup_vm(vm, filename, seed, capabilities);
    await vm.run(entry);
  } catch (error) {
    await vm.show_error(error);
    process.exit(1);
  }
}

async function run_repl(
  filename: string,
  seed: string | null,
  capabilities: Capabilities
) {
  const vm = new Crochet();
  try {
    await setup_vm(vm, filename, seed, capabilities);
    const pkg = await vm.read_package_from_file(filename);
    await REPL.repl(vm, pkg.name);
  } catch (error) {
    await vm.show_error(error);
    process.exit(1);
  }
}

async function run_tests(
  filename: string,
  seed: string | null,
  packages: string[] | null,
  capabilities: Capabilities
) {
  const vm = new Crochet();
  try {
    await setup_vm(vm, filename, seed, capabilities);
    const results = await vm.run_tests((x) =>
      packages == null ? true : packages.includes(x.module.pkg.name)
    );
    process.exit(results.length);
  } catch (error) {
    await vm.show_error(error);
    process.exit(1);
  }
}

function parse_capabilities(capabilities: string[] | null) {
  if (capabilities == null) {
    return new Capabilities(new Set());
  } else {
    return new Capabilities(
      new Set(parse(capabilities, array(CrochetCapability)))
    );
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
logger.verbose = argv.verbose;

switch (argv._[0]) {
  case "run": {
    run(
      argv["filename"] as string,
      argv["entry"] as string,
      argv["seed"] as string | null,
      parse_capabilities(argv["capabilities"] as string[])
    );
    break;
  }

  case "repl": {
    run_repl(
      argv["filename"] as string,
      argv["seed"] as string | null,
      parse_capabilities(argv["capabilities"] as string[])
    );
    break;
  }

  case "run-tests": {
    run_tests(
      argv["filename"] as string,
      argv["seed"] as string | null,
      argv["package"] as string[] | null,
      parse_capabilities(argv["capabilities"] as string[])
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
