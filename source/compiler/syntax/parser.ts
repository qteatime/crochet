import * as Ohm from "ohm-js";
import * as Fs from "fs";
import * as Path from "path";
import {
  DDo,
  DFFICommand,
  DLocalCommand,
  DRelation,
  DScene,
  DActor,
  EBoolean,
  EFloat,
  EInteger,
  EInvoke,
  ELet,
  ENothing,
  ESearch,
  EText,
  EVariable,
  Expression,
  ManyComponent,
  OneComponent,
  Program,
  RelationComponent,
  RelationSignature,
  SExpression,
  SFact,
  SGoto,
  Signature,
  SReturn,
  UseSignature,
  EActor,
  FactSignature,
  SForget,
  DAction,
  STriggerAction,
  DContext,
  Hook,
  STrigger,
  EIf,
  InterpolateStatic,
  InterpolateDynamic,
  EInterpolateText,
  EProject,
  EMatch,
  MatchPredicate,
  MatchDefault,
} from "./ast";
import * as IR from "../../ir/operations";

const grammarFile = Path.join(__dirname, "../../../grammar/crochet.ohm");
const grammar = Ohm.grammar(Fs.readFileSync(grammarFile, "utf-8"));

export function parse(filename: string, source: string): Program {
  const match = grammar.match(source);
  if (match.failed()) {
    throw new Error(match.message);
  } else {
    const declarations = toAST(match).toAST();
    return new Program(filename, declarations);
  }
}

type x = unknown;
type Node = Ohm.Node;

interface ISegment {
  to_static_part(): string;
}

class AtomSegment implements ISegment {
  constructor(readonly name: string) {}

  to_static_part() {
    return this.name;
  }

  to_relation_signature(): RelationComponent {
    throw new Error(`Atom cannot be made into a component`);
  }

  to_pattern(): IR.Pattern {
    throw new Error(`Atom cannot be made into a pattern`);
  }
}

class VariableSegment implements ISegment {
  constructor(readonly name: string) {}

  to_static_part() {
    return "_";
  }
}

class ExprSegment implements ISegment {
  constructor(readonly expr: Expression) {}

  to_static_part() {
    return "_";
  }
}

class OneRelationSegment implements ISegment {
  constructor(readonly name: string) {}

  to_static_part() {
    return "_";
  }

  to_relation_signature() {
    return new OneComponent(this.name);
  }
}

class ManyRelationSegment implements ISegment {
  constructor(readonly name: string) {}

  to_static_part() {
    return "_";
  }

  to_relation_signature() {
    return new ManyComponent(this.name);
  }
}

class PatternSegment implements ISegment {
  constructor(readonly pattern: IR.Pattern) {}

  to_static_part() {
    return "_";
  }

  to_pattern() {
    return this.pattern;
  }
}

class Pair<T> {
  constructor(readonly keyword: string, readonly value: T) {}
}

const toAST = grammar.createSemantics().addOperation("toAST()", {
  program(_header: x, decls: Node, _sp1: x, _eof: x) {
    return decls.toAST();
  },

  doDeclaration(_do: x, body: Node) {
    return new DDo(body.toAST());
  },

  sceneDeclaration(_scene: x, name: Node, body: Node) {
    return new DScene(name.toAST(), body.toAST());
  },

  actorDeclaration_roles(_actor: x, name: Node, _: x, roles: Node, _semi: x) {
    return new DActor(name.toAST(), roles.toAST());
  },

  actorDeclaration_no_roles(_actor: x, name: Node, _semi: x) {
    return new DActor(name.toAST(), []);
  },

  contextDeclaration(_context: x, name: Node, _l: x, hooks: Node, _r: x) {
    return new DContext(name.toAST(), hooks.toAST());
  },

  hookDeclaration(_when: x, pred: Node, body: Node) {
    return new Hook(pred.toAST(), body.toAST());
  },

  relationDeclaration(_relation: x, sig: Node, _semi: x) {
    return new DRelation(sig.toAST());
  },

  relationSignature(segments0: Node) {
    const segments: (
      | AtomSegment
      | OneRelationSegment
      | ManyRelationSegment
    )[] = segments0.toAST();
    const name = segments.map((x) => x.to_static_part()).join(" ");
    const args = segments
      .filter((x) => !(x instanceof AtomSegment))
      .map((x) => x.to_relation_signature());
    return new RelationSignature(name, args);
  },

  relationSignatureSegment_static(name: Node) {
    return new AtomSegment(name.toAST());
  },

  relationSignatureSegment_many(name: Node, _star: x) {
    return new ManyRelationSegment(name.toAST());
  },

  relationSignatureSegment_one(name: Node) {
    return new OneRelationSegment(name.toAST());
  },

  actionDeclaration(_action: x, name: Node, _when: x, pred: Node, block: Node) {
    return new DAction(name.toAST(), pred.toAST(), block.toAST());
  },

  predicate_constrained(relations0: Node, _if: x, constraint: Node) {
    const relations: IR.PredicateRelation[] = relations0.toAST();
    return new IR.Predicate(relations, constraint.toAST());
  },

  predicate_unconstrained(relations0: Node) {
    const relations: IR.PredicateRelation[] = relations0.toAST();
    return new IR.Predicate(relations, new IR.CBoolean(true));
  },

  constraint_conjunction(left: Node, _and: x, right: Node) {
    return new IR.CAnd(left.toAST(), right.toAST());
  },

  constraint_disjunction(left: Node, _or: x, right: Node) {
    return new IR.COr(left.toAST(), right.toAST());
  },

  constraint_negate(_not: x, value: Node) {
    return new IR.CNot(value.toAST());
  },

  constraintEq_eq(left: Node, _eq: x, right: Node) {
    return new IR.CEqual(left.toAST(), right.toAST());
  },

  constraintEq_neq(left: Node, _eq: x, right: Node) {
    return new IR.CNotEqual(left.toAST(), right.toAST());
  },

  constraintEq_role(expr: Node, _sym: x, role: Node) {
    return new IR.CRole(expr.toAST(), role.toAST());
  },

  constraintPrimary_variable(name: Node) {
    return new IR.CVariable(name.toAST());
  },

  constraintPrimary_actor(name: Node) {
    return new IR.CActor(name.toAST());
  },

  constraintPrimary_group(_l: x, expr: Node, _r: x) {
    return expr.toAST();
  },

  commandDeclaration_ffi(
    _command: x,
    sig: Node,
    _eq: x,
    name: Node,
    _1: x,
    params: Node,
    _2: x,
    _semi: x
  ) {
    return new DFFICommand(sig.toAST(), name.toAST(), params.toAST());
  },

  commandDeclaration_local(_command: x, sig: Node, body: Node) {
    return new DLocalCommand(sig.toAST(), body.toAST());
  },

  commandSignature_self(self: Node, pairs0: Node) {
    const pairs: Pair<string>[] = pairs0.toAST();
    const kws = pairs.map((x) => x.keyword);
    const args = [self.toAST(), ...pairs.map((x) => x.value)];
    return new Signature("_ " + kws.join(""), args);
  },

  commandSignature_unary(self: Node, name: Node) {
    return new Signature("_ " + name.toAST(), [self.toAST()]);
  },

  commandSignature_prefix(pairs0: Node) {
    const pairs: Pair<string>[] = pairs0.toAST();
    const kws = pairs.map((x) => x.keyword);
    const args = pairs.map((x) => x.value);
    return new Signature(kws.join(""), args);
  },

  commandSignature_nullary(name: Node) {
    return new Signature(name.toAST(), []);
  },

  commandSignature_infix(left: Node, symbol: Node, right: Node) {
    return new Signature(`_ ${symbol.toAST()} _`, [
      left.toAST(),
      right.toAST(),
    ]);
  },

  keywordSignaturePair(kw: Node, value: Node) {
    return new Pair<unknown>(kw.toAST(), value.toAST());
  },

  statement_expr(expr: Node, _semi: x) {
    return new SExpression(expr.toAST());
  },

  returnStatement_with_value(_return: x, expr: Node, _semi: x) {
    return new SReturn(expr.toAST());
  },

  returnStatement_naked(_return: x, _semi: x) {
    return new SReturn(new ENothing());
  },

  gotoStatement(_goto: x, scene: Node, _semi: x) {
    return new SGoto(scene.toAST());
  },

  letStatement(_let: x, name: Node, _eq: x, expr: Node, _semi: x) {
    return new ELet(name.toAST(), expr.toAST());
  },

  factStatement(_fact: x, sig: Node, _semi: x) {
    return new SFact(sig.toAST());
  },

  forgetStatement(_forget: x, sig: Node, _semi: x) {
    return new SForget(sig.toAST());
  },

  triggerStatement(_trigger: x, name: Node, _semi: x) {
    return new STrigger(name.toAST());
  },

  factUseSignature(segments0: Node) {
    const segments: (AtomSegment | ExprSegment)[] = segments0.toAST();
    const name = segments.map((x) => x.to_static_part()).join(" ");
    const args = segments
      .filter((x) => x instanceof ExprSegment)
      .map((x) => ((x as any) as ExprSegment).expr);
    return new FactSignature(name, args);
  },

  factSegment_static(name: Node) {
    return new AtomSegment(name.toAST());
  },

  factSegment_variable(expr: Node) {
    return new ExprSegment(expr.toAST());
  },

  triggerAction(_choose: x, _action: x, _semi: x) {
    return new STriggerAction();
  },

  statementBlock(_l: x, stmts: Node, _r: x) {
    return stmts.toAST();
  },

  invokeInfix_infix(left: Node, symbol: Node, right: Node) {
    const sig = new UseSignature(`_ ${symbol.toAST()} _`, [
      left.toAST(),
      right.toAST(),
    ]);
    return new EInvoke(sig);
  },

  invokeMixfix_self(self: Node, pairs0: Node) {
    const pairs: Pair<Expression>[] = pairs0.toAST();
    const kws = pairs.map((x) => x.keyword);
    const args = [self.toAST(), ...pairs.map((x) => x.value)];
    return new EInvoke(new UseSignature("_ " + kws.join(""), args));
  },

  invokeMixfix_prefix(pairs0: Node) {
    const pairs: Pair<Expression>[] = pairs0.toAST();
    const kws = pairs.map((x) => x.keyword);
    const args = pairs.map((x) => x.value);
    return new EInvoke(new UseSignature(kws.join(""), args));
  },

  invokePair(kw: Node, expr: Node) {
    return new Pair<Expression>(kw.toAST(), expr.toAST());
  },

  invokePostfix_postfix(self: Node, name: Node) {
    return new EInvoke(new UseSignature("_ " + name.toAST(), [self.toAST()]));
  },

  memberExpression_project(self: Node, _dot: x, name0: Node) {
    const name: EText = name0.toAST();
    return new EProject(self.toAST(), name.value);
  },

  searchExpression_search(_search: x, predicate: Node) {
    return new ESearch(predicate.toAST());
  },

  searchRelation(segments0: Node) {
    const segments: (AtomSegment | PatternSegment)[] = segments0.toAST();
    const name = segments.map((x) => x.to_static_part()).join(" ");
    const patterns = segments
      .filter((x) => x instanceof PatternSegment)
      .map((x) => x.to_pattern());
    return new IR.PredicateRelation(name, patterns);
  },

  searchSegment_actor(name: Node) {
    return new PatternSegment(new IR.ActorPattern(name.toAST()));
  },

  searchSegment_integer(value: Node) {
    return new PatternSegment(new IR.IntegerPattern(value.toAST()));
  },

  searchSegment_float(value: Node) {
    return new PatternSegment(new IR.FloatPattern(value.toAST()));
  },

  searchSegment_text(value: Node) {
    return new PatternSegment(new IR.TextPattern(value.toAST()));
  },

  searchSegment_boolean(value: Node) {
    return new PatternSegment(new IR.BooleanPattern(value.toAST()));
  },

  searchSegment_nothing(_: x) {
    return new PatternSegment(new IR.NothingPattern());
  },

  searchSegment_variable(name: Node) {
    return new PatternSegment(new IR.VariablePattern(name.toAST()));
  },

  searchSegment_static(name: Node) {
    return new AtomSegment(name.toAST());
  },

  primaryExpression_atom(head: Node) {
    return new EInvoke(new UseSignature(head.toAST(), []));
  },

  variable(name: Node) {
    return new EVariable(name.toAST());
  },

  primaryExpression_actor(name: Node) {
    return new EActor(name.toAST());
  },

  primaryExpression_group(_l: x, expr: Node, _r: x) {
    return expr.toAST();
  },

  matchExpression(_match: x, _l: x, clauses: Node, _r: x) {
    return new EMatch(clauses.toAST());
  },

  matchClause_when(_when: x, pred: Node, body: Node) {
    return new MatchPredicate(pred.toAST(), body.toAST());
  },

  matchClause_default(_default: x, body: Node) {
    return new MatchDefault(body.toAST());
  },

  ifExpression(
    _if: x,
    test: Node,
    _then: x,
    consequent: Node,
    _else: x,
    alternate: Node
  ) {
    return new EIf(test.toAST(), consequent.toAST(), alternate.toAST());
  },

  text(node: Node) {
    return new EText(node.toAST());
  },

  integer(node: Node) {
    return new EInteger(node.toAST());
  },

  float(node: Node) {
    return new EFloat(node.toAST());
  },

  boolean(node: Node) {
    return new EBoolean(node.toAST());
  },

  nothing(_: x) {
    return new ENothing();
  },

  name(node: Node) {
    return node.toAST();
  },

  atom(_sp1: x, node: Node) {
    return node.toAST();
  },

  keyword(node: Node) {
    return node.toAST();
  },

  interpolateTextPart_escape(_x: x, value: Node) {
    return new InterpolateStatic(value.toAST());
  },

  interpolateTextPart_interpolate(_l: x, value: Node, _r: x) {
    return new InterpolateDynamic(value.toAST());
  },

  interpolateTextPart_character(value: Node) {
    return new InterpolateStatic(value.toAST());
  },

  interpolateText(_l: x, parts: Node, _r: x) {
    return new EInterpolateText(this.sourceString as any, parts.toAST());
  },

  emptyListOf() {
    return [];
  },

  nonemptyListOf(head: Node, _sep: x, rest: Node) {
    return [head.toAST(), ...rest.toAST()];
  },

  s(_space: x, node: Node) {
    return node.toAST();
  },

  _terminal() {
    return this.primitiveValue;
  },

  header(_1: x, _2: x, _3: x, _4: x) {
    return { language: "en", version: 1 };
  },

  t_text(_l: x, chars: x, _r: x) {
    return JSON.parse(this.sourceString as any);
  },

  t_boolean(node: Node) {
    return node.toAST();
  },

  t_boolean_true(_: x) {
    return true;
  },

  t_boolean_false(_: x) {
    return false;
  },

  t_integer(x: Node) {
    return BigInt(this.sourceString as any);
  },

  t_float(_1: x, _2: x, _3: x) {
    return Number(this.sourceString as any);
  },

  t_atom(_1: x, _2: x) {
    return this.sourceString;
  },

  t_keyword(_1: x, _2: x) {
    return this.sourceString;
  },

  t_actor_name(_sharp: x, name: Node) {
    return name.toAST();
  },

  t_name(_1: x, _2: x) {
    return this.sourceString;
  },
});
