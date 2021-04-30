import * as Path from "path";
import * as FS from "fs";
import * as stdlib from "../stdlib";
import { State, World } from "../runtime";
import { Plugin } from "../plugin";
import { CrochetVM } from "../vm-interface";

export class Crochet extends CrochetVM {
  stdlib_path = Path.join(__dirname, "../../stdlib");

  get prelude() {
    return ["crochet.core", "crochet.debug"];
  }

  async read_file(filename: string) {
    return FS.readFileSync(filename, "utf-8");
  }

  async load_native(
    filename: string
  ): Promise<(_: Plugin) => void | Promise<void>> {
    // FIXME: this is really unsafe :')
    const module = require(filename);
    if (typeof module.default === "function") {
      return module.default;
    } else if (typeof module === "function") {
      return module;
    } else {
      throw new Error(
        `Cannot load native module ${filename} because it does not export a function`
      );
    }
  }

  async initialise() {
    await stdlib.load(State.root(this.world));
    await this.register_packages_from_directory(this.stdlib_path);
  }

  async register_packages_from_directory(root: string) {
    for (const dir of FS.readdirSync(root)) {
      const file = Path.join(root, dir, "crochet.json");
      if (FS.existsSync(file)) {
        const pkg = await this.read_package_from_file(file);
        this.register_package(pkg.name, pkg);
      }
    }
  }
}
