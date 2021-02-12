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
  SChooseAction,
  DContext,
  Hook,
  STrigger,
  EIf,
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
  Program(_header: x, decls: Node, _eof: x) {
    return decls.toAST();
  },

  DoDeclaration(_do: x, body: Node) {
    return new DDo(body.toAST());
  },

  SceneDeclaration(_scene: x, name: Node, body: Node) {
    return new DScene(name.toAST(), body.toAST());
  },

  ActorDeclaration_roles(_actor: x, name: Node, _: x, roles: Node, _semi: x) {
    return new DActor(name.toAST(), roles.toAST());
  },

  ActorDeclaration_no_roles(_actor: x, name: Node, _semi: x) {
    return new DActor(name.toAST(), []);
  },

  ContextDeclaration(_context: x, name: Node, _l: x, hooks: Node, _r: x) {
    return new DContext(name.toAST(), hooks.toAST());
  },

  HookDeclaration(_when: x, pred: Node, body: Node) {
    return new Hook(pred.toAST(), body.toAST());
  },

  RelationDeclaration(_relation: x, sig: Node, _semi: x) {
    return new DRelation(sig.toAST());
  },

  RelationSignature(segments0: Node) {
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

  RelationSignatureSegment_static(name: Node) {
    return new AtomSegment(name.toAST());
  },

  RelationSignatureSegment_many(name: Node, _star: x) {
    return new ManyRelationSegment(name.toAST());
  },

  RelationSignatureSegment_one(name: Node) {
    return new OneRelationSegment(name.toAST());
  },

  ActionDeclaration(_action: x, name: Node, _when: x, pred: Node, block: Node) {
    return new DAction(name.toAST(), pred.toAST(), block.toAST());
  },

  Predicate_constrained(relations0: Node, _if: x, constraint: Node) {
    const relations: IR.PredicateRelation[] = relations0.toAST();
    return new IR.Predicate(relations, constraint.toAST());
  },

  Predicate_unconstrained(relations0: Node) {
    const relations: IR.PredicateRelation[] = relations0.toAST();
    return new IR.Predicate(relations, new IR.CBoolean(true));
  },

  Constraint_conjunction(left: Node, _and: x, right: Node) {
    return new IR.CAnd(left.toAST(), right.toAST());
  },

  Constraint_disjunction(left: Node, _or: x, right: Node) {
    return new IR.COr(left.toAST(), right.toAST());
  },

  Constraint_negate(_not: x, value: Node) {
    return new IR.CNot(value.toAST());
  },

  ConstraintEq_eq(left: Node, _eq: x, right: Node) {
    return new IR.CEqual(left.toAST(), right.toAST());
  },

  ConstraintEq_neq(left: Node, _eq: x, right: Node) {
    return new IR.CNotEqual(left.toAST(), right.toAST());
  },

  ConstraintEq_role(expr: Node, _sym: x, role: Node) {
    return new IR.CRole(expr.toAST(), role.toAST());
  },

  ConstraintPrimary_variable(name: Node) {
    return new IR.CVariable(name.toAST());
  },

  ConstraintPrimary_actor(name: Node) {
    return new IR.CActor(name.toAST());
  },

  ConstraintPrimary_group(_l: x, expr: Node, _r: x) {
    return expr.toAST();
  },

  CommandDeclaration_ffi(
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

  CommandDeclaration_local(_command: x, sig: Node, body: Node) {
    return new DLocalCommand(sig.toAST(), body.toAST());
  },

  CommandSignature_self(self: Node, pairs0: Node) {
    const pairs: Pair<string>[] = pairs0.toAST();
    const kws = pairs.map((x) => x.keyword);
    const args = [self.toAST(), ...pairs.map((x) => x.value)];
    return new Signature("_ " + kws.join(""), args);
  },

  CommandSignature_unary(self: Node, name: Node) {
    return new Signature("_ " + name.toAST(), [self.toAST()]);
  },

  CommandSignature_prefix(pairs0: Node) {
    const pairs: Pair<string>[] = pairs0.toAST();
    const kws = pairs.map((x) => x.keyword);
    const args = pairs.map((x) => x.value);
    return new Signature(kws.join(""), args);
  },

  CommandSignature_nullary(name: Node) {
    return new Signature(name.toAST(), []);
  },

  CommandSignature_infix(left: Node, symbol: Node, right: Node) {
    return new Signature(`_ ${symbol.toAST()} _`, [
      left.toAST(),
      right.toAST(),
    ]);
  },

  KeywordSignaturePair(kw: Node, value: Node) {
    return new Pair<unknown>(kw.toAST(), value.toAST());
  },

  Statement_expr(expr: Node, _semi: x) {
    return new SExpression(expr.toAST());
  },

  ReturnStatement_with_value(_return: x, expr: Node, _semi: x) {
    return new SReturn(expr.toAST());
  },

  ReturnStatement_naked(_return: x, _semi: x) {
    return new SReturn(new ENothing());
  },

  GotoStatement(_goto: x, scene: Node, _semi: x) {
    return new SGoto(scene.toAST());
  },

  LetStatement(_let: x, name: Node, _eq: x, expr: Node, _semi: x) {
    return new ELet(name.toAST(), expr.toAST());
  },

  FactStatement(_fact: x, sig: Node, _semi: x) {
    return new SFact(sig.toAST());
  },

  ForgetStatement(_forget: x, sig: Node, _semi: x) {
    return new SForget(sig.toAST());
  },

  TriggerStatement(_trigger: x, name: Node, _semi: x) {
    return new STrigger(name.toAST());
  },

  FactUseSignature(segments0: Node) {
    const segments: (AtomSegment | ExprSegment)[] = segments0.toAST();
    const name = segments.map((x) => x.to_static_part()).join(" ");
    const args = segments
      .filter((x) => x instanceof ExprSegment)
      .map((x) => ((x as any) as ExprSegment).expr);
    return new FactSignature(name, args);
  },

  FactSegment_static(name: Node) {
    return new AtomSegment(name.toAST());
  },

  FactSegment_variable(expr: Node) {
    return new ExprSegment(expr.toAST());
  },

  ChooseAction(_choose: x, _action: x, _semi: x) {
    return new SChooseAction();
  },

  StatementBlock(_l: x, stmts: Node, _r: x) {
    return stmts.toAST();
  },

  InvokeInfix_infix(left: Node, symbol: Node, right: Node) {
    const sig = new UseSignature(`_ ${symbol.toAST()} _`, [
      left.toAST(),
      right.toAST(),
    ]);
    return new EInvoke(sig);
  },

  InvokeMixfix_self(self: Node, pairs0: Node) {
    const pairs: Pair<Expression>[] = pairs0.toAST();
    const kws = pairs.map((x) => x.keyword);
    const args = [self.toAST(), ...pairs.map((x) => x.value)];
    return new EInvoke(new UseSignature("_ " + kws.join(""), args));
  },

  InvokeMixfix_prefix(pairs0: Node) {
    const pairs: Pair<Expression>[] = pairs0.toAST();
    const kws = pairs.map((x) => x.keyword);
    const args = pairs.map((x) => x.value);
    return new EInvoke(new UseSignature(kws.join(""), args));
  },

  InvokePair(kw: Node, expr: Node) {
    return new Pair<Expression>(kw.toAST(), expr.toAST());
  },

  InvokePostfix_postfix(self: Node, name: Node) {
    return new EInvoke(new UseSignature("_ " + name.toAST(), [self.toAST()]));
  },

  SearchExpression_search(_search: x, predicate: Node) {
    return new ESearch(predicate.toAST());
  },

  SearchRelation(segments0: Node) {
    const segments: (AtomSegment | PatternSegment)[] = segments0.toAST();
    const name = segments.map((x) => x.to_static_part()).join(" ");
    const patterns = segments
      .filter((x) => x instanceof PatternSegment)
      .map((x) => x.to_pattern());
    return new IR.PredicateRelation(name, patterns);
  },

  SearchSegment_actor(name: Node) {
    return new PatternSegment(new IR.ActorPattern(name.toAST()));
  },

  SearchSegment_integer(value: Node) {
    return new PatternSegment(new IR.IntegerPattern(value.toAST()));
  },

  SearchSegment_float(value: Node) {
    return new PatternSegment(new IR.FloatPattern(value.toAST()));
  },

  SearchSegment_text(value: Node) {
    return new PatternSegment(new IR.TextPattern(value.toAST()));
  },

  SearchSegment_boolean(value: Node) {
    return new PatternSegment(new IR.BooleanPattern(value.toAST()));
  },

  SearchSegment_nothing(_: x) {
    return new PatternSegment(new IR.NothingPattern());
  },

  SearchSegment_variable(name: Node) {
    return new PatternSegment(new IR.VariablePattern(name.toAST()));
  },

  SearchSegment_static(name: Node) {
    return new AtomSegment(name.toAST());
  },

  PrimaryExpression_atom(head: Node) {
    return new EInvoke(new UseSignature(head.toAST(), []));
  },

  PrimaryExpression_variable(name: Node) {
    return new EVariable(name.toAST());
  },

  PrimaryExpression_actor(name: Node) {
    return new EActor(name.toAST());
  },

  PrimaryExpression_group(_l: x, expr: Node, _r: x) {
    return expr.toAST();
  },

  IfExpression(
    _if: x,
    test: Node,
    _then: x,
    consequent: Node,
    _else: x,
    alternate: Node
  ) {
    return new EIf(test.toAST(), consequent.toAST(), alternate.toAST());
  },

  Text(node: Node) {
    return new EText(node.toAST());
  },

  Integer(node: Node) {
    return new EInteger(node.toAST());
  },

  Float(node: Node) {
    return new EFloat(node.toAST());
  },

  Boolean(node: Node) {
    return new EBoolean(node.toAST());
  },

  Nothing(_: x) {
    return new ENothing();
  },

  Name(node: Node) {
    return node.toAST();
  },

  Atom(node: Node) {
    return node.toAST();
  },

  Keyword(node: Node) {
    return node.toAST();
  },

  EmptyListOf() {
    return [];
  },

  NonemptyListOf(head: Node, _sep: x, rest: Node) {
    return [head.toAST(), ...rest.toAST()];
  },

  _terminal() {
    return this.primitiveValue;
  },

  header(_1: x, _2: x, _3: x, _4: x) {
    return { language: "en", version: 1 };
  },

  text(_l: x, chars: x, _r: x) {
    return JSON.parse(this.sourceString as any);
  },

  boolean(node: Node) {
    return node.toAST();
  },

  boolean_true(_: x) {
    return true;
  },

  boolean_false(_: x) {
    return false;
  },

  integer(x: Node) {
    return BigInt(this.sourceString as any);
  },

  float(_1: x, _2: x, _3: x) {
    return Number(this.sourceString as any);
  },

  atom(_1: x, _2: x) {
    return this.sourceString;
  },

  keyword(_1: x, _2: x) {
    return this.sourceString;
  },

  actor_name(_sharp: x, name: Node) {
    return name.toAST();
  },

  name(_1: x, _2: x) {
    return this.sourceString;
  },
});
