import * as FS from "fs";
import * as Path from "path";

import * as Compiler from "../../compiler";
import * as Binary from "../../binary-serialisation";
import { AnyTarget, CrochetPackage } from "../../runtime";
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

function mb(x: number) {
  return `${(x / 1024 / 1024).toFixed(3)}MB`;
}

function snapshot(x: NodeJS.MemoryUsage | null) {
  const y = process.memoryUsage();
  if (x == null) {
    return y;
  } else if (
    x.heapTotal > y.heapTotal &&
    x.heapUsed > y.heapUsed &&
    x.rss > y.rss
  ) {
    return x;
  } else {
    return y;
  }
}

function load_all(
  parse: (absolute: string, relative: string, binary: string) => void
) {
  global.gc?.();
  let mem: NodeJS.MemoryUsage | null = null;
  const start = new Date().getTime();
  for (const pkg of packages) {
    for (const file of pkg.sources) {
      parse(file, pkg.relative_filename(file), pkg.binary_image(file));
      mem = snapshot(mem);
    }
  }
  const end = new Date().getTime();
  const total = end - start;
  console.log(`--> Total: ${total}ms`);
  const end_memory = snapshot(mem);
  console.log(
    `--> Memory: Used ${mb(end_memory.heapUsed)} | Total ${mb(
      end_memory.heapTotal
    )} | RSS ${mb(end_memory.rss)}`
  );
  console.log("---");
}

console.log(`# Parsing benchmark`);
console.log(`---`);

console.log(":: Parsing from source");
load_all((file, rel, _bin) => {
  const source = FS.readFileSync(file, "utf-8");
  const ast = Compiler.parse(source, rel);
  const program = Compiler.lowerToIR(rel, source, ast);
});

console.log(":: Parsing from binary");
load_all((file, rel, bin) => {
  const source = FS.readFileSync(file, "utf-8");
  const binary = FS.readFileSync(bin);
  const header = Binary.decode_header(binary);
  const hash = Binary.hash_file(source);
  if (header.hash.toString("hex") !== hash.toString("hex")) {
    throw new Error(`Outdated file ${file}`);
  }
  const program = Binary.decode_program(binary);
});
