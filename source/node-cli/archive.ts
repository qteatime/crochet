import * as Path from "path";
import * as FS from "fs";
import * as Pkg from "../pkg";
import * as Build from "./build";
import { Binary } from "../targets/browser";
import { CrochetArchiveWriter } from "../archive/codec";
import { BinaryReader, BinaryWriter } from "../binary/binary";
import { CrochetArchive } from "../archive/archive";
import { hash_file } from "../binary-encode";
import { normalize_path } from "../utils/normalize-path";

const stdlib_root = Path.resolve(__dirname, "../../stdlib");
const stdlib_target = Path.resolve(__dirname, "../../stdlib/_build");

export function archive_from_json(
  file: string,
  out_file: string,
  target: Pkg.Target
) {
  const source = FS.readFileSync(file, "utf-8");
  const pkg = Pkg.parse_from_string(source, file);
  const rpkg = new Pkg.ResolvedPackage(pkg, target);

  const writer = new Binary.BufferedWriter();
  const encoder = new CrochetArchiveWriter();
  encoder.add_file("crochet.json", Buffer.from(source));
  for (const file of rpkg.native_sources) {
    encoder.add_file(
      file.relative_filename,
      FS.readFileSync(Path.resolve(file.absolute_filename))
    );
  }
  for (const file of rpkg.sources) {
    encoder.add_file(
      file.relative_binary_image,
      FS.readFileSync(Path.resolve(file.binary_image))
    );
  }
  encoder.write(new BinaryWriter(writer));
  const buffer = writer.collect();
  FS.writeFileSync(out_file, buffer);

  return {
    buffer,
    hash: hash_file(buffer),
  };
}

export function unpack(filename: string, target: string) {
  const data = FS.readFileSync(filename);
  FS.mkdirSync(target, { recursive: true });
  const reader = new BinaryReader(data);
  const archive = CrochetArchive.decode(reader);
  for (const file of archive.files) {
    console.log("Unpacking", file.path);
    const path = Path.join(target, file.path);
    FS.mkdirSync(Path.dirname(path), { recursive: true });
    FS.writeFileSync(path, file.data);
  }
}

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

export async function generate_stdlib_archives() {
  FS.mkdirSync(stdlib_target, { recursive: true });
  const entries = [];
  for (const { pkg, dir } of stdlib_packages()) {
    const target = Path.join(stdlib_target, pkg.meta.name + ".archive");
    const { hash } = archive_from_json(pkg.filename, target, Pkg.target_any());
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
