import * as FS from "fs";
import * as Path from "path";

export const files = [
  "core.crochet",
  "integer.crochet",
  "record.crochet",
  "stream.crochet",
  "text.crochet",
].map((x) => [
  x,
  FS.readFileSync(Path.join(__dirname, "../../stdlib", x), "utf8"),
]);
