#!/usr/bin/env node
const FS = require("fs");
const Path = require("path");
const execSync = require("child_process").execSync;
const glob = require("glob").sync;

async function build_crochet_package(file) {
  const CrochetForNode = require("./build/targets/node").CrochetForNode;
  const pkg = JSON.parse(FS.readFileSync(file, "utf-8"));
  console.log(`-> Building ${pkg.name}`);
  const crochet = new CrochetForNode(false, [], new Set([]), false);
  await crochet.build(file);
}

function copy_tree(from, to, options = {}) {
  const skip_special = options.skip_special ?? true;
  mkdirp(to);
  for (const file of FS.readdirSync(from)) {
    if (skip_special && /(^\.)/.test(file)) {
      console.log(
        `:: Skipping ${Path.join(from, file)} -- not copying special files`
      );
      continue;
    }

    const stat = FS.statSync(Path.join(from, file));
    if (stat.isFile()) {
      FS.copyFileSync(Path.join(from, file), Path.join(to, file));
    } else if (stat.isDirectory()) {
      copy_tree(Path.join(from, file), Path.join(to, file), options);
    } else {
      throw new Error(`Unsupported resource type at ${Path.join(from, file)}`);
    }
  }
}

function mkdirp(path) {
  if (!FS.existsSync(path)) {
    FS.mkdirSync(path, { recursive: true });
  }
}

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

const w = new World();

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

w.task("build-browser", ["build"], () => {
  exec(`npm run build-browser`);
}).with_doc("Builds Crochet for the Browser target with browserify");

w.task("build-stdlib", [], () => {
  exec(`npm run build-stdlib`);
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

w.task("launcher:build", ["build-browser"], () => {
  exec("npm install", { cwd: "tools/launcher" });
  exec("npm run build-server", { cwd: "tools/launcher" });
  exec("npm run build-app", { cwd: "tools/launcher" });
  exec("npm run build-ipc", { cwd: "tools/launcher" });
  console.log("-> Copying files to the proper location...");
  FS.copyFileSync(
    Path.join(__dirname, "www/crochet.js"),
    Path.join(__dirname, "tools/launcher/www/crochet.js")
  );
  copy_tree(
    Path.join(__dirname, "tools/launcher/node_modules/monaco-editor/dev"),
    Path.join(__dirname, "tools/launcher/www/monaco")
  );
}).with_doc("Builds the Crochet IDE");

w.task("launcher:start-server", [], () => {
  exec("node build/node-cli.js", { cwd: "tools/launcher" });
}).with_doc("Starts a node server for the IDE");

w.task("launcher:start-gui", [], () => {
  exec("npm run start-gui", { cwd: "tools/launcher" });
}).with_doc("Starts an electron app for the IDE");

w.task("launcher:package", [], async () => {
  const releases = [
    {
      name: "win32-x64",
      url: "https://github.com/electron/electron/releases/download/v13.6.0/electron-v13.6.0-win32-x64.zip",
      zip_name: "electron-v13.6.0-win32-x64.zip",
      resource_path: "resources/app",
      async rebrand(root) {
        FS.renameSync(
          Path.join(root, "electron.exe"),
          Path.join(root, "crochet.exe")
        );
      },
    },
    {
      name: "linux-x64",
      url: "https://github.com/electron/electron/releases/download/v13.6.0/electron-v13.6.0-linux-x64.zip",
      zip_name: "electron-v13.6.0-linux-x64.zip",
      resource_path: "resources/app",
      async rebrand(root) {
        FS.renameSync(Path.join(root, "electron"), Path.join(root, "crochet"));
      },
    },
  ];

  const pkg = JSON.parse(
    FS.readFileSync(Path.join(__dirname, "package.json"), "utf-8")
  );
  const version = pkg.version;
  pkg.main = "tools/launcher/build/electron.js";

  console.log("-> Building electron packages for version", version);
  const pkg_root = Path.join(__dirname, "dist", version);
  const launcher_root = Path.join(__dirname, "tools/launcher");
  const repo_root = __dirname;
  exec(`rm -rf ${JSON.stringify(pkg_root)}`);
  mkdirp(pkg_root);

  const app_root = Path.join(pkg_root, "app");
  const tool_root = Path.join(app_root, "tools/launcher");
  console.log("-> Preparing app...");
  mkdirp(app_root);
  FS.writeFileSync(
    Path.join(app_root, "package.json"),
    JSON.stringify(pkg, null, 2)
  );
  FS.copyFileSync(
    Path.join(repo_root, "package-lock.json"),
    Path.join(app_root, "package-lock.json")
  );
  copy_tree(Path.join(repo_root, "build"), Path.join(app_root, "build"));
  copy_tree(Path.join(repo_root, "stdlib"), Path.join(app_root, "stdlib"));
  copy_tree(Path.join(repo_root, "examples"), Path.join(app_root, "examples"));
  copy_tree(Path.join(repo_root, "www"), Path.join(app_root, "www"));

  mkdirp(tool_root);
  FS.copyFileSync(
    Path.join(__dirname, "tools/lingua.js"),
    Path.join(app_root, "tools/lingua.js")
  );
  FS.copyFileSync(
    Path.join(launcher_root, "package.json"),
    Path.join(tool_root, "package.json")
  );
  FS.copyFileSync(
    Path.join(launcher_root, "package-lock.json"),
    Path.join(tool_root, "package-lock.json")
  );
  copy_tree(Path.join(launcher_root, "www"), Path.join(tool_root, "www"));
  copy_tree(Path.join(launcher_root, "build"), Path.join(tool_root, "build"));
  copy_tree(Path.join(launcher_root, "app"), Path.join(tool_root, "app"));

  console.log("-> Installing dependencies...");
  exec("npm install --production", { cwd: app_root });
  exec("npm install --production", { cwd: tool_root });

  console.log("-> Pre-compiling all Crochet packages...");
  const crochet_pkgs = glob("**/crochet.json", {
    cwd: app_root,
    absolute: true,
  });
  for (const cpkg of crochet_pkgs) {
    await build_crochet_package(cpkg);
  }

  for (const release of releases) {
    const root = Path.join(pkg_root, release.name);

    console.log("-> Building", release.name);
    mkdirp(root);
    exec(`wget ${JSON.stringify(release.url)}`, { cwd: root });
    exec(`unzip -q ${JSON.stringify(release.zip_name)}`, { cwd: root });
    exec(`rm ${JSON.stringify(release.zip_name)}`, { cwd: root });
    console.log("-> Copying files...");
    copy_tree(app_root, Path.join(root, release.resource_path), {
      skip_special: false,
    });
    console.log("-> Packaging into a single archive...");
    await release.rebrand(root);
    exec(
      `zip -1 -r -q ${JSON.stringify(
        `crochet-${version}-${release.name}.zip`
      )} ${JSON.stringify(release.name)}`,
      {
        cwd: pkg_root,
      }
    );
    console.log(":: Built", release.name, "successfully");
  }
}).with_doc("Generates distribution packages for the IDE (Linux only)");

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
