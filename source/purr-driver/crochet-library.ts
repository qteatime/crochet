import * as FS from "fs";
import * as Path from "path";
import type { PurrRepository } from "./repository";

const stdlib = Path.resolve(__dirname, "../../stdlib");

export class CrochetLibrary {
  private packages: string[] = [];
  constructor(private repo: PurrRepository) {}

  read_metadata() {
    const meta = this.packages.flatMap((x) => {
      try {
        return [FS.readFileSync(x, "utf-8")];
      } catch (e) {
        return [];
      }
    });
    return meta;
  }

  refresh() {
    this.packages = [...this.find_stdlib()];
  }

  private find_stdlib() {
    const result = [];
    for (const x of FS.readdirSync(stdlib)) {
      const dir = Path.join(stdlib, x);
      if (FS.existsSync(Path.join(dir, "crochet.json"))) {
        result.push(Path.join(dir, "crochet.json"));
      }
    }
    return result;
  }
}
