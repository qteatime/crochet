import { task, logger, tscTask, series } from "just-scripts";
import { execSync } from "child_process";
import * as FS from "fs";
import * as Path from "path";

function compile_crochet(filename: string, source: string) {
  return `export default ${JSON.stringify({
    filename: `builtin ${filename}`,
    source,
  })}`;
}

task("build-stdlib", () => {
  const source_dir = Path.join(__dirname, "stdlib");
  const target_dir = Path.join(__dirname, "source/stdlib/generated");
  for (const file of FS.readdirSync(source_dir)) {
    const source = FS.readFileSync(Path.join(source_dir, file), "utf-8");
    const target = Path.join(target_dir, file + ".ts");
    FS.writeFileSync(target, compile_crochet(Path.basename(file), source));
    logger.info(`Generated ${file}`);
  }
});

task("build-grammar", () => {
  execSync(
    `./node_modules/.bin/lingua source/grammar/crochet.lingua > source/generated/crochet-grammar.ts`
  );
});

task("build-ts", tscTask());

task("build-targets", () => {
  execSync(`./node_modules/.bin/webpack`);
});

task("build-web", () => {
  execSync(
    ` ./node_modules/.bin/browserify -e build/targets/web.js -o www/crochet.js`
  );
});

task(
  "build",
  series(
    "build-grammar",
    "build-stdlib",
    "build-ts",
    "build-targets",
    "build-web"
  )
);
