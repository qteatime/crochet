import * as Path from "path";
import * as FS from "fs";
import * as Pkg from "../pkg";
import { sync as glob } from "glob";
import { sfs } from "./sfs";

export const projects = {
  list_own() {
    const files = glob("**/crochet.json", {
      absolute: true,
      cwd: sfs.user_library(),
    });
    return files.map((x) => new CrochetProject(x));
  },

  list_examples() {
    const files = glob("**/crochet.json", {
      absolute: true,
      cwd: sfs.examples(),
    });
    return files.map((x) => new CrochetProject(x));
  },
};

abstract class Project {}

export class CrochetProject extends Project {
  constructor(readonly root: string) {
    super();
  }

  async read_metadata() {
    const source = FS.readFileSync(this.root, "utf-8");
    Pkg.parse_from_string(source, "");
    return source;
  }
}
