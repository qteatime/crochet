import * as Path from "path";
import * as FS from "fs";
import * as stdlib from "../stdlib";
import { CrochetVM, State } from "../runtime";

const StdlibPath = Path.join(__dirname, "../../stdlib");

export class Crochet extends CrochetVM {
  get prelude() {
    return ["crochet.core", "crochet.debug", "crochet.time"];
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
    await this.register_packages_from_directory(StdlibPath);
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
