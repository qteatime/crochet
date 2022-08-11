import * as Path from "path";
import * as FS from "fs";
import * as Pkg from "../pkg";
import { Binary } from "../targets/browser";
import { CrochetArchiveWriter } from "./codec";
import { BinaryReader, BinaryWriter } from "../binary/binary";
import { CrochetArchive } from "./archive";
import { hash_file } from "../binary-encode";
import { normalize_path } from "../utils/normalize-path";

export function build_from_json(file: string, target: string) {
  const source = FS.readFileSync(file, "utf-8");
  const pkg = Pkg.parse_from_string(source, file);
  const rpkg = new Pkg.ResolvedPackage(pkg, Pkg.target_any());

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
  FS.writeFileSync(target, buffer);

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
