import * as Path from "path";
import * as FS from "fs";
import * as Binary from "../../binary-serialisation";
import * as Compiler from "../../compiler";
import * as Package from "../../pkg";
import { execFileSync } from "child_process";
import { logger } from "../../utils/logger";

const rootRelative = process.env.WEBPACK ? "" : "../../../";
const linguaPath = Path.join(__dirname, rootRelative, "tools/lingua.js");

export async function build(pkg: Package.ResolvedPackage) {
  for (const file of pkg.sources) {
    await build_file(file, pkg);
  }
}

export async function build_file(
  file: Package.ResolvedFile,
  pkg: Package.ResolvedPackage
) {
  switch (file.extension) {
    case ".lingua":
      await build_lingua(file, pkg);
      break;

    case ".crochet":
      await build_crochet(file, pkg);
      break;

    default:
      throw new Error(`Unsupported file ${file.relative_filename}`);
  }
}

export async function build_lingua(
  file: Package.ResolvedFile,
  pkg: Package.ResolvedPackage
) {
  logger.debug(`Compiling ${file.relative_filename} in ${pkg.name}`);
  const output = execFileSync("node", [
    linguaPath,
    file.absolute_filename,
    "crochet",
  ]);
  FS.writeFileSync(file.crochet_file.absolute_filename, output);
  await build_crochet(file.crochet_file, pkg);
}

export async function build_crochet(
  file: Package.ResolvedFile,
  pkg: Package.ResolvedPackage
) {
  const source = FS.readFileSync(file.absolute_filename, "utf-8");
  if (is_crochet_up_to_date(file, source)) {
    return;
  }
  logger.debug(`Compiling ${file.relative_filename} in ${pkg.name}`);
  await compile_crochet(file, source);
}

export async function compile_crochet(
  file: Package.ResolvedFile,
  source: string
) {
  FS.mkdirSync(Path.dirname(file.binary_image), { recursive: true });
  const ast = Compiler.parse(source, file.relative_filename);
  const program = Compiler.lower_to_ir(file.relative_filename, source, ast);
  // FIXME: actually use file streams...
  const stream = new Binary.BufferedWriter();
  Binary.encode_program(program, stream);
  FS.writeFileSync(file.binary_image, stream.collect());
}

function is_crochet_up_to_date(file: Package.ResolvedFile, source: string) {
  if (!FS.existsSync(file.binary_image)) {
    return false;
  }
  const bin = FS.readFileSync(file.binary_image);
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
  const current_hash = Binary.hash_file(source);
  const { version, hash } = Binary.decode_header(buffer);

  return (
    version === Binary.VERSION &&
    hash.toString("hex") === current_hash.toString("hex")
  );
}

export async function read_updated_binary(
  file: Package.ResolvedFile,
  pkg: Package.ResolvedPackage
): Promise<Buffer> {
  if (!FS.existsSync(file.binary_image)) {
    await build_file(file, pkg);
    return read_updated_binary(file, pkg);
  }

  const buffer = FS.readFileSync(file.binary_image);
  const source = FS.readFileSync(file.crochet_file.absolute_filename, "utf-8");
  if (is_up_to_date(buffer, source)) {
    return buffer;
  } else {
    await compile_crochet(file, source);
    return read_updated_binary(file, pkg);
  }
}
