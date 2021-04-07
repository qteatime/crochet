import * as Path from "path";
import * as FS from "fs";
import * as stdlib from "../stdlib";
import { CrochetVM, State } from "../runtime";

export class Crochet extends CrochetVM {
  stdlib_path = Path.join(__dirname, "../../stdlib");

  get prelude() {
    return ["crochet.core", "crochet.transcript"];
  }

  async read_file(filename: string) {
    return FS.readFileSync(filename, "utf-8");
  }

  async load_native(
    filename: string
  ): Promise<(_: CrochetVM) => void | Promise<void>> {
    throw new Error("Native extensions are not supported yet");
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
