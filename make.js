#!/usr/bin/env node
const execSync = require("child_process").execSync;

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

function exec(command) {
  console.log("$>", command);
  execSync(command, { stdio: ["inherit", "inherit", "inherit"] });
}

const w = new World();

w.task("build-grammar", [], () => {
  exec(
    `node tools/lingua.js source/grammar/crochet.lingua > source/generated/crochet-grammar.ts`
  );
}).with_doc(`Compiles the Crochet grammar to TypeScript`);

w.task("build-ts", [], () => {
  exec(`./node_modules/.bin/tsc -p .`);
}).with_doc("Compiles the TypeScript source to JavaScript");

w.task("build-targets", ["build"], () => {
  exec(`./node_modules/.bin/webpack`);
}).with_doc("Packages JavaScript targets with webpack");

w.task("build-browser", ["build"], () => {
  exec(
    ` ./node_modules/.bin/browserify -e build/targets/browser.js -o www/crochet.js -s Crochet`
  );
}).with_doc("Builds Crochet for the Browser target with browserify");

w.task("build-stdlib", [], () => {
  exec(`./node_modules/.bin/tsc -p stdlib`);
}).with_doc("Compiles the TypeScript stdlib source to JavaScript");

w.task(
  "build",
  ["build-grammar", "build-ts", "build-stdlib"],
  () => {}
).with_doc("Builds a complete Crochet system");

w.task("test", ["build", "run-tests"], () => {}).with_doc(
  "Builds Crochet and runs all tests"
);

w.task("run-tests", [], () => {
  require("./build/test/suites/serialisation");
  exec("node crochet test tests/vm-tests/crochet.json");
}).with_doc("Runs all Crochet tests");

w.task("benchmark", ["build"], () => {
  exec("node --expose-gc build/test/benchmarks/run.js");
}).with_doc("Runs all Crochet benchmarks");

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
