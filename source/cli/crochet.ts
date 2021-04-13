import { Capabilities, NodeTarget, CrochetCapability } from "../runtime/pkg";
import * as Compiler from "../compiler";
import * as Server from "./crochet-server";
import { CrochetVM } from "../vm-interface";
import { Crochet } from "../targets/cli";
import * as REPL from "./repl";

import {
  array,
  difference,
  intersect,
  logger,
  parse,
  show,
  union,
} from "../utils";
import * as FS from "fs";
import * as Path from "path";
import * as Yargs from "yargs";
import { StorageConfig } from "../storage";
import { question } from "./prompt";

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
      .option("capabilities", {
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
        .option("capabilities", {
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
  .option("non-interactive", {
    description: "Run in non-interactive mode",
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
  capabilities: string[],
  batch: boolean
) {
  if (seed != null) {
    vm.reseed(Number(seed));
  }
  const config = StorageConfig.load();
  await vm.initialise();
  const { graph, pkg } = await vm.resolve(filename, new NodeTarget());
  if (batch) {
    const capset = new Capabilities(new Set(capabilities));
    logger.debug("Granting capabilities:", capabilities.join(", "));
    graph.check(pkg.name, capset);
  } else {
    const previouscap = config.grants(pkg.name)?.capabilities ?? null;
    const totalcap = graph.capability_requirements;
    if (previouscap == null) {
      console.log(
        `Running ${
          pkg.name
        } (from ${filename}) requires the following capabilities:\n  - ${[
          ...totalcap.values(),
        ].join(
          "\n  - "
        )}.\nType 'yes' to grant these capabilities and run the application. Your choice will be recorded. [yes/no]`
      );
      if (!(await question("> "))) {
        console.log(
          `Not running the application because it lacks capabilities.`
        );
        process.exit(1);
      }
      config.update_grants(pkg.name, [...totalcap.values()]);
    } else {
      const caps = new Set(previouscap);
      const missing = difference(totalcap, caps);
      if (missing.size !== 0) {
        console.log(
          `You have previously granted ${
            pkg.name
          } (from ${filename}) the following capabilities:\n  - ${previouscap.join(
            "\n  - "
          )}.\nIt now also requires the following capabilities:\n  - ${[
            ...missing.values(),
          ].join("\n  - ")}.\nType 'yes' to update the capabilities. [yes/no].`
        );
        if (!(await question("> "))) {
          console.log(
            `Not running the application because it lacks capabilities.`
          );
          process.exit(1);
        }
        config.update_grants(pkg.name, [...totalcap.values()]);
      }
    }
    graph.check(pkg.name, new Capabilities(totalcap));
  }

  logger.debug("Using seed:", vm.world.global_random.seed);
  await vm.load_graph(graph, pkg);
}

async function run(
  filename: string,
  entry: string = "main",
  seed: string | null,
  capabilities: string[],
  batch: boolean
) {
  const vm = new Crochet();
  try {
    await setup_vm(vm, filename, seed, capabilities, batch);
    await vm.run(entry);
  } catch (error) {
    await vm.show_error(error);
    process.exit(1);
  }
}

async function run_repl(
  filename: string,
  seed: string | null,
  capabilities: string[],
  batch: boolean
) {
  const vm = new Crochet();
  try {
    await setup_vm(vm, filename, seed, capabilities, batch);
    const pkg = await vm.read_package_from_file(filename);
    await vm.run_initialisation();
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
  capabilities: string[],
  batch: boolean
) {
  const vm = new Crochet();
  try {
    await setup_vm(vm, filename, seed, capabilities, batch);
    const results = await vm.run_tests((x) =>
      packages == null ? true : packages.includes(x.module.pkg.name)
    );
    process.exit(results.length);
  } catch (error) {
    await vm.show_error(error);
    process.exit(1);
  }
}

function show_ast(filename: string) {
  const source = read(filename);
  const ast = Compiler.parse(source, filename);
  console.log(show(ast));
}

function show_ir(filename: string) {
  const source = read(filename);
  const ast = Compiler.parse(source, filename);
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
      argv["capabilities"] as string[],
      argv["non-interactive"] as boolean
    );
    break;
  }

  case "repl": {
    run_repl(
      argv["filename"] as string,
      argv["seed"] as string | null,
      argv["capabilities"] as string[],
      argv["non-interactive"] as boolean
    );
    break;
  }

  case "run-tests": {
    run_tests(
      argv["filename"] as string,
      argv["seed"] as string | null,
      argv["package"] as string[] | null,
      argv["capabilities"] as string[],
      argv["non-interactive"] as boolean
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
