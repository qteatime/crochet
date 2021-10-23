import * as FS from "fs";
import * as Path from "path";
import * as Glob from "glob";
import * as OS from "os";
import * as Package from "../../../build/pkg";

function read_pkg(file: string) {
  return JSON.parse(FS.readFileSync(file, "utf-8"));
}

export class API {
  constructor(readonly root: string) {}

  projects_directory() {
    return Path.join(OS.homedir(), "crochet-projects");
  }

  ensure_projects_directory() {
    const dir = this.projects_directory();
    if (!FS.existsSync(dir)) {
      console.log("** Created projects directory");
      FS.mkdirSync(dir, { recursive: true });
    }
  }

  examples() {
    const pkgs_json = Glob.sync("**/crochet.json", {
      cwd: Path.join(this.root, "examples"),
      absolute: true,
    });
    return pkgs_json.map((x) => ({ filename: x, meta: read_pkg(x) }));
  }

  libraries() {
    const pkgs_json = Glob.sync("**/crochet.json", {
      cwd: Path.join(this.root, "stdlib"),
      absolute: true,
    });
    return pkgs_json.map((x) => ({ filename: x, meta: read_pkg(x) }));
  }

  my_projects() {
    const pkgs_json = Glob.sync("**/crochet.json", {
      cwd: Path.resolve(this.projects_directory()),
      absolute: true,
    });
    return pkgs_json.map((x) => ({ filename: x, meta: read_pkg(x) }));
  }

  create_project(pkg0: any) {
    const root = Path.join(this.projects_directory(), pkg0.name);
    const file = Path.join(root, "crochet.json");
    Package.parse(pkg0, file);

    FS.mkdirSync(root);
    FS.writeFileSync(file, JSON.stringify(pkg0, null, 2));

    FS.mkdirSync(Path.join(root, "source"));
    FS.writeFileSync(Path.join(root, "source", "main.crochet"), `% crochet\n`);

    FS.mkdirSync(Path.join(root, "native"));
    FS.mkdirSync(Path.join(root, "assets"));

    return file;
  }
}
