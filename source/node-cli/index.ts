import * as FS from "fs";
import * as Path from "path";
import * as Util from "util";
import { CrochetForNode } from "../targets/node";
import Crochet from "../index";
import { logger } from "../utils/logger";
import { CrochetTest, CrochetValue } from "../vm";
import * as REPL from "../node-repl";
import Server from "./server";
import * as Packaging from "./package";

function read_crochet(file: string) {
  const source = FS.readFileSync(file, "utf-8");
  const ast = Crochet.compiler.parse(source, file);
  const ir = Crochet.compiler.lower_to_ir(file, source, ast);
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

interface Options {
  verbose: boolean;
  disclose_debug: boolean;
  web: {
    port: number;
    www_root: string;
  };
  packaging: {
    out_dir: string;
  };
  test: {
    title?: string;
    module?: string;
    package?: string;
  };
  app_args: string[];
}

function parse_options(args0: string[]) {
  const options: Options = Object.create(null);
  const positional: string[] = [];
  let current = 0;
  const repo_root = Path.resolve(__dirname, "../../");

  options.verbose = false;
  options.test = {};
  options.web = {
    port: 8000,
    www_root: Path.join(repo_root, "www"),
  };
  options.packaging = {
    out_dir: "packages",
  };
  options.app_args = [];

  loop: while (current < args0.length) {
    const x = args0[current];

    switch (x) {
      case "--verbose": {
        options.verbose = true;
        current += 1;
        continue;
      }

      case "--test-title": {
        options.test.title = args0[current + 1] ?? "";
        current += 2;
        continue;
      }

      case "--test-module": {
        options.test.module = args0[current + 1] ?? "";
        current += 2;
        continue;
      }

      case "--test-package": {
        options.test.package = args0[current + 1] ?? "";
        current += 2;
        continue;
      }

      case "--port": {
        options.web.port = Number(args0[current + 1]) ?? options.web.port;
        current += 2;
        continue;
      }

      case "--www-root": {
        options.web.www_root = args0[current + 1];
        current += 2;
        continue;
      }

      case "--package-to": {
        options.packaging.out_dir =
          args0[current + 1] ?? options.packaging.out_dir;
        current += 2;
        continue;
      }

      case "--disclose-debug": {
        options.disclose_debug = true;
        current++;
        continue;
      }

      case "--": {
        options.app_args = args0.slice(current + 1);
        break loop;
      }

      default:
        positional.push(x);
        current += 1;
    }
  }

  return { args: positional, options: options };
}

async function show_ast([file]: string[], options: Options) {
  const source = FS.readFileSync(file, "utf-8");
  const ast = Crochet.compiler.parse(source, file);
  console.log(Util.inspect(ast, false, null, true));
}

async function show_ir([file]: string[], options: Options) {
  const ir = read(file);

  const t = Crochet.ir.DeclarationTag;
  for (const x of ir.declarations) {
    switch (x.tag) {
      case t.COMMAND: {
        console.log(`Command ${x.name} ${x.types}`);
        console.log(
          x.body.ops
            .map((x, i) => `  ${Crochet.vm.Location.simple_op(x, i)}\n`)
            .join("")
        );
        break;
      }

      case t.DEFINE: {
        console.log(`Define ${x.name}`);
        console.log(
          x.body.ops
            .map((x, i) => `  ${Crochet.vm.Location.simple_op(x, i)}\n`)
            .join("")
        );
        break;
      }

      case t.PRELUDE: {
        console.log(`Prelude`);
        console.log(
          x.body.ops
            .map((x, i) => `  ${Crochet.vm.Location.simple_op(x, i)}\n`)
            .join("")
        );
        break;
      }

      case t.TEST: {
        console.log(`Test ${x.name}`);
        console.log(
          x.body.ops
            .map((x, i) => `  ${Crochet.vm.Location.simple_op(x, i)}\n`)
            .join("")
        );
        break;
      }

      default:
        console.log(t[x.tag], x);
    }
  }
  console.log("");
}

async function run([file]: string[], options: Options) {
  const crochet = new CrochetForNode(
    options.disclose_debug,
    [],
    new Set([]),
    true
  );
  await crochet.boot_from_file(file, Crochet.pkg.target_node());
  const value = await crochet.run("main: _", [
    crochet.ffi.list(options.app_args.map((x) => crochet.ffi.text(x))),
  ]);
  if (value.tag === Crochet.vm.Tag.NOTHING) {
    return;
  }

  console.log(crochet.renderer.render_value(value));
}

async function test([file]: string[], options: Options) {
  const crochet = new CrochetForNode(
    options.disclose_debug,
    [],
    new Set([]),
    true
  );
  await crochet.boot_from_file(file, Crochet.pkg.target_node());
  const failures = await crochet.run_tests(compile_test_filter(options.test));
  process.exitCode = failures.length;
}

async function build([file]: string[], options: Options) {
  const crochet = new CrochetForNode(
    options.disclose_debug,
    [],
    new Set([]),
    true
  );
  await crochet.build(file);
}

async function repl([file0]: string[], options: Options) {
  const crochet = new CrochetForNode(
    options.disclose_debug,
    [],
    new Set([]),
    true
  );
  let file = REPL.resolve_file(file0);

  await crochet.boot_from_file(file, Crochet.pkg.target_node());
  const pkg = crochet.read_package_from_file(file);
  await REPL.repl(crochet, pkg.meta.name);
}

async function run_web([file]: string[], options: Options) {
  await Server(file, options.web.port, options.web.www_root);
}

async function package_app([file]: string[], options: Options) {
  await Packaging.package_app(file, null, options.packaging.out_dir);
}

async function new_package([name]: string[], options: Options) {
  const root = Path.join(process.cwd(), name);
  if (FS.existsSync(root)) {
    console.error(`Directory ${name} already exists`);
    process.exit(1);
  }
  FS.mkdirSync(root);
  FS.mkdirSync(Path.join(root, "source"));
  FS.mkdirSync(Path.join(root, "native"));
  FS.mkdirSync(Path.join(root, "test"));
  const pkg = {
    name: name,
    target: "*",
    native_sources: [],
    sources: ["source/main.crochet"],
    dependencies: ["crochet.core"],
    capabilities: {
      requires: [],
      provides: [],
    },
  };
  FS.writeFileSync(
    Path.join(root, "crochet.json"),
    JSON.stringify(pkg, null, 2)
  );
  const main = `% crochet
  
command main: (Args is list) do
  "Hello, world";
test
  assert (main: []) =:= "Hello, world";
end`;
  FS.writeFileSync(Path.join(root, "source/main.crochet"), main);
  console.log(`Created ${name}`);
}

function help(command?: string) {
  switch (command) {
    case "run":
      console.log(
        [
          "crochet run --- runs a Crochet package\n",
          "\n",
          "Usage:\n",
          "  crochet run <crochet.json> [options] [-- <app-args...>]\n",
          "\n",
          "Options:\n",
          "  --verbose                  Outputs debugging information\n",
        ].join("")
      );
      break;

    case "build":
      console.log(
        [
          "crochet build --- compiles all files in a Crochet package\n",
          "\n",
          "Usage:\n",
          "  crochet build <crochet.json> [options]\n",
          "\n",
          "Options:\n",
          "  --verbose                  Outputs debugging information\n",
        ].join("")
      );
      break;

    case "show-ir":
      console.log(
        [
          "crochet show-ir --- shows the compiled representation of a Crochet file\n",
          "\n",
          "Usage:\n",
          "  crochet show-ir <file.crochet> [options]\n",
          "\n",
          "Options:\n",
          "  --verbose                  Outputs debugging information\n",
        ].join("")
      );
      break;

    case "help":
      console.log(
        [
          "crochet help --- shows usage help for a command\n",
          "\n",
          "Usage:\n",
          "  crochet help [<command>]\n",
        ].join("")
      );
      break;

    case "version":
      console.log(
        [
          "crochet version --- shows the Crochet version number\n",
          "\n",
          "Usage:\n",
          "  crochet version\n",
        ].join("")
      );
      break;

    case "test":
      console.log(
        [
          "crochet test --- runs all tests in a Crochet package\n",
          "\n",
          "Usage:\n",
          "  crochet test <crochet.json> [options]\n",
          "\n",
          "Options:\n",
          "  --verbose                  Outputs debugging information\n",
          "  --test-title <pattern>     Only runs tests whose title match pattern\n",
          "  --test-module <pattern>    Only runs tests whose module filename match pattern\n",
          "  --test-package <pattern>   Only runs tests whose package name match pattern\n",
        ].join("")
      );
      break;

    default:
      console.log(
        [
          "crochet --- a safe programming language\n",
          "\n",
          "Usage:\n",
          "  crochet run <crochet.json> [options] [-- <app-args...>]\n",
          "  crochet run-web <crochet.json> [options]\n",
          "  crochet package <crochet.json> [options]\n",
          "  crochet repl <crochet.json> [options]\n",
          "  crochet test <crochet.json> [options]\n",
          "  crochet build <crochet.json> [options]\n",
          "  crochet show-ir <file.crochet> [options]\n",
          "  crochet show-ast <file.crochet> [options]\n",
          "  crochet new <name> [options]\n",
          "  crochet help [<command>]\n",
          "  crochet version\n",
          "\n",
          "Options:\n",
          "  --verbose      Outputs debugging information\n",
        ].join("")
      );
  }
}

function make_filter(pattern: string | null) {
  if (pattern == null) {
    return (x: string) => true;
  } else {
    const re = new RegExp(
      pattern.replace(/[^\w\d\*]/g, "\\$1").replace(/\*/g, ".*?")
    );
    return (x: string) => re.test(x);
  }
}

function compile_test_filter(x: Options["test"]) {
  const titleF = make_filter(x.title ?? null);
  const moduleF = make_filter(x.module ?? null);
  const packageF = make_filter(x.package ?? null);

  return (x: CrochetTest) =>
    titleF(x.title) &&
    moduleF(x.module.filename) &&
    packageF(x.module.pkg.name);
}

void (async function main() {
  try {
    const [command, ...args0] = process.argv.slice(2);
    const { args, options } = parse_options(args0);
    logger.verbose = options.verbose;

    switch (command) {
      case "show-ir":
        return await show_ir(args, options);
      case "show-ast":
        return await show_ast(args, options);
      case "run":
        return await run(args, options);
      case "run-web":
        return await run_web(args, options);
      case "test":
        return await test(args, options);
      case "build":
        return await build(args, options);
      case "package":
        return await package_app(args, options);
      case "repl":
        return await repl(args, options);
      case "new":
        return await new_package(args, options);
      case "version": {
        const version = require("../../package.json").version;
        console.log(`Crochet version ${version}`);
        break;
      }
      case "help": {
        return help(args[0]);
      }
      default:
        console.log(`Unknown command ${command ?? "(no command provided)"}\n`);
        help();
        process.exit(1);
    }
  } catch (error) {
    console.error(error.stack);
    process.exit(1);
  }
})();
