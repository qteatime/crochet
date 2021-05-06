import * as FS from "fs";
import * as Path from "path";
import * as Assert from "assert";
import { inspect } from "util";

import * as Compiler from "../../compiler";
import * as Binary from "../../binary-serialisation";
import * as Package from "../../pkg";
import { logger } from "../../utils/logger";

const pkgRoot = Path.join(__dirname, "../../../stdlib");
const packages = FS.readdirSync(pkgRoot)
  .filter((x) => FS.statSync(Path.join(pkgRoot, x)).isDirectory())
  .map((x) => {
    const file = Path.join(pkgRoot, x, "crochet.json");
    return { file, data: JSON.parse(FS.readFileSync(file, "utf-8")) };
  })
  .map(
    ({ file, data }) =>
      new Package.ResolvedPackage(
        Package.parse(data, file),
        Package.target_any()
      )
  );

console.log("Serialisation tests");

for (const pkg of packages) {
  console.log(`In package ${pkg.name}`);
  for (const source of pkg.sources) {
    if (source.extension === ".crochet") {
      console.log(`  - ${source.relative_filename}`);
      const crochet_source = FS.readFileSync(source.absolute_filename, "utf-8");
      const ast = Compiler.parse(crochet_source, source.relative_filename);
      const program = Compiler.lower_to_ir(
        source.relative_filename,
        crochet_source,
        ast
      );

      const writer = new Binary.BufferedWriter();
      Binary.encode_program(program, writer);

      if (logger.verbose) {
        FS.writeFileSync(
          "original-ir.txt",
          inspect(program, false, null, false)
        );
      }
      logger.debug("---");

      const buffer = writer.collect();
      const decoded_program = Binary.decode_program(buffer);
      if (logger.verbose) {
        FS.writeFileSync(
          "decoded-ir.txt",
          inspect(decoded_program, false, null, false)
        );
      }

      try {
        Assert.deepStrictEqual(decoded_program, program);
      } catch (error) {
        console.error(error.message);
        process.exit(1);
      }
    }
  }
}
