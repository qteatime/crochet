import * as FS from "fs";
import * as Path from "path";
import * as Assert from "assert";

import * as Compiler from "../../compiler";

const fixtureRoot = Path.join(__dirname, "../../../tests/parsing");
const failFixture = Path.join(fixtureRoot, "fail");

console.log("==== Failing parsing tests ===================");
const failFiles = FS.readdirSync(failFixture);

for (const file of failFiles) {
  console.log(`* Testing ${file}`);
  const filename = Path.join(failFixture, file);
  const source = FS.readFileSync(filename, "utf-8");
  try {
    const ast = Compiler.parse(source, filename);
    Assert.fail(`${file} parsed successfully, but it should not have`);
  } catch (error) {
    // ok;
  }
}
