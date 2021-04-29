import * as Path from "path";
import * as FS from "fs";
import * as Binary from "../binary-serialisation";
import * as Compiler from "../compiler";
import { execFileSync } from "child_process";
import { RestrictedCrochetPackage } from "../runtime/pkg";
import { logger } from "../utils";

const linguaPath = Path.join(__dirname, "../../node_modules/.bin/lingua");

export function build(pkg: RestrictedCrochetPackage) {
  for (const file of pkg.sources) {
    switch (Path.extname(file)) {
      case ".lingua":
        build_lingua(file, pkg);
        break;
      case ".crochet":
        build_crochet(file, pkg);
        break;
    }
  }
}

export function build_lingua(file: string, pkg: RestrictedCrochetPackage) {
  console.log(`Compiling ${pkg.relative_filename(file)} in ${pkg.name}`);
  const output = execFileSync("node", [linguaPath, file, "crochet"]);
  FS.writeFileSync(file + ".crochet", output);
  build_crochet(file + ".crochet", pkg);
}

export function build_crochet(file: string, pkg: RestrictedCrochetPackage) {
  const relative_file = pkg.relative_filename(file);
  const target = pkg.binary_image(file);
  const source = FS.readFileSync(file, "utf-8");
  if (is_crochet_up_to_date(relative_file, source, target)) {
    return;
  }
  console.log(`Compiling ${relative_file} in ${pkg.name}`);
  compile_crochet(file, relative_file, source, target);
}

export function compile_crochet(
  from: string,
  from_relative: string,
  source: string,
  target: string
) {
  FS.mkdirSync(Path.dirname(target), { recursive: true });
  const stream = FS.createWriteStream(target);
  const ast = Compiler.parse(source, from);
  const program = Compiler.lowerToIR(from_relative, source, ast);
  Binary.encode_program(program, stream);
  stream.close();
}

function is_crochet_up_to_date(file: string, source: string, target: string) {
  if (!FS.existsSync(target)) {
    return false;
  }
  const current_hash = Binary.hash_file(source);
  const bin = FS.readFileSync(target);
  const { version, hash } = Binary.read_hash(bin);

  if (
    version !== Binary.VERSION ||
    hash.toString("hex") !== current_hash.toString("hex")
  ) {
    return false;
  }

  console.log(`Skipping ${file} (already up-to-date)`);
  logger.debug(`--- (version ${version}, hash ${hash.toString("hex")})`);
  return true;
}
