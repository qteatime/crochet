import * as rt from "./runtime";
import { bfalse, CrochetInstance, CrochetInteger, cvalue } from "./runtime";
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
  let Multi = "This is
               a multiline
          text alright
                  a bit weird tho";
  [
    Hello -> [
      (lielle hello as stream) as stream,
      kristine hello as unknown,
      1 hello as any
    ],
    Search -> Kisses,
  ];
  Multi show;
}

scene one {
  "One" show;
  call two;
  "One end" show;
}

scene two {
  "Two" show;
}

scene main {
  "Hello" show;
  simulate for [kristine, lielle] until action quiescence;
  call one;
  goto two;
  "End" show;
}

action "Say hello"
when X simulate-turn, not X disabled, X at: P, Y at: P if X =/= Y {
  [X, "says hello to", Y] show;
  ["Stats", search Turn simulate-turn, Rounds simulate-rounds-elapsed] show;
  ["Acted", search X simulate-acted] show;
  ["Remaining", (search X simulate-actor, not X simulate-acted, not X simulate-turn)] show;
  fact X disabled;
}

when X simulate-turn {
  [X, "ends her turn"] show;
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
      console.log("[SHOW]", cvalue(x).to_text());
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
