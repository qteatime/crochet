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
  InterpolatePart,
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

class SearchSignature {
  constructor(readonly name: string, readonly patterns: IR.Pattern[]) {}
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

  actorDeclaration(_actor: x, name0: Node, roles: Node, init: Node) {
    const name = name0.toAST();
    const self = new EActor(name);
    return new DActor(name, roles.toAST(), init.toAST()(self));
  },

  actorRoles_roles(_: x, roles: Node) {
    return roles.toAST();
  },

  actorRoles_no_roles() {
    return [];
  },

  actorInitialisation_init(_l: x, facts: Node, _r: x) {
    return (self: Expression) => facts.toAST().map((f: Function) => f(self));
  },

  actorInitialisation_no_init(_semi: x) {
    return (self: Expression) => [];
  },

  actorFact(fact: Node) {
    return (self: Expression) => new SFact(fact.toAST()(self));
  },

  actorFact_keyword(pairs0: Node, _semi: x) {
    return (self: Expression) => {
      const pairs: Pair<Expression>[] = pairs0.toAST();
      const name = pairs.map((x) => x.keyword);
      const args = [self, ...pairs.map((x) => x.value)];
      return new FactSignature("_ " + name.join(""), args);
    };
  },

  actorFact_unary(name: Node, _semi: x) {
    return (self: Expression) => {
      return new FactSignature("_ " + name.toAST(), [self]);
    };
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

  relationSignature_unary(self: Node, name: Node) {
    return new RelationSignature("_ " + name.toAST(), [self.toAST()]);
  },

  relationSignature_keyword(self: Node, pairs0: Node) {
    const pairs: Pair<RelationComponent>[] = pairs0.toAST();
    const name = pairs.map((x) => x.keyword);
    const args = [self.toAST(), ...pairs.map((x) => x.value)];
    return new RelationSignature("_ " + name.join(""), args);
  },

  relationVariable_many(name: Node, _: x) {
    return new OneComponent(name.toAST());
  },

  relationVariable_one(name: Node) {
    return new ManyComponent(name.toAST());
  },

  relationSignaturePair(kw: Node, name: Node) {
    return new Pair<unknown>(kw.toAST(), name.toAST());
  },

  repeatableMark_mark(_: x) {
    return true;
  },

  repeatableMark_no_mark() {
    return false;
  },

  actionDeclaration(
    repeatable: Node,
    _action: x,
    name: Node,
    tags: Node,
    _when: x,
    pred: Node,
    block: Node
  ) {
    return new DAction(
      repeatable.toAST(),
      name.toAST(),
      tags.toAST(),
      pred.toAST(),
      block.toAST()
    );
  },

  actionTags_tagged(_: x, tags: Node) {
    return tags.toAST();
  },

  actionTags_untagged() {
    return [];
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

  constraintEq_gt(left: Node, _s: x, right: Node) {
    return new IR.CGreaterThan(left.toAST(), right.toAST());
  },

  constraintEq_gte(left0: Node, _s: x, right0: Node) {
    const left = left0.toAST();
    const right = right0.toAST();
    return new IR.COr(
      new IR.CEqual(left, right),
      new IR.CGreaterThan(left, right)
    );
  },

  constraintEq_lt(left: Node, _s: x, right: Node) {
    return new IR.CLessThan(left.toAST(), right.toAST());
  },

  constraintEq_lte(left0: Node, _s: x, right0: Node) {
    const left = left0.toAST();
    const right = right0.toAST();
    return new IR.COr(
      new IR.CEqual(left, right),
      new IR.CLessThan(left, right)
    );
  },

  constraintEq_role(expr: Node, _sym: x, role: Node) {
    return new IR.CRole(expr.toAST(), role.toAST());
  },

  constraintPrimary_integer(value0: Node) {
    const value: EInteger = value0.toAST();
    return new IR.CInteger(value.value);
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

  factUseSignature_unary(self: Node, name: Node) {
    return new FactSignature("_ " + name.toAST(), [self.toAST()]);
  },

  factUseSignature_keyword(self: Node, pairs0: Node) {
    const pairs: Pair<Expression>[] = pairs0.toAST();
    const name = pairs.map((x) => x.keyword);
    const args = [self.toAST(), ...pairs.map((x) => x.value)];
    return new FactSignature("_ " + name.join(""), args);
  },

  factSignaturePair(kw: Node, expr: Node) {
    return new Pair<unknown>(kw.toAST(), expr.toAST());
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

  searchRelation_negated(_not: x, sig0: Node) {
    const sig: SearchSignature = sig0.toAST();
    return new IR.PredicateRelation(sig.name, sig.patterns, true);
  },

  searchRelation_has(sig0: Node) {
    const sig: SearchSignature = sig0.toAST();
    return new IR.PredicateRelation(sig.name, sig.patterns, false);
  },

  searchSignature_unary(self: Node, name: Node) {
    return new SearchSignature("_ " + name.toAST(), [self.toAST()]);
  },

  searchSignature_keyword(self: Node, pairs0: Node) {
    const pairs: Pair<IR.Pattern>[] = pairs0.toAST();
    const name = pairs.map((x) => x.keyword);
    const args = [self.toAST(), ...pairs.map((x) => x.value)];
    return new SearchSignature("_ " + name.join(""), args);
  },

  searchSignaturePair(kw: Node, arg: Node) {
    return new Pair<unknown>(kw.toAST(), arg.toAST());
  },

  searchSegment_actor(name: Node) {
    return new IR.ActorPattern(name.toAST());
  },

  searchSegment_integer(value0: Node) {
    const value: EInteger = value0.toAST();
    return new IR.IntegerPattern(value.value);
  },

  searchSegment_float(value0: Node) {
    const value: EFloat = value0.toAST();
    return new IR.FloatPattern(value.value);
  },

  searchSegment_text(value0: Node) {
    const value: EText = value0.toAST();
    return new IR.TextPattern(value.value);
  },

  searchSegment_boolean(value0: Node) {
    const value: EBoolean = value0.toAST();
    return new IR.BooleanPattern(value.value);
  },

  searchSegment_nothing(_: x) {
    return new IR.NothingPattern();
  },

  searchSegment_variable(name: Node) {
    return new IR.VariablePattern(name.toAST());
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

  interpolateText(_l: x, parts0: Node, _r: x) {
    const parts1: InterpolatePart[] = parts0.toAST();
    const parts = parts1.reduce((xs, x) => {
      if (xs.length === 0) {
        return [x];
      } else {
        const last = xs[xs.length - 1];
        if (
          x instanceof InterpolateStatic &&
          last instanceof InterpolateStatic
        ) {
          (last as any).text = last.text + x.text;
        } else {
          xs.push(x);
        }
        return xs;
      }
    }, [] as InterpolatePart[]);
    return new EInterpolateText(this.sourceString as any, parts);
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
