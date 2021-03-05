import { task, logger, tscTask, series } from "just-scripts";
import { execSync } from "child_process";
import * as FS from "fs";
import * as Path from "path";

function compile_crochet(source: string) {
  return `export default ${JSON.stringify(source)}`;
}

task("build-stdlib", () => {
  const source_dir = Path.join(__dirname, "stdlib");
  const target_dir = Path.join(__dirname, "source/stdlib/generated");
  for (const file of FS.readdirSync(source_dir)) {
    const source = FS.readFileSync(Path.join(source_dir, file), "utf-8");
    const target = Path.join(target_dir, file + ".ts");
    FS.writeFileSync(target, compile_crochet(source));
    logger.info(`Generated ${file}`);
  }
});

task("build-grammar", () => {
  execSync(
    `node ./Linguist/dist/app.js source/grammar/crochet.lingua > source/generated/crochet-grammar.ts`
  );
});

task("build-ts", tscTask());

task("build", series("build-grammar", "build-stdlib", "build-ts"));
