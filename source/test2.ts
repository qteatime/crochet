import * as rt from "./runtime";
import {
  bfalse,
  CrochetInstance,
  CrochetInteger,
  cvalue,
  State,
} from "./runtime";
import { Environment, World } from "./runtime/world";
import { show } from "./utils/utils";
import { parse } from "./compiler";
import { compileProgram } from "./compiler/compiler";
import { ForeignInterface } from "./runtime/world/foreign";
import * as Stdlib from "./stdlib";

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
    const world = new World();
    const state = State.root(world);
    await Stdlib.load(state);

    const ast = parse(programStr);
    // console.log(show(ast));

    const ir = compileProgram(ast);
    world.ffi.add("show", async function* (state, x) {
      console.log("[SHOW]", x.to_text());
      return bfalse;
    });

    await world.load_declarations(ir, state.env);

    const result = await world.run("main");
    console.log(">>>", show(cvalue(result).to_js()));
    debugger;
  } catch (e) {
    console.error(e.stack);
    process.exit(1);
  }
})();
