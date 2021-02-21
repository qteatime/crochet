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

singleton type lielle :: actor {
  at: foyer;
  likes: kristine;

  command hello {
    "Hello, world from Lielle";
  }
}

singleton type kristine :: actor {
  at: foyer;
}

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

do {
  let X = search lielle kisses: (Who :: actor) at: (Where :: room);
  [ Hello -> lielle hello,
    Integer -> [1 hello, 2 id],
    Search -> X,
  ];
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
