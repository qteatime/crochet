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

command (X is integer) hello { "Numbers can't say anything, miss..."; }

singleton type lielle :: actor {
  at: foyer;
  likes: kristine;

  command hello {
    "Lielle: hello!";
  }
}

singleton type kristine :: actor {
  at: foyer;

  command hello {
    "Kristine: hi.";
  }
}

singleton type foyer :: room;

relation Who* at: Where;
relation Who* likes: Whom*;

predicate Who kisses: Whom at: Where {
  when Who at: Where, Whom at: Where, Who likes: Whom;
}

do {
  let Kisses = search lielle kisses: (Who :: actor) at: (Where :: room);
  [
    Hello -> [lielle hello, kristine hello, 1 hello],
    Search -> Kisses,
  ];
}
`;

void (async function main() {
  try {
    const ast = parse(programStr);
    console.log(show(ast));

    const ir = compileProgram(ast);
    const world2 = new World();
    world2.types.add("integer", rt.tInteger);
    world2.types.add("text", rt.tText);
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
