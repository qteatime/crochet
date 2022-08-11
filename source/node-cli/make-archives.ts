import * as Path from "path";
import * as FS from "fs";
import * as Pkg from "../pkg";
import * as ArchiveOp from "../archive/ops";

const stdlib_root = Path.resolve(__dirname, "../../stdlib");
const stdlib_target = Path.resolve(__dirname, "../../stdlib/_build");

function* stdlib_packages() {
  for (const dir of FS.readdirSync(stdlib_root)) {
    const base = Path.join(stdlib_root, dir);
    const pkg_file = Path.join(base, "crochet.json");
    if (FS.existsSync(pkg_file)) {
      const pkg = Pkg.parse_from_string(
        FS.readFileSync(pkg_file, "utf-8"),
        pkg_file
      );
      yield { pkg, dir: base };
    }
  }
}

export function main() {
  FS.mkdirSync(stdlib_target, { recursive: true });
  const entries = [];
  for (const { pkg } of stdlib_packages()) {
    const target = Path.join(stdlib_target, pkg.meta.name + ".archive");
    const { hash } = ArchiveOp.build_from_json(pkg.filename, target);
    console.log(
      "-> Built archive for",
      pkg.meta.name,
      `(${hash.toString("hex")})`
    );
    entries.push({
      name: pkg.meta.name,
      hash: hash.toString("hex"),
      filename: Path.basename(target),
    });
  }
  FS.writeFileSync(
    Path.join(stdlib_target, "packages.json"),
    JSON.stringify(entries, null, 2)
  );
  console.log("-> Wrote package index");
}
