import * as rt from "./runtime";
import { bfalse, cvalue } from "./runtime";
import { World } from "./runtime/world";
import { show } from "./utils/utils";
import { parse } from "./compiler";
import { compileProgram } from "./compiler/compiler";
import { ForeignInterface } from "./runtime/world/foreign";

const programStr = `
% crochet

role actor;
role room;

command X show = show(X);
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
relation Who* disabled;

predicate Who kisses: Whom at: Where {
  when Who at: Where, Whom at: Where, Who likes: Whom;
}

do {
  let Kisses = search lielle kisses: (Who :: actor) at: (Where :: room);
  [
    Hello -> [
      (lielle hello as stream) as stream,
      kristine hello as unknown,
      1 hello as any
    ],
    Search -> Kisses,
  ] show;
}

scene main {
  "Hello" show;
  simulate for [kristine, lielle] until action quiescence;
  call one;
  goto two;
  "End" show;
}

scene one {
  "One" show;
  call two;
  "One end" show;
}

scene two {
  "Two" show;
}

action "Hello"
when X at: P, Y at: P, not X disabled if X =/= Y {
  [X, "says hello to", Y] show;
  fact X disabled;
}

when X at: foyer, not X disabled {
  [X, "is at the foyer and ready to act"] show;
}
`;

void (async function main() {
  try {
    const ast = parse(programStr);
    // console.log(show(ast));

    const ir = compileProgram(ast);
    const world2 = new World();
    world2.types.add("integer", rt.tInteger);
    world2.types.add("text", rt.tText);
    world2.types.add("stream", rt.tStream);
    world2.types.add("unknown", rt.tUnknown);
    world2.types.add("any", rt.tAny);
    world2.ffi.add("show", async function* (world, env, x) {
      console.log("[SHOW]", show(cvalue(x).to_js()));
      return bfalse;
    });
    await world2.load_declarations(ir);
    const result = await world2.run("main");
    // console.log(">>>", show(world2));
    console.log(">>>", show(cvalue(result).to_js()));
    debugger;
  } catch (e) {
    console.error(e.stack);
    process.exit(1);
  }
})();
