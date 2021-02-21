import * as rt from "./runtime";
import { cvalue } from "./runtime";
import { World } from "./runtime/world";
import { show } from "./utils/utils";
import { parse } from "./compiler";
import { compileProgram } from "./compiler/compiler";
import { ForeignInterface } from "./runtime/world/foreign";

const programStr = `
% crochet

role actor;
role room;

singleton type lielle :: actor;
singleton type kristine :: actor;

singleton type foyer :: room;

relation Who* at: Where;
relation Who* likes: Whom*;

predicate Who kisses: Whom at: Where {
  when Who at: Where, Whom at: Where, Who likes: Whom;
}

command What id {
  What;
}

command (X is integer) hello {
  "hello integer" id;
}

command (X is lielle) hello {
  "Lielle" id;
}

do {
  fact lielle at: foyer;
  fact kristine at: foyer;
  fact lielle likes: kristine;
  let X = search lielle kisses: (Who :: actor) at: (Where :: room);
  lielle hello;
}
`;

void (async function main() {
  try {
    const ast = parse(programStr);
    console.log(show(ast));

    const ir = compileProgram(ast);
    const world2 = new World(new ForeignInterface());
    world2.add_type("integer", rt.tInteger);
    world2.add_type("text", rt.tText);
    await world2.load_declarations(ir);
    const result = await world2.run();
    console.log(">>>", show(world2));
    console.log(">>>", show(cvalue(result).to_js()));
    debugger;
  } catch (e) {
    console.error(e.stack);
    process.exit(1);
  }
})();
