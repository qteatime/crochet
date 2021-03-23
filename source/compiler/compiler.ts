import {
  Constraint,
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
  PredicateExpression,
  PredicateOp,
  SimulationContext,
  ForExpression,
} from "../generated/crochet-grammar";
import * as rt from "../runtime";
import * as IR from "../runtime/ir";
import { SimpleInterpolation, TNamed } from "../runtime/ir";
import * as Logic from "../runtime/logic";
import * as Sim from "../runtime/simulation";
import { cast } from "../utils/utils";

// -- Utilities
function parseInteger(x: string): bigint {
  return BigInt(x.replace(/_/g, ""));
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

export function literalToValue(lit: Literal) {
  return lit.match<rt.CrochetValue>({
    False(_) {
      return rt.False.instance;
    },

    True(_) {
      return rt.True.instance;
    },

    Text(_, value) {
      return new rt.CrochetText(parseString(value));
    },

    Integer(_, digits) {
      return new rt.CrochetInteger(parseInteger(digits));
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
    HasRole(_, type, name) {
      return new Logic.RolePattern(compilePattern(name), type.name);
    },

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

export function compileConstraint(c: Constraint): Logic.Constraint.Constraint {
  return c.match<Logic.Constraint.Constraint>({
    And(_, l, r) {
      return new Logic.Constraint.And(
        compileConstraint(l),
        compileConstraint(r)
      );
    },

    Not(_, c) {
      return new Logic.Constraint.Not(compileConstraint(c));
    },

    Or(_, l, r) {
      return new Logic.Constraint.Or(
        compileConstraint(l),
        compileConstraint(r)
      );
    },

    Equal(_, l, r) {
      return new Logic.Constraint.Equals(
        compileConstraint(l),
        compileConstraint(r)
      );
    },

    Variable(_, name) {
      return new Logic.Constraint.Variable(name.name);
    },

    Global(_, name) {
      return new Logic.Constraint.Global(name.name);
    },

    HasRole(_, value, name) {
      return new Logic.Constraint.HasRole(compileConstraint(value), name.name);
    },

    HasType(_, value, type) {
      return new Logic.Constraint.HasType(
        compileConstraint(value),
        compileTypeApp(type)
      );
    },

    Lit(l) {
      return new Logic.Constraint.Value(literalToValue(l));
    },

    Parens(_, c) {
      return compileConstraint(c);
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

export function compilePredicateOp(op: PredicateOp): Logic.BinOp {
  return op.match<Logic.BinOp>({
    Add() {
      return Logic.BinOp.OP_ADD;
    },

    Sub() {
      return Logic.BinOp.OP_SUB;
    },
  });
}

export function compilePredicateExpr(
  expr: PredicateExpression
): Logic.PredicateExpr {
  return expr.match<Logic.PredicateExpr>({
    BinOp(_, op, left, right) {
      return new Logic.PEBinOp(
        compilePredicateOp(op),
        compilePredicateExpr(left),
        compilePredicateExpr(right)
      );
    },

    Count(_, p) {
      return new Logic.PECount(compilePredicate(p));
    },

    Global(_, name) {
      return new Logic.PEGlobal(name.name);
    },

    Lit(lit) {
      return new Logic.PEValue(literalToValue(lit));
    },

    Project(_, l, f) {
      return new Logic.PEProject(
        compilePredicateExpr(l),
        compileRecordField(f)
      );
    },

    Self(_) {
      return new Logic.PESelf();
    },

    Set(_, p) {
      return new Logic.PESet(compilePredicate(p));
    },

    Variable(_, name) {
      return new Logic.PEVariable(name.name);
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
        compileConstraint(c)
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
      return new Logic.LetPredicate(name.name, compilePredicateExpr(value));
    },

    Typed(_, name, typ) {
      return new Logic.TypePredicate(name.name, compileTypeApp(typ));
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
    False(_) {
      return new IR.EFalse();
    },

    True(_) {
      return new IR.ETrue();
    },

    Text(_, value) {
      return new IR.EText(parseString(value));
    },

    Integer(_, digits) {
      return new IR.EInteger(parseInteger(digits));
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
    new IR.SBlock(kase.body.map(compileStatement))
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
    Search(_, pred) {
      return new IR.ESearch(compilePredicate(pred));
    },

    MatchSearch(_, cases) {
      return new IR.EMatchSearch(cases.map(compileMatchSearchCase));
    },

    Invoke(_, sig) {
      const name = signatureName(sig);
      const args = signatureValues(sig).map(compileArgument);
      const is_saturated = args.every((x) => x instanceof IR.EPartialConcrete);
      if (is_saturated) {
        return new IR.EInvoke(
          name,
          args.map((x) => cast(x, IR.EPartialConcrete).expr)
        );
      } else {
        return new IR.EPartial(name, args);
      }
    },

    Variable(_, name) {
      return new IR.EVariable(name.name);
    },

    Global(_, name) {
      return new IR.EGlobal(name.name);
    },

    Self(_) {
      return new IR.ESelf();
    },

    New(_, type, values) {
      return new IR.ENew(type.name, values.map(compileExpression));
    },

    List(_, values) {
      return new IR.EList(values.map(compileExpression));
    },

    Record(_, pairs) {
      return new IR.ERecord(
        pairs.map((x) => ({
          key: compileRecordField(x.key),
          value: compileExpression(x.value),
        }))
      );
    },

    Cast(_, type, value) {
      return new IR.ECast(compileTypeApp(type), compileExpression(value));
    },

    Project(_, object, field) {
      return new IR.EProject(
        compileExpression(object),
        compileRecordField(field)
      );
    },

    Select(_, object, fields) {
      return new IR.EProjectMany(
        compileExpression(object),
        fields.map((x) => ({
          key: compileRecordField(x.name),
          alias: compileRecordField(x.alias),
        }))
      );
    },

    Block(_, body) {
      return new IR.EBlock(body.map(compileStatement));
    },

    For(_, body) {
      return new IR.EForall(compileForExpression(body));
    },

    Apply(_, partial, args) {
      return new IR.EApplyPartial(
        compileExpression(partial),
        args.map(compileArgument)
      );
    },

    Interpolate(_, x) {
      return compileInterpolation(x, compileExpression).to_expression();
    },

    Pipe(_, left, right) {
      return new IR.EApplyPartial(compileExpression(right), [
        new IR.EPartialConcrete(compileExpression(left)),
      ]);
    },

    Condition(_, cases) {
      return new IR.ECondition(
        cases.map(
          (x) =>
            new IR.ConditionCase(
              compileExpression(x.guard),
              new IR.SBlock(x.body.map(compileStatement))
            )
        )
      );
    },

    HasType(_, value, type) {
      return new IR.EHasType(compileExpression(value), compileTypeApp(type));
    },

    HasRole(_, value, role) {
      return new IR.EHasRole(compileExpression(value), role.name);
    },

    Force(_, value) {
      return new IR.EForce(compileExpression(value));
    },

    Lazy(_, value) {
      return new IR.ELazy(compileExpression(value));
    },

    Hole(_) {
      throw new Error(`Hole found outside of function application.`);
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

      Command(meta, sig0, body) {
        const self_param: Parameter = new Parameter.TypedOnly(
          meta,
          new TypeApp.Named(meta, new Name(meta, self))
        );
        const sig = materialiseSignature(self_param, sig0);
        return new Declaration.Command(meta, sig, body);
      },

      ForeignCommand(meta, sig0, body) {
        const self_param: Parameter = new Parameter.TypedOnly(
          meta,
          new TypeApp.Named(meta, new Name(meta, self))
        );
        const sig = materialiseSignature(self_param, sig0);
        return new Declaration.ForeignCommand(meta, sig, body);
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
    Let(_, name, value) {
      return new IR.SLet(name.name, compileExpression(value));
    },

    Fact(_, sig) {
      return new IR.SFact(
        signatureName(sig),
        signatureValues(sig).map(compileExpression)
      );
    },

    Forget(_, sig) {
      return new IR.SForget(
        signatureName(sig),
        signatureValues(sig).map(compileExpression)
      );
    },

    Call(_, name) {
      return new IR.SCall(name.name);
    },

    Goto(_, name) {
      return new IR.SGoto(name.name);
    },

    Simulate(_, actors, context, goal, signals) {
      return new IR.SSimulate(
        compileContext(context),
        compileExpression(actors),
        compileSimulationGoal(goal),
        signals.map(compileSignal)
      );
    },

    Expr(value) {
      return new IR.SExpression(compileExpression(value));
    },
  });
}

// -- Declaration
export function compileTypeApp(x: TypeApp): IR.Type {
  return x.match<IR.Type>({
    Named(_, name) {
      return new IR.TNamed(name.name);
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

export function compileParameters(xs0: Parameter[]) {
  const xs = xs0.map(compileParameter);
  return {
    types: xs.map((x) => x.type),
    parameters: xs.map((x) => x.parameter),
  };
}

export function compileTypeDef(t: TypeDef, fields: Parameter[]) {
  const params = fields.map(compileParameter);
  const parent = t.parent ? compileTypeApp(t.parent) : null;

  return new IR.DType(
    parent,
    t.name.name,
    t.roles.map((x) => x.name),
    params
  );
}

export function compileRank(r: Rank): IR.Expression {
  return r.match<IR.Expression>({
    Expr(e) {
      return compileExpression(e);
    },

    Unranked(_) {
      return new IR.EInteger(0n);
    },
  });
}

export function compileDeclaration(d: Declaration): IR.Declaration[] {
  return d.match<IR.Declaration[]>({
    Do(_, body) {
      return [new IR.DDo(body.map(compileStatement))];
    },

    DefinePredicate(_, sig, clauses) {
      const name = signatureName(sig);
      const params = signatureValues(sig).map((x) => x.name);
      const procedure = new Logic.PredicateProcedure(
        name,
        params,
        clauses.map(compilePredicateClause)
      );
      return [new IR.DPredicate(name, procedure)];
    },

    Relation(_, sig) {
      const types = signatureValues(sig);
      return [
        new IR.DRelation(signatureName(sig), compileRelationTypes(types)),
      ];
    },

    ForeignCommand(meta, sig, body) {
      const name = signatureName(sig);
      const { types, parameters } = compileParameters(signatureValues(sig));
      const args = body.args.map((x) => parameters.indexOf(x.name));
      return [
        new IR.DForeignCommand(name, types, compileNamespace(body.name), args),
      ];
    },

    Command(meta, sig, body) {
      const name = signatureName(sig);
      const { types, parameters } = compileParameters(signatureValues(sig));
      return [
        new IR.DCrochetCommand(
          name,
          parameters,
          types,
          body.map(compileStatement)
        ),
      ];
    },

    Role(_, name) {
      return [new IR.DRole(name.name)];
    },

    SingletonType(meta, type0, init) {
      const type = compileTypeDef(type0, []);
      return [
        new IR.DType(type.parent, type.name, type.roles, []),
        new IR.DDefine(type.name, new IR.ENew(type.name, [])),
        new IR.DSealType(type.name),
        new IR.DDo([new IR.SRegister(new IR.EGlobal(type.name))]),
        ...compileTypeInit(meta, type.name, init),
      ];
    },

    EnumType(_, name, variants) {
      const parent = new TypeApp.Named(name.pos, name);
      const variantDecls = variants.map(
        (v) =>
          new Declaration.SingletonType(v.pos, new TypeDef(parent, v, []), [])
      );
      return [
        new IR.DType(null, name.name, [], []),
        ...variantDecls.flatMap((v) => compileDeclaration(v)),
      ];
    },

    AbstractType(_, t) {
      const type = compileTypeDef(t, []);
      return [
        new IR.DType(type.parent, type.name, type.roles, []),
        new IR.DSealType(type.name),
      ];
    },

    Type(_, t, fields) {
      return [compileTypeDef(t, fields)];
    },

    Define(_, name, value) {
      return [new IR.DDefine(name.name, compileExpression(value))];
    },

    Scene(_, name, body) {
      return [new IR.DScene(name.name, body.map(compileStatement))];
    },

    Action(_, title, tags, predicate, rank, body) {
      return [
        new IR.DAction(
          compileInterpolation(title, (x) => x.name),
          tags.map((x) => x.name),
          compilePredicate(predicate),
          compileRank(rank),
          body.map(compileStatement)
        ),
      ];
    },

    When(_, predicate, body) {
      return [
        new IR.DWhen(compilePredicate(predicate), body.map(compileStatement)),
      ];
    },

    Context(_, name, items) {
      return [
        new IR.DContext(
          name.name,
          (items.map(compileDeclaration) as any) as IR.IContextualDeclaration[]
        ),
      ];
    },

    ForeignType(_, name, foreign_name) {
      return [new IR.DForeignType(name.name, compileNamespace(foreign_name))];
    },
  });
}

export function compileProgram(p: Program) {
  return p.declarations.flatMap(compileDeclaration);
}
