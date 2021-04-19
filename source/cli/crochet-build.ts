import * as Path from "path";
import * as FS from "fs";
import { execFileSync } from "child_process";
import { RestrictedCrochetPackage } from "../runtime/pkg";

const linguaPath = Path.join(__dirname, "../../node_modules/.bin/lingua");

export function build(pkg: RestrictedCrochetPackage) {
  for (const file of pkg.sources) {
    switch (Path.extname(file)) {
      case ".lingua":
        return build_lingua(file, pkg);
    }
  }
}

export function build_lingua(file: string, pkg: RestrictedCrochetPackage) {
  console.log(`Compiling ${pkg.relative_filename(file)} in ${pkg.name}`);
  const output = execFileSync("node", [linguaPath, file, "crochet"]);
  FS.writeFileSync(file + ".crochet", output);
}
