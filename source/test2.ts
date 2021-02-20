import * as rt from "./runtime";
import { CrochetText, Environment, run, UnificationEnvironment } from "./runtime";
import { ESearch, EText } from "./runtime/ir/expression";
import { SBlock, SFact, SReturn } from "./runtime/ir/statement";
import { World } from "./runtime/world";

function to_js(x: UnificationEnvironment) {
  const bindings = x.boundValues;
  const result = new Map();
  for (const [k, v] of bindings) {
    result.set(k, v.to_js());
  }
  return result;
}

const db = new rt.Database();
const likes = new rt.ConcreteRelation(
  "likes",
  new rt.TTMany(new rt.TTMany(new rt.TTEnd())).realise()
);
const at = new rt.ConcreteRelation(
  "at",
  new rt.TTMany(new rt.TTOne(new rt.TTEnd())).realise()
);
const kiss = new rt.PredicateProcedure(
  "kiss",
  ["Who", "Whom", "Where"],
  [
    new rt.PredicateClause(
      new rt.Predicate(
        [
          new rt.Relation("at", [
            new rt.VariablePattern("Who"),
            new rt.VariablePattern("Where"),
          ]),
          new rt.Relation("at", [
            new rt.VariablePattern("Whom"),
            new rt.VariablePattern("Where"),
          ]),
          new rt.Relation("likes", [
            new rt.VariablePattern("Who"),
            new rt.VariablePattern("Whom"),
          ]),
        ],
        new rt.Constraint.True()
      ),
      new rt.Effect.Trivial()
    ),

    new rt.PredicateClause(
      new rt.Predicate(
        [
          new rt.Relation("at", [
            new rt.VariablePattern("Who"),
            new rt.VariablePattern("Where"),
          ]),
          new rt.Relation("at", [
            new rt.VariablePattern("Whom"),
            new rt.VariablePattern("Where"),
          ]),
          new rt.Relation("likes", [
            new rt.VariablePattern("Whom"),
            new rt.VariablePattern("Who"),
          ]),
        ],
        new rt.Constraint.True()
      ),
      new rt.Effect.Trivial()
    ),
  ]
);

db.add("at", at);
db.add("likes", likes);
db.add("kiss", kiss);

at.tree.insert([new rt.CrochetText("Lielle"), new rt.CrochetText("foyer")]);
at.tree.insert([new rt.CrochetText("Kristine"), new rt.CrochetText("foyer")]);
likes.tree.insert([
  new rt.CrochetText("Lielle"),
  new rt.CrochetText("Kristine"),
]);

const pred = new rt.Predicate(
  [
    new rt.Relation("kiss", [
      new rt.ValuePattern(new rt.CrochetText("Lielle")),
      new rt.VariablePattern("Who"),
      new rt.VariablePattern("Where")
    ]),
  ],
  new rt.Constraint.True()
)

const result = db.search(pred).map(x => to_js(x));

console.log(result);


const world = new World();
const env = new Environment(null, world);

world.add_relation("at", at.tree.type);
world.add_relation("likes", likes.tree.type);
world.add_predicate("kiss", kiss);

const Program = new SBlock([
  new SFact("at", [new EText("Lielle"), new EText("foyer")]),
  new SFact("at", [new EText("Kristine"), new EText("foyer")]),
  new SFact("likes", [new EText("Lielle"), new EText("Kristine")]),
  new SReturn(new ESearch(pred))
])

run(Program.evaluate(world, env)).then(result => {
  console.log(">>>", world);
  console.log(">>>", result.to_js());
  debugger;
})