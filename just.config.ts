import { task, logger, tscTask, series } from "just-scripts";
import { execSync } from "child_process";
import * as FS from "fs";
import * as Path from "path";

task("build-grammar", () => {
  execSync(
    `node tools/lingua.js source/grammar/crochet.lingua > source/generated/crochet-grammar.ts`
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
  "test",
  series("build-ts", () => {
    require("./build/test/suites/serialisation");
  })
);

task("build", series("build-grammar", "build-ts"));
