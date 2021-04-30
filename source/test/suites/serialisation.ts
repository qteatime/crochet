import * as FS from "fs";
import * as Path from "path";
import * as Assert from "assert";
import { inspect } from "util";

import * as Compiler from "../../compiler";
import * as Binary from "../../binary-serialisation";
import { AnyTarget, CrochetPackage } from "../../runtime";
import * as IR from "../../ir";
import { logger } from "../../utils";

const pkgRoot = Path.join(__dirname, "../../../stdlib");
const packages = FS.readdirSync(pkgRoot)
  .filter((x) => FS.statSync(Path.join(pkgRoot, x)).isDirectory())
  .map((x) => {
    const file = Path.join(pkgRoot, x, "crochet.json");
    return { file, data: JSON.parse(FS.readFileSync(file, "utf-8")) };
  })
  .map(({ file, data }) =>
    CrochetPackage.parse(data, file).restricted_to(new AnyTarget())
  );

console.log("Serialisation tests");

for (const pkg of packages) {
  console.log(`In package ${pkg.name}`);
  for (const source of pkg.sources) {
    if (Path.extname(source) === ".crochet") {
      console.log(`  - ${pkg.relative_filename(source)}`);
      const crochet_source = FS.readFileSync(source, "utf-8");
      const ast = Compiler.parse(crochet_source, source);
      const program = Compiler.lowerToIR(
        pkg.relative_filename(source),
        crochet_source,
        ast
      );

      const writer = new Binary.BufferedWriter();
      Binary.encode_program(program, writer);

      FS.writeFileSync("original-ir.txt", inspect(program, false, null, false));
      logger.debug("---");

      const buffer = writer.collect();
      const decoded_program = Binary.decode_program(buffer);
      FS.writeFileSync(
        "decoded-ir.txt",
        inspect(decoded_program, false, null, false)
      );

      try {
        Assert.deepStrictEqual(decoded_program, program);
      } catch (error) {
        console.error(error.message);
        process.exit(1);
      }
    }
  }
}
