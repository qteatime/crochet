import {
  Declaration,
  Expression,
  Literal,
  Meta,
  Name,
  Namespace,
  Parameter,
  PartialSignature,
  Pattern,
  Predicate,
  PredicateClause,
  PredicateEffect,
  Program,
  RelationPart,
  Signature,
  Statement,
  TypeApp,
  TypeDef,
  TypeInit,
  String,
  SimulationGoal,
  InterpolationPart,
  Pair,
  Signal,
  MatchSearchCase,
  RecordField,
  Interpolation,
  Rank,
  SimulationContext,
  ForExpression,
  SamplingPool,
  ConditionCase,
  TrailingTest,
  Contract,
  ContractCondition,
} from "../generated/crochet-grammar";
import * as rt from "../runtime";
import { CrochetInteger } from "../runtime";
import * as IR from "../runtime/ir";
import {
  EFloat,
  generated_node,
  Interval,
  SimpleInterpolation,
  TNamed,
} from "../runtime/ir";
import * as Logic from "../runtime/logic";
import * as Sim from "../runtime/simulation";
import { cast, gen, unreachable } from "../utils/utils";

export enum DeclarationLocality {
  LOCAL,
  PUBLIC,
}

// -- Utilities
function parseInteger(x: string): bigint {
  return BigInt(x.replace(/_/g, ""));
}

function parseNumber(x: string): number {
  return Number(x.replace(/_/g, ""));
}

function parseString(x: String): string {
  const column = x.pos.position.column + 1;
  const indent = new RegExp(`^\\s{0,${column}}`);
  const text = x.text
    .split(/\\r\\n|\\n|\r\n|\r|\n/)
    .map((x) => {
      return x.replace(indent, "");
    })
    .join("\\n");

  return JSON.parse(text);
}

export function compileMeta(x: Meta) {
  return new Interval(x);
}

export function literalToValue(lit: Literal) {
  return lit.match<rt.CrochetValue>({
    False(_) {
      return rt.False.instance;
    },

    True(_) {
      return rt.True.instance;
    },

    Nothing(_) {
      return rt.CrochetNothing.instance;
    },

    Text(_, value) {
      return new rt.CrochetText(parseString(value));
    },

    Integer(_, digits) {
      return new rt.CrochetInteger(parseInteger(digits));
    },

    Float(_, digits) {
      return new rt.CrochetFloat(parseNumber(digits));
    },
  });
}

export function signatureName(sig: Signature<any>): string {
  return sig.match({
    Keyword(_meta, _self, pairs) {
      const names = pairs.map((x) => x.key.name);
      return `_ ${names.join("")}`;
    },

    KeywordSelfless(_meta, pairs) {
      const names = pairs.map((x) => x.key.name);
      return names.join("");
    },

    Unary(_meta, _self, name) {
      return `_ ${name.name}`;
    },

    Binary(_meta, op, _l, _r) {
      return `_ ${op.name} _`;
    },
  });
}

export function signatureValues<T>(sig: Signature<T>): T[] {
  return sig.match({
    Keyword(_meta, self, pairs) {
      return [self, ...pairs.map((x) => x.value)];
    },

    KeywordSelfless(_meta, pairs) {
      return pairs.map((x) => x.value);
    },

    Unary(_meta, self, _name) {
      return [self];
    },

    Binary(_meta, _op, l, r) {
      return [l, r];
    },
  });
}

export function compileNamespace(x: Namespace) {
  return x.names.join(".");
}

function compileLocality(x: DeclarationLocality) {
  switch (x) {
    case DeclarationLocality.LOCAL:
      return true;
    case DeclarationLocality.PUBLIC:
      return false;
    default:
      throw unreachable(x, "Locality");
  }
}

// -- Logic
export function compileRelationTypes(types: RelationPart[]): Logic.TreeType {
  return types.reduceRight((p, t) => {
    return t.match<Logic.TreeType>({
      Many(_meta, _name) {
        return new Logic.TTMany(p);
      },

      One(_meta, _name) {
        return new Logic.TTOne(p);
      },
    });
  }, new Logic.TTEnd() as Logic.TreeType);
}

export function compilePattern(p: Pattern): Logic.Pattern {
  return p.match<Logic.Pattern>({
    HasType(_, type, name) {
      return new Logic.TypePattern(compilePattern(name), compileTypeApp(type));
    },

    Lit(lit) {
      return new Logic.ValuePattern(literalToValue(lit));
    },

    Global(_, name) {
      return new Logic.GlobalPattern(name.name);
    },

    Self(_) {
      return new Logic.SelfPattern();
    },

    Variable(_, name) {
      return new Logic.VariablePattern(name.name);
    },

    Wildcard(_) {
      return new Logic.WildcardPattern();
    },
  });
}

export function compilePredicateEffect(eff: PredicateEffect) {
  return eff.match({
    Trivial() {
      return new Logic.Effect.Trivial();
    },
  });
}

export function compileSamplingPool(pool: SamplingPool): Logic.SamplingPool {
  return pool.match<Logic.SamplingPool>({
    Relation(_, signature) {
      return new Logic.SamplingRelation(
        signatureName(signature),
        signatureValues(signature).map(compilePattern)
      );
    },

    Type(_, name, type) {
      return new Logic.SamplingType(name.name, compileTypeApp(type));
    },
  });
}

export function compilePredicate(p: Predicate): Logic.Predicate {
  return p.match<Logic.Predicate>({
    And(_, l, r) {
      return new Logic.AndPredicate(compilePredicate(l), compilePredicate(r));
    },

    Or(_, l, r) {
      return new Logic.OrPredicate(compilePredicate(l), compilePredicate(r));
    },

    Not(_, p) {
      return new Logic.NotPredicate(compilePredicate(p));
    },

    Constrain(_, p, c) {
      return new Logic.ConstrainedPredicate(
        compilePredicate(p),
        compileExpression(c)
      );
    },

    Parens(_, p) {
      return compilePredicate(p);
    },

    Has(_, sig) {
      return new Logic.HasRelation(
        signatureName(sig),
        signatureValues(sig).map(compilePattern)
      );
    },

    Let(_, name, value) {
      return new Logic.LetPredicate(name.name, compileExpression(value));
    },

    Typed(_, name, typ) {
      return new Logic.TypePredicate(name.name, compileTypeApp(typ));
    },

    Sample(_, size0, pool) {
      const size = cast(literalToValue(size0), CrochetInteger);
      return new Logic.SamplePredicate(
        Number(size.value),
        compileSamplingPool(pool)
      );
    },

    Always(_) {
      return new Logic.AlwaysPredicate();
    },
  });
}

export function compilePredicateClause(p: PredicateClause) {
  return new Logic.PredicateClause(
    compilePredicate(p.predicate),
    compilePredicateEffect(p.effect)
  );
}

// -- Expression
export function literalToExpression(lit: Literal) {
  return lit.match<IR.Expression>({
    False(pos) {
      return new IR.EFalse(compileMeta(pos));
    },

    True(pos) {
      return new IR.ETrue(compileMeta(pos));
    },

    Nothing(pos) {
      return new IR.ENothing(compileMeta(pos));
    },

    Text(pos, value) {
      return new IR.EText(compileMeta(pos), parseString(value));
    },

    Integer(pos, digits) {
      return new IR.EInteger(compileMeta(pos), parseInteger(digits));
    },

    Float(pos, digits) {
      return new EFloat(compileMeta(pos), parseNumber(digits));
    },
  });
}

export function compileArgument(expr: Expression): IR.PartialExpr {
  if (expr instanceof Expression.Hole) {
    return new IR.EPartialHole();
  } else {
    return new IR.EPartialConcrete(compileExpression(expr));
  }
}

export function compileInterpolation<T, U>(
  value: Interpolation<T>,
  f: (_: T) => U
): IR.SimpleInterpolation<U> {
  return new SimpleInterpolation(
    value.parts.map((x) => compileInterpolationPart(x, f))
  ).optimise();
}

export function compileInterpolationPart<T, U>(
  part: InterpolationPart<T>,
  f: (_: T) => U
): IR.SimpleInterpolationPart<U> {
  return part.match<IR.SimpleInterpolationPart<U>>({
    Escape(_, c) {
      switch (c) {
        case "n":
          return new IR.SIPStatic("\n");
        case "r":
          return new IR.SIPStatic("\r");
        case "t":
          return new IR.SIPStatic("\t");
        default:
          return new IR.SIPStatic(c);
      }
    },

    Static(_, c) {
      return new IR.SIPStatic(c);
    },

    Dynamic(_, x) {
      return new IR.SIPDynamic(f(x));
    },
  });
}

export function compileMatchSearchCase(
  kase: MatchSearchCase
): IR.MatchSearchCase {
  return new IR.MatchSearchCase(
    compilePredicate(kase.predicate),
    new IR.SBlock(generated_node, kase.body.map(compileStatement))
  );
}

export function compileRecordField(field: RecordField): string {
  return field.match<string>({
    FName(x) {
      return x.name;
    },

    FText(x) {
      return parseString(x);
    },
  });
}

export function compileForExpression(expr: ForExpression): IR.ForallExpr {
  return expr.match<IR.ForallExpr>({
    Map(_, name, stream, body) {
      return new IR.ForallMap(
        name.name,
        compileExpression(stream),
        compileForExpression(body)
      );
    },

    If(_, cond, body) {
      return new IR.ForallIf(
        compileExpression(cond),
        compileForExpression(body)
      );
    },

    Do(_, body) {
      return new IR.ForallDo(compileExpression(body));
    },
  });
}

export function compileExpression(expr: Expression): IR.Expression {
  return expr.match<IR.Expression>({
    Search(pos, pred) {
      return new IR.ESearch(compileMeta(pos), compilePredicate(pred));
    },

    MatchSearch(pos, cases) {
      return new IR.EMatchSearch(
        compileMeta(pos),
        cases.map(compileMatchSearchCase)
      );
    },

    Invoke(pos, sig) {
      const name = signatureName(sig);
      const args = signatureValues(sig).map(compileArgument);
      const is_saturated = args.every((x) => x instanceof IR.EPartialConcrete);
      if (is_saturated) {
        return new IR.EInvoke(
          compileMeta(pos),
          name,
          args.map((x) => cast(x, IR.EPartialConcrete).expr)
        );
      } else {
        return new IR.EPartial(compileMeta(pos), name, args);
      }
    },

    Variable(pos, name) {
      return new IR.EVariable(compileMeta(pos), name.name);
    },

    Global(pos, name) {
      return new IR.EGlobal(compileMeta(pos), name.name);
    },

    Self(pos) {
      return new IR.ESelf(compileMeta(pos));
    },

    New(pos, type, values) {
      return new IR.ENew(
        compileMeta(pos),
        type.name,
        values.map(compileExpression)
      );
    },

    List(pos, values) {
      return new IR.EList(compileMeta(pos), values.map(compileExpression));
    },

    Record(pos, pairs) {
      return new IR.ERecord(
        compileMeta(pos),
        pairs.map((x) => ({
          key: compileRecordField(x.key),
          value: compileExpression(x.value),
        }))
      );
    },

    Cast(pos, type, value) {
      return new IR.ECast(
        compileMeta(pos),
        compileTypeApp(type),
        compileExpression(value)
      );
    },

    Project(pos, object, field) {
      return new IR.EProject(
        compileMeta(pos),
        compileExpression(object),
        compileRecordField(field)
      );
    },

    Select(pos, object, fields) {
      return new IR.EProjectMany(
        compileMeta(pos),
        compileExpression(object),
        fields.map((x) => ({
          key: compileRecordField(x.name),
          alias: compileRecordField(x.alias),
        }))
      );
    },

    Block(pos, body) {
      return new IR.EBlock(compileMeta(pos), body.map(compileStatement));
    },

    For(pos, body) {
      return new IR.EForall(compileMeta(pos), compileForExpression(body));
    },

    Apply(pos, partial, args) {
      return new IR.EApply(
        compileMeta(pos),
        compileExpression(partial),
        args.map(compileArgument)
      );
    },

    Interpolate(_, x) {
      return compileInterpolation(x, compileExpression).to_expression();
    },

    Pipe(pos, left, right) {
      return new IR.EApply(compileMeta(pos), compileExpression(right), [
        new IR.EPartialConcrete(compileExpression(left)),
      ]);
    },

    PipeInvoke(meta, left, sig0) {
      const sig = materialiseSignature(left, sig0);
      return compileExpression(new Expression.Invoke(meta, sig));
    },

    Condition(pos, cases) {
      return new IR.ECondition(
        compileMeta(pos),
        cases.map(
          (x) =>
            new IR.ConditionCase(
              compileExpression(x.guard),
              new IR.SBlock(compileMeta(x.pos), x.body.map(compileStatement))
            )
        )
      );
    },

    HasType(pos, value, type) {
      return new IR.EHasType(
        compileMeta(pos),
        compileExpression(value),
        compileTypeApp(type)
      );
    },

    Force(pos, value) {
      return new IR.EForce(compileMeta(pos), compileExpression(value));
    },

    Lazy(pos, value) {
      return new IR.ELazy(compileMeta(pos), compileExpression(value));
    },

    Hole(_) {
      throw new Error(`Hole found outside of function application.`);
    },

    Return(pos) {
      return new IR.EReturn(compileMeta(pos));
    },

    Type(pos, type) {
      return new IR.EStaticType(compileMeta(pos), compileTypeApp(type));
    },

    Lambda(pos, params, body) {
      return new IR.ELambda(
        compileMeta(pos),
        params.map((x) => x.name),
        compileExpression(body)
      );
    },

    IntrinsicEqual(pos, l, r) {
      return new IR.EIntrinsicEqual(
        compileMeta(pos),
        compileExpression(l),
        compileExpression(r)
      );
    },

    Parens(_, value) {
      return compileExpression(value);
    },

    Lit(lit) {
      return literalToExpression(lit);
    },
  });
}

// -- Statement
export function materialiseSignature<T>(
  self: T,
  signature: PartialSignature<T>
): Signature<T> {
  return signature.match<Signature<T>>({
    Unary(meta, name) {
      return new Signature.Unary(meta, self, name);
    },

    Binary(meta, op, right) {
      return new Signature.Binary(meta, op, self, right);
    },

    Keyword(meta, pairs) {
      return new Signature.Keyword(meta, self, pairs);
    },
  });
}

export function compileContractCondition(
  c: ContractCondition
): rt.ContractCondition {
  return new rt.ContractCondition(
    c.pos,
    c.name.name,
    compileExpression(c.expr)
  );
}

export function compileContractReturn(
  c: TypeApp | null
): rt.ContractCondition[] {
  if (c == null) {
    return [];
  } else {
    const pos = c.match({
      Any(p) {
        return p;
      },
      Named(p, _) {
        return p;
      },
      Static(p, _) {
        return p;
      },
    });
    return [
      new rt.ContractCondition(
        pos,
        "return-type",
        new rt.IR.EHasType(
          compileMeta(pos),
          new rt.IR.EReturn(compileMeta(pos)),
          compileTypeApp(c)
        )
      ),
    ];
  }
}

export function compileContract(c: Contract): rt.Contract {
  const ret = compileContractReturn(c.ret);

  return new rt.Contract(c.pre.map(compileContractCondition), [
    ...ret,
    ...c.post.map(compileContractCondition),
  ]);
}

export function compileTypeInit(
  meta: Meta,
  self: string,
  partialStmts: TypeInit[]
): IR.Declaration[] {
  const results = partialStmts.map((x) =>
    x.match<Statement | Declaration>({
      Fact(meta, sig0) {
        const self_expr: Expression = new Expression.Global(
          meta,
          new Name(meta, self)
        );
        const sig = materialiseSignature(self_expr, sig0);
        return new Statement.Fact(meta, sig);
      },

      Command(meta, sig0, contract, body, test) {
        const self_param: Parameter = new Parameter.TypedOnly(
          meta,
          new TypeApp.Named(meta, new Name(meta, self))
        );
        const sig = materialiseSignature(self_param, sig0);
        return new Declaration.Command(meta, sig, contract, body, test);
      },

      ForeignCommand(meta, sig0, contract, body, test) {
        const self_param: Parameter = new Parameter.TypedOnly(
          meta,
          new TypeApp.Named(meta, new Name(meta, self))
        );
        const sig = materialiseSignature(self_param, sig0);
        return new Declaration.ForeignCommand(meta, sig, contract, body, test);
      },
    })
  );

  const stmts = results.filter((x) => x instanceof Statement) as Statement[];
  const decls0 = results.filter(
    (x) => x instanceof Declaration
  ) as Declaration[];
  const decls = [...decls0, new Declaration.Do(meta, stmts)];
  return decls.flatMap(compileDeclaration);
}

export function compileSimulationGoal(goal: SimulationGoal): Sim.Goal {
  return goal.match<Sim.Goal>({
    ActionQuiescence(_) {
      return new Sim.ActionQuiescence();
    },

    EventQuiescence(_) {
      return new Sim.EventQuiescence();
    },

    TotalQuiescence(_) {
      return new Sim.TotalQuiescence();
    },

    CustomGoal(_, pred) {
      return new Sim.CustomGoal(compilePredicate(pred));
    },
  });
}

export function compileSignal(signal: Signal): rt.Signal {
  const name = signatureName(signal.signature);
  const parameters0 = signatureValues(signal.signature);
  const { parameters } = compileParameters(parameters0);
  return new rt.Signal(name, parameters, signal.body.map(compileStatement));
}

export function compileContext(context: SimulationContext): IR.SimulateContext {
  return context.match<IR.SimulateContext>({
    Global() {
      return new IR.SCAny();
    },

    Named(_, name) {
      return new IR.SCNamed(name.name);
    },
  });
}

export function compileStatement(stmt: Statement) {
  return stmt.match<IR.Statement>({
    Let(pos, name, value) {
      return new IR.SLet(compileMeta(pos), name.name, compileExpression(value));
    },

    Fact(pos, sig) {
      return new IR.SFact(
        compileMeta(pos),
        signatureName(sig),
        signatureValues(sig).map(compileExpression)
      );
    },

    Forget(pos, sig) {
      return new IR.SForget(
        compileMeta(pos),
        signatureName(sig),
        signatureValues(sig).map(compileExpression)
      );
    },

    Call(pos, name) {
      return new IR.SCall(compileMeta(pos), name.name);
    },

    Goto(pos, name) {
      return new IR.SGoto(compileMeta(pos), name.name);
    },

    Simulate(pos, actors, context, goal, signals) {
      return new IR.SSimulate(
        compileMeta(pos),
        compileContext(context),
        compileExpression(actors),
        compileSimulationGoal(goal),
        signals.map(compileSignal)
      );
    },

    Assert(pos, expr) {
      return new IR.SAssert(pos, compileExpression(expr));
    },

    Expr(value) {
      const expr = compileExpression(value);
      return new IR.SExpression(expr.position, expr);
    },
  });
}

// -- Declaration
export function compileTypeApp(x: TypeApp): IR.Type {
  return x.match<IR.Type>({
    Named(_, name) {
      return new IR.TNamed(name.name);
    },

    Static(_, type) {
      return new IR.TStatic(compileTypeApp(type));
    },

    Any(_) {
      return new IR.TAny();
    },
  });
}

export function compileParameter(x: Parameter) {
  return x.match<{ type: IR.Type; parameter: string }>({
    Typed(_, name, type) {
      return {
        type: compileTypeApp(type),
        parameter: name.name,
      };
    },

    TypedOnly(_, type) {
      return {
        type: compileTypeApp(type),
        parameter: "_",
      };
    },

    Untyped(_, name) {
      return {
        type: new IR.TAny(),
        parameter: name.name,
      };
    },
  });
}

export function compileTrailingTest(
  title: string,
  types: IR.Type[],
  test: TrailingTest | null
): IR.Declaration[] {
  if (test == null) {
    return [];
  } else {
    const pos = compileMeta(test.pos);
    return [
      new IR.DTest(
        pos,
        `${title} (${types.map((x) => x.static_name).join(", ")})`,
        new IR.SBlock(pos, test.body.map(compileStatement))
      ),
    ];
  }
}

export function compileParameters(xs0: Parameter[]) {
  const xs = xs0.map(compileParameter);
  return {
    types: xs.map((x) => x.type),
    parameters: xs.map((x) => x.parameter),
  };
}

export function compileTypeDef(
  local: boolean,
  t: TypeDef,
  fields: Parameter[]
) {
  const params = fields.map(compileParameter);
  const parent = t.parent ? compileTypeApp(t.parent) : null;

  return new IR.DType(generated_node, local, parent, t.name.name, params);
}

export function compileRank(r: Rank): IR.Expression {
  return r.match<IR.Expression>({
    Expr(e) {
      return compileExpression(e);
    },

    Unranked(_) {
      return new IR.EInteger(generated_node, 1n);
    },
  });
}

export function compileDeclaration(
  d: Declaration,
  locality: DeclarationLocality
): IR.Declaration[] {
  return d.match<IR.Declaration[]>({
    Do(pos, body) {
      return [new IR.DDo(compileMeta(pos), body.map(compileStatement))];
    },

    DefinePredicate(pos, sig, clauses) {
      const name = signatureName(sig);
      const params = signatureValues(sig).map((x) => x.name);
      const procedure = new Logic.PredicateProcedure(
        name,
        params,
        clauses.map(compilePredicateClause)
      );
      return [new IR.DPredicate(compileMeta(pos), name, procedure)];
    },

    Relation(pos, sig) {
      const types = signatureValues(sig);
      return [
        new IR.DRelation(
          compileMeta(pos),
          signatureName(sig),
          compileRelationTypes(types)
        ),
      ];
    },

    ForeignCommand(meta, sig, contract, body, test) {
      const name = signatureName(sig);
      const { types, parameters } = compileParameters(signatureValues(sig));
      const pos = compileMeta(meta);
      return [
        new IR.DForeignCommand(
          pos,
          name,
          types,
          compileNamespace(body.name),
          parameters,
          body.args.map((x) => x.name),
          compileContract(contract)
        ),
        ...compileTrailingTest(name, types, test),
      ];
    },

    Command(meta, sig, contract, body, test) {
      const name = signatureName(sig);
      const { types, parameters } = compileParameters(signatureValues(sig));
      const pos = compileMeta(meta);
      return [
        new IR.DCrochetCommand(
          pos,
          name,
          parameters,
          types,
          body.map(compileStatement),
          compileContract(contract)
        ),
        ...compileTrailingTest(name, types, test),
      ];
    },

    SingletonType(meta, type0, init) {
      const local = compileLocality(locality);
      const type = compileTypeDef(local, type0, []);
      const pos = compileMeta(meta);
      return [
        new IR.DType(pos, local, type.parent, type.name, []),
        new IR.DDefine(pos, local, type.name, new IR.ENew(pos, type.name, [])),
        new IR.DSealType(pos, type.name),
        new IR.DDo(pos, [
          new IR.SRegister(pos, new IR.EGlobal(pos, type.name)),
        ]),
        ...compileTypeInit(meta, type.name, init),
      ];
    },

    EnumType(meta, name, variants) {
      const local = compileLocality(locality);
      const parent = new TypeApp.Named(name.pos, name);
      const pos = compileMeta(meta);
      const variantDecls = variants.flatMap((v, i) => [
        new Declaration.SingletonType(v.pos, new TypeDef(parent, v), []),
        new Declaration.Command(
          v.pos,
          new Signature.Unary(
            v.pos,
            new Parameter.TypedOnly(v.pos, new TypeApp.Named(v.pos, v)),
            new Name(v.pos, "to-enum-integer")
          ),
          new Contract(meta, null, [], []),
          [
            new Statement.Expr(
              new Expression.Lit(new Literal.Integer(v.pos, (i + 1).toString()))
            ),
          ],
          null
        ),
      ]);
      return [
        new IR.DType(pos, local, new IR.TNamed("enum"), name.name, []),
        ...variantDecls.flatMap((v) => compileDeclaration(v, locality)),
        new IR.DDefine(pos, local, name.name, new IR.ENew(pos, name.name, [])),
        new IR.DSealType(pos, name.name),
        new IR.DCrochetCommand(
          pos,
          "_ lower-bound",
          ["Self"],
          [new IR.TNamed(name.name)],
          [new IR.SExpression(pos, new IR.EGlobal(pos, variants[0].name))],
          new rt.Contract([], [])
        ),
        new IR.DCrochetCommand(
          pos,
          "_ upper-bound",
          ["Self"],
          [new IR.TNamed(name.name)],
          [
            new IR.SExpression(
              pos,
              new IR.EGlobal(pos, variants[variants.length - 1].name)
            ),
          ],
          new rt.Contract([], [])
        ),
        new IR.DCrochetCommand(
          pos,
          "_ from-enum-integer:",
          ["Self", "N"],
          [new IR.TNamed(name.name), new IR.TNamed("integer")],
          [
            new IR.SExpression(
              pos,
              new IR.ECondition(
                pos,
                variants.map((n, i) => {
                  return new IR.ConditionCase(
                    new IR.EInvoke(pos, "_ === _", [
                      new IR.EVariable(pos, "N"),
                      new IR.EInteger(pos, BigInt(i + 1)),
                    ]),
                    new IR.SBlock(pos, [new IR.EGlobal(pos, n.name)])
                  );
                })
              )
            ),
          ],
          new rt.Contract([], [])
        ),
      ];
    },

    AbstractType(meta, t) {
      const local = compileLocality(locality);
      const type = compileTypeDef(local, t, []);
      const pos = compileMeta(meta);
      return [
        new IR.DType(pos, local, type.parent, type.name, []),
        new IR.DSealType(pos, type.name),
      ];
    },

    Type(_, t, fields) {
      const local = compileLocality(locality);
      return [compileTypeDef(local, t, fields)];
    },

    Define(pos, name, value) {
      const local = compileLocality(locality);
      return [
        new IR.DDefine(
          compileMeta(pos),
          local,
          name.name,
          compileExpression(value)
        ),
      ];
    },

    Scene(pos, name, body) {
      return [
        new IR.DScene(compileMeta(pos), name.name, body.map(compileStatement)),
      ];
    },

    Action(pos, typ, title, tags, predicate, rank, body) {
      return [
        new IR.DAction(
          compileMeta(pos),
          compileTypeApp(typ),
          compileExpression(title),
          tags.map((x) => x.name),
          compilePredicate(predicate),
          compileRank(rank),
          body.map(compileStatement)
        ),
      ];
    },

    When(pos, predicate, body) {
      return [
        new IR.DWhen(
          compileMeta(pos),
          compilePredicate(predicate),
          body.map(compileStatement)
        ),
      ];
    },

    Context(pos, name, items) {
      return [
        new IR.DContext(
          compileMeta(pos),
          name.name,
          (items.flatMap(
            compileDeclaration
          ) as any) as IR.IContextualDeclaration[]
        ),
      ];
    },

    ForeignType(pos, name, foreign_name) {
      const local = compileLocality(locality);
      return [
        new IR.DForeignType(
          compileMeta(pos),
          local,
          name.name,
          compileNamespace(foreign_name)
        ),
      ];
    },

    Open(pos, ns) {
      return [new IR.DOpen(compileMeta(pos), compileNamespace(ns))];
    },

    Local(_, decl) {
      return compileDeclaration(decl, DeclarationLocality.LOCAL);
    },

    Test(pos, title0, body) {
      const title = parseString(title0);
      return [
        new IR.DTest(
          compileMeta(pos),
          title,
          new IR.SBlock(compileMeta(pos), body.map(compileStatement))
        ),
      ];
    },
  });
}

export function compileProgram(p: Program) {
  return p.declarations.flatMap((x) =>
    compileDeclaration(x, DeclarationLocality.PUBLIC)
  );
}
