import * as rt from "./runtime";
import { btrue, CrochetText, Environment, run, UnificationEnvironment } from "./runtime";
import { EVariable, ESearch, EText } from "./runtime/ir/expression";
import { SBlock, SExpression, SFact, SLet, SReturn } from "./runtime/ir/statement";
import { World } from "./runtime/world";
import { show } from "./utils/utils";
import { parse } from "./compiler";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import { compileProgram } from "./compiler/compiler";

function to_js(x: UnificationEnvironment) {
  const bindings = x.boundValues;
  const result = new Map();
  for (const [k, v] of bindings) {
    result.set(k, v.to_js());
  }
  return result;
}

// const db = new rt.Database();
// const likes = new rt.ConcreteRelation(
//   "likes",
//   new rt.TTMany(new rt.TTMany(new rt.TTEnd())).realise()
// );
// const at = new rt.ConcreteRelation(
//   "at",
//   new rt.TTMany(new rt.TTOne(new rt.TTEnd())).realise()
// );
// const kiss = new rt.PredicateProcedure(
//   "kiss",
//   ["Who", "Whom", "Where"],
//   [
//     new rt.PredicateClause(
//       new rt.Predicate(
//         [
//           new rt.Relation("at", [
//             new rt.VariablePattern("Who"),
//             new rt.VariablePattern("Where"),
//           ]),
//           new rt.Relation("at", [
//             new rt.VariablePattern("Whom"),
//             new rt.VariablePattern("Where"),
//           ]),
//           new rt.Relation("likes", [
//             new rt.VariablePattern("Who"),
//             new rt.VariablePattern("Whom"),
//           ]),
//         ],
//         new rt.Constraint.Value(btrue)
//       ),
//       new rt.Effect.Trivial()
//     ),

//     new rt.PredicateClause(
//       new rt.Predicate(
//         [
//           new rt.Relation("at", [
//             new rt.VariablePattern("Who"),
//             new rt.VariablePattern("Where"),
//           ]),
//           new rt.Relation("at", [
//             new rt.VariablePattern("Whom"),
//             new rt.VariablePattern("Where"),
//           ]),
//           new rt.Relation("likes", [
//             new rt.VariablePattern("Whom"),
//             new rt.VariablePattern("Who"),
//           ]),
//         ],
//         new rt.Constraint.Value(btrue)
//       ),
//       new rt.Effect.Trivial()
//     ),
//   ]
// );

// db.add("at", at);
// db.add("likes", likes);
// db.add("kiss", kiss);

// at.tree.insert([new rt.CrochetText("Lielle"), new rt.CrochetText("foyer")]);
// at.tree.insert([new rt.CrochetText("Kristine"), new rt.CrochetText("foyer")]);
// likes.tree.insert([
//   new rt.CrochetText("Lielle"),
//   new rt.CrochetText("Kristine"),
// ]);

// const pred = new rt.Predicate(
//   [
//     new rt.Relation("kiss", [
//       new rt.ValuePattern(new rt.CrochetText("Lielle")),
//       new rt.VariablePattern("Who"),
//       new rt.VariablePattern("Where")
//     ]),
//   ],
//   new rt.Constraint.Value(btrue)
// )

// const result = db.search(pred).map(x => to_js(x));

// console.log(show(result));


// const world = new World();
// const env = new Environment(null, world);

// world.add_relation("at", at.tree.type);
// world.add_relation("likes", likes.tree.type);
// world.add_predicate("kiss", kiss);

// const Program = new SBlock([
//   new SLet("X", new EText("Hello")),
//   new SExpression(new EVariable("X")),
//   new SFact("at", [new EText("Lielle"), new EText("foyer")]),
//   new SFact("at", [new EText("Kristine"), new EText("foyer")]),
//   new SFact("likes", [new EText("Lielle"), new EText("Kristine")]),
//   new SReturn(new ESearch(pred))
// ])

// run(Program.evaluate(world, env)).then(result => {
//   console.log(">>>", show(world));
//   console.log(">>>", show(result.to_js()));
//   debugger;
// })

const programStr = `
% crochet

relation Who* at: Where;
relation Who* likes: Whom*;

predicate Who kisses: Whom at: Where {
  when Who at: Where, Whom at: Where, Who likes: Whom;
}

do {
  fact "Lielle" at: "foyer";
  fact "Kristine" at: "foyer";
  fact "Lielle" likes: "Kristine";
  let X = search "Lielle" kisses: Who at: Where;
  return X;
}
`

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
const world2 = new World();
world2.load_declarations(ir);
world2.run().then(result => {
  console.log(">>>", show(world2));
  console.log(">>>", show(result?.to_js()));
  debugger;  
})