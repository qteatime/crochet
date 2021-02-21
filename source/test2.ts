import * as rt from "./runtime";
import { cvalue } from "./runtime";
import { World } from "./runtime/world";
import { show } from "./utils/utils";
import { parse } from "./compiler";
import { compileProgram } from "./compiler/compiler";
import { ForeignInterface } from "./runtime/world/foreign";

const programStr = `
% crochet

relation Who* at: Where;
relation Who* likes: Whom*;

predicate Who kisses: Whom at: Where {
  when Who at: Where, Whom at: Where, Who likes: Whom;
}

command What id {
  What;
}

command (X is #integer) hello {
  "hello integer" id;
}

command (X is #text) hello {
  "hello text" id;
}

do {
  fact "Lielle" at: "foyer";
  fact "Kristine" at: "foyer";
  fact "Lielle" likes: "Kristine";
  let X = search "Lielle" kisses: Who at: Where;
  "Lielle" hello;
}
`;

function parse1(x: string) {
  try {
    return parse(x);
  } catch (e) {
    console.error(`---\nFailed to parse\n\n${e.message}`);
    process.exit(1);
  }
}

const ast = parse1(programStr);
console.log(show(ast));

const ir = compileProgram(ast);
const world2 = new World(new ForeignInterface());
world2.load_declarations(ir);
world2.run().then((result) => {
  console.log(">>>", show(world2));
  console.log(">>>", show(cvalue(result).to_js()));
  debugger;
});
