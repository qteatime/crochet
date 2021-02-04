import * as Ohm from "ohm-js";
import * as Fs from "fs";
import * as Path from "path";
import {
  DDo,
  DFFICommand,
  DLocalCommand,
  DRelation,
  DScene,
  DType,
  EBoolean,
  EFloat,
  EInteger,
  EInvoke,
  ELet,
  ENew,
  ENothing,
  ESearch,
  EText,
  EVariable,
  Expression,
  ManyComponent,
  OneComponent,
  Pattern,
  PBoolean,
  PFloat,
  PInteger,
  PNothing,
  Program,
  PText,
  PType,
  PValue,
  PVariable,
  RelationComponent,
  RelationSignature,
  SearchRelation,
  SExpression,
  SFact,
  SGoto,
  Signature,
  SReturn,
  UseSignature,
} from "./ast";

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

  to_pattern(): Pattern {
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
  constructor(readonly pattern: Pattern) {}

  to_static_part() {
    return "_";
  }

  to_pattern() {
    return this.pattern;
  }
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

  TypeDeclaration(_type: x, name: Node, _semi: x) {
    return new DType(name.toAST());
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

  CommandSignature_single(head: Node) {
    return new Signature(head.toAST(), []);
  },

  CommandSignature_multi(head0: Node, segments0: Node) {
    const head: AtomSegment | VariableSegment = head0.toAST();
    const segments: (AtomSegment | VariableSegment)[] = [
      head,
      ...segments0.toAST(),
    ];
    const name = segments.map((x) => x.to_static_part());
    const params = segments
      .filter((x) => x instanceof VariableSegment)
      .map((x) => x.name);
    return new Signature(name.join(" "), params);
  },

  CommandSignature_infix(left: Node, symbol: Node, right: Node) {
    return new Signature(`_ ${symbol.toAST()} _`, [
      left.toAST(),
      right.toAST(),
    ]);
  },

  SignatureSegment_static(name: Node) {
    return new AtomSegment(name.toAST());
  },

  SignatureSegment_variable(name: Node) {
    return new VariableSegment(name.toAST());
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

  FactStatement(_fact: x, segments0: Node, _semi: x) {
    const segments: (AtomSegment | ExprSegment)[] = segments0.toAST();
    const name = segments.map((x) => x.to_static_part()).join(" ");
    const args = segments
      .filter((x) => x instanceof ExprSegment)
      .map((x) => ((x as any) as ExprSegment).expr);
    return new SFact(name, args);
  },

  FactSegment_static(name: Node) {
    return new AtomSegment(name.toAST());
  },

  FactSegment_variable(expr: Node) {
    return new ExprSegment(expr.toAST());
  },

  StatementBlock(_l: x, stmts: Node, _r: x) {
    return stmts.toAST();
  },

  UseInfix_infix(left: Node, symbol: Node, right: Node) {
    const sig = new UseSignature(`_ ${symbol.toAST()} _`, [
      left.toAST(),
      right.toAST(),
    ]);
    return new EInvoke(sig);
  },

  UseMixfix_multi(head0: Node, segments0: Node) {
    const head: AtomSegment | ExprSegment = head0.toAST();
    const segments: (AtomSegment | ExprSegment)[] = [
      head,
      ...segments0.toAST(),
    ];
    const name = segments.map((x) => x.to_static_part());
    const args = segments
      .filter((x) => x instanceof ExprSegment)
      .map((x) => ((x as any) as ExprSegment).expr);
    const sig = new UseSignature(name.join(" "), args);
    return new EInvoke(sig);
  },

  UseSegment_static(name: Node) {
    return new AtomSegment(name.toAST());
  },

  UseSegment_variable(expr: Node) {
    return new ExprSegment(expr.toAST());
  },

  SearchExpression_search(_search: x, relations: Node) {
    return new ESearch(relations.toAST());
  },

  SearchRelation(segments0: Node) {
    const segments: (AtomSegment | PatternSegment)[] = segments0.toAST();
    const name = segments.map((x) => x.to_static_part()).join(" ");
    const patterns = segments
      .filter((x) => x instanceof PatternSegment)
      .map((x) => x.to_pattern());
    return new SearchRelation(name, patterns);
  },

  SearchSegment_type(name: Node) {
    return new PatternSegment(new PType(name.toAST()));
  },

  SearchSegment_integer(value: Node) {
    return new PatternSegment(new PInteger(value.toAST()));
  },

  SearchSegment_float(value: Node) {
    return new PatternSegment(new PFloat(value.toAST()));
  },

  SearchSegment_text(value: Node) {
    return new PatternSegment(new PText(value.toAST()));
  },

  SearchSegment_boolean(value: Node) {
    return new PatternSegment(new PBoolean(value.toAST()));
  },

  SearchSegment_nothing(_: x) {
    return new PatternSegment(new PNothing());
  },

  SearchSegment_value(_at: x, value: Node) {
    return new PatternSegment(new PValue(value.toAST()));
  },

  SearchSegment_variable(name: Node) {
    return new PatternSegment(new PVariable(name.toAST()));
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

  PrimaryExpression_group(_l: x, expr: Node, _r: x) {
    return expr.toAST();
  },

  NewType(_new: x, name: Node) {
    return new ENew(name.toAST());
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

  type_name(_sharp: x, name: Node) {
    return name.toAST();
  },

  name(_1: x, _2: x) {
    return this.sourceString;
  },
});
