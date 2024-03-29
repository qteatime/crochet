#!/usr/bin/env node
const execSync = require("child_process").execSync;
const execFile = require("child_process").execFileSync;
const Path = require("path");
const FS = require("fs");

class World {
  constructor() {
    this.tasks = new Map();
  }

  async run(name) {
    const task = this.tasks.get(name);
    if (!task) {
      throw new Error(`Undefined task ${name}`);
    }
    console.log(`-> Running ${name}`);
    return await task.run(this);
  }

  task(name, dependencies, code) {
    const task = new Task(name, dependencies, code);
    this.tasks.set(name, task);
    return task;
  }

  find(name) {
    return this.tasks.get(name);
  }

  get all_tasks() {
    return Array.from(this.tasks.values());
  }
}

class Task {
  constructor(name, dependencies, code) {
    this.name = name;
    this.dependencies = dependencies;
    this.code = code;
    this.documentation = "";
  }

  async run(world) {
    for (const dependency of this.dependencies) {
      await world.run(dependency);
    }
    await this.code();
  }

  with_doc(text) {
    this.documentation = text;
    return this;
  }
}

function exec(command, opts) {
  console.log("$>", command);
  execSync(command, { stdio: ["inherit", "inherit", "inherit"], ...opts });
}

function exec_file(command, args, opts) {
  console.log("$>", command, ...args);
  execFile(command, args, {
    stdio: ["inherit", "inherit", "inherit"],
    ...opts,
  });
}

function tsc(project) {
  const file = Path.join(__dirname, "node_modules/typescript/bin/tsc");
  exec_file("node", [file, "-p", project]);
}

const w = new World();

w.task("install-deps", [], () => {
  exec(`npm install`);
  const stdlib = Path.join(__dirname, "stdlib");
  for (const dir of FS.readdirSync(stdlib)) {
    console.log("=> at", `stdlib/${dir}`);
    if (FS.existsSync(Path.join(stdlib, dir, "package.json"))) {
      exec(`npm install`, { cwd: Path.join(stdlib, dir) });
    }
  }
}).with_doc("Install all dependencies for the project");

w.task("build-grammar", [], () => {
  exec(
    `node tools/lingua.js source/grammar/crochet.lingua > source/generated/crochet-grammar.ts`
  );
}).with_doc(`Compiles the Crochet grammar to TypeScript`);

w.task("build-ts", [], () => {
  exec(`npm run build-ts`);
}).with_doc("Compiles the TypeScript source to JavaScript");

w.task("build-targets", ["build"], () => {
  exec(`npm run build-targets`);
}).with_doc("Packages JavaScript targets with webpack");

w.task("build-browser", ["build-grammar", "build-ts", "package-stdlib"], () => {
  exec(`npm run build-browser`);
}).with_doc("Builds Crochet for the Browser target with browserify");

w.task("build-stdlib", [], () => {
  exec(`npm run build-stdlib`);
  exec(`npm run bundle-codemirror`);
  exec(`npm run bundle-lingua`);
}).with_doc("Compiles the TypeScript stdlib source to JavaScript");

w.task("package-stdlib", ["build-stdlib"], async () => {
  console.log("> Packaging stdlib");
  await require("./build/node-cli/archive").generate_stdlib_archives();
}).with_doc("Creates proper package files for all of the stdlib");

w.task("build-purr", [], () => {
  FS.copyFileSync(
    Path.join(__dirname, "www/crochet.js"),
    Path.join(__dirname, "tools/purr/www/crochet.js")
  );
  exec(`npm run build-tools-ts`);
}).with_doc("Builds the Purr tool");

w.task("build", ["build-browser", "build-purr"], () => {}).with_doc(
  "Builds a complete Crochet system"
);

w.task("test", ["install-deps", "build", "run-tests"], () => {}).with_doc(
  "Builds Crochet and runs all tests"
);

w.task("run-tests", [], () => {
  require("./build/test/suites/serialisation");
  require("./build/test/suites/parsing");
  exec(
    "node crochet test tests/vm-tests/crochet.json --non-interactive --capabilities crochet.debug/internal,native"
  );
}).with_doc("Runs all Crochet tests");

w.task("benchmark", ["build"], () => {
  exec("node --expose-gc build/test/benchmarks/run.js");
}).with_doc("Runs all Crochet benchmarks");

// -- LJT
w.task("ljt:build", [], () => {
  tsc("projects/ljt-vm");
}).with_doc("Builds the LJT VM");


// -- Other

w.task("help", [], () => {
  console.log(`Available tasks:\n`);
  for (const task of w.all_tasks) {
    console.log("-", (task.name + " ").padEnd(25, "."), task.documentation);
  }
  console.log("");
}).with_doc("Shows usage help");

const [task_name] = process.argv.slice(2);
const task = w.find(task_name);
if (!task) {
  throw new Error(
    `Undefined task ${task_name}. See "make.js help" for available tasks.`
  );
}

w.run(task_name).catch((error) => {
  console.log("---\nTask execution failed.");
  console.error(error.stack);
  process.exit(1);
});
