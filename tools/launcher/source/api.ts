import * as FS from "fs";
import * as Path from "path";
import * as Glob from "glob";

function read_pkg(file: string) {
  return JSON.parse(FS.readFileSync(file, "utf-8"));
}

export class API {
  constructor(readonly root: string) {}

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
}
