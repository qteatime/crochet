import * as Path from "path";
import * as FS from "fs";
import * as BinaryEnc from "../binary-encode";
import * as Binary from "../binary";
import * as Compiler from "../compiler";
import * as Package from "../pkg";
import { execFileSync } from "child_process";
import { logger } from "../utils/logger";
import { hash_file } from "../binary-encode/hash";

const linguaPath = Path.join(__dirname, "../../tools/lingua.js");

export async function build_from_file(
  filename: string,
  target: Package.Target
) {
  const root_dir = Path.dirname(filename);
  const source = FS.readFileSync(filename, "utf-8");
  const pkg = Package.parse_from_string(source, filename);
  const rpkg = new Package.ResolvedPackage(pkg, target);
  return await build(root_dir, rpkg);
}

export async function build(root_dir: string, pkg: Package.ResolvedPackage) {
  for (const file of pkg.sources) {
    await build_file(root_dir, file, pkg);
  }
}

export async function build_file(
  root_dir: string,
  file: Package.ResolvedFile,
  pkg: Package.ResolvedPackage
) {
  switch (file.extension) {
    case ".lingua":
      await build_lingua(root_dir, file, pkg);
      break;

    case ".crochet":
      await build_crochet(root_dir, file, pkg);
      break;

    default:
      throw new Error(`Unsupported file ${file.relative_filename}`);
  }
}

export async function build_lingua(
  root_dir: string,
  file: Package.ResolvedFile,
  pkg: Package.ResolvedPackage
) {
  const output = execFileSync("node", [
    linguaPath,
    Path.join(root_dir, file.relative_basename),
    "crochet",
  ]);
  if (!is_crochet_up_to_date(root_dir, file.crochet_file, output)) {
    logger.debug(`Compiling ${file.relative_filename} in ${pkg.name}`);
    FS.writeFileSync(
      Path.join(root_dir, file.crochet_file.relative_filename),
      output
    );
    await build_crochet(root_dir, file.crochet_file, pkg);
  }
}

export async function build_crochet(
  root_dir: string,
  file: Package.ResolvedFile,
  pkg: Package.ResolvedPackage
) {
  const source = FS.readFileSync(
    Path.join(root_dir, file.relative_filename),
    "utf-8"
  );
  if (is_crochet_up_to_date(root_dir, file, source)) {
    return;
  }
  logger.debug(`Compiling ${file.relative_filename} in ${pkg.name}`);
  await compile_crochet(root_dir, file, source);
}

export async function compile_crochet(
  root_dir: string,
  file: Package.ResolvedFile,
  source: string
) {
  const target = Path.join(root_dir, file.relative_binary_image);
  FS.mkdirSync(Path.dirname(target), { recursive: true });
  const ast = Compiler.parse(source, file.relative_filename);
  const program = Compiler.lower_to_ir(file.relative_filename, source, ast);
  // FIXME: actually use file streams...
  const stream = new Binary.BufferedWriter();
  BinaryEnc.encode_program(program, stream);
  FS.writeFileSync(target, stream.collect());
}

function is_crochet_up_to_date(
  root_dir: string,
  file: Package.ResolvedFile,
  source: string
) {
  if (!FS.existsSync(Path.join(root_dir, file.relative_binary_image))) {
    return false;
  }
  const bin = FS.readFileSync(Path.join(root_dir, file.relative_binary_image));
  const header = Binary.decode_header(bin);
  if (is_up_to_date(bin, source)) {
    logger.debug(`Skipping ${file} (already up-to-date)`);
    logger.debug(
      `--- (version ${header.version}, hash ${header.hash.toString("hex")})`
    );
    return true;
  } else {
    return false;
  }
}

function is_up_to_date(buffer: Buffer, source: string) {
  const current_hash = hash_file(source);
  const { version, hash } = Binary.decode_header(buffer);

  return (
    version === Binary.VERSION &&
    hash.toString("hex") === current_hash.toString("hex")
  );
}

export async function read_updated_binary(
  root_dir: string,
  file: Package.ResolvedFile,
  pkg: Package.ResolvedPackage
): Promise<Buffer> {
  const target = Path.join(root_dir, file.relative_binary_image);
  if (!FS.existsSync(target)) {
    await build_file(root_dir, file, pkg);
    return read_updated_binary(root_dir, file, pkg);
  }

  const buffer = FS.readFileSync(target);
  const source = FS.readFileSync(
    Path.join(root_dir, file.crochet_file.relative_filename),
    "utf-8"
  );
  if (is_up_to_date(buffer, source)) {
    return buffer;
  } else {
    await compile_crochet(root_dir, file, source);
    return read_updated_binary(root_dir, file, pkg);
  }
}
