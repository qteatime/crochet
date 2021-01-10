import * as Ohm from "ohm-js"
import * as Fs from "fs";
import * as Path from "path";
import { ApplicationNode, BooleanNode, ConcatenateNode, IdentifierNode, LoadNode, Node, NumberNode, ProjectionNode, TextNode } from "./ast";

const grammarFile = Path.join(__dirname, "../../grammar/dialogue.ohm");
const grammar = Ohm.grammar(Fs.readFileSync(grammarFile, "utf8"));

export function parse(source: string): ConcatenateNode {
  const match = grammar.match(source);
  if (match.failed()) {
    throw new Error(match.message);
  } else {
    return toAST(match).toAST();
  }
}

const toAST = grammar.createSemantics().addOperation("toAST", {
  Program(phrase: Ohm.Node, _: Ohm.Node) {
    return phrase.toAST();
  },

  concatenate_cat(left: Ohm.Node, right: Ohm.Node) {
    return new ConcatenateNode(left.toAST(), right.toAST());
  },

  word_at_sign(_: Ohm.Node, __: Ohm.Node) {
    return new TextNode("@");
  },

  word_expr(_: Ohm.Node, expr: Ohm.Node) {
    return expr.toAST();
  },

  word_chars(xs: Ohm.Node) {
    const text = xs.toAST().join("");
    return new TextNode(text);
  },

  application_application(name: Ohm.Node, _1: Ohm.Node, args: Ohm.Node, _2: Ohm.Node) {
    return new ApplicationNode(name.toAST(), args.toAST());
  },

  projection_projection(record: Ohm.Node, _: Ohm.Node, field: Ohm.Node) {
    return new ProjectionNode(record.toAST(), field.toAST());
  },

  primaryExpr_variable(name: Ohm.Node) {
    return new LoadNode(name.toAST());
  },

  primaryExpr_group(_1: Ohm.Node, expr: Ohm.Node, _2: Ohm.Node) {
    return expr.toAST();
  },

  identifier(start: Ohm.Node, rest: Ohm.Node) {
    return new IdentifierNode(start.toAST() + rest.toAST().join(""));
  },

  number(digits: Ohm.Node) {
    return new NumberNode(BigInt(digits.toAST().join("")));
  },

  boolean(value: Ohm.Node) {
    switch (value.toAST()) {
      case "true": return new BooleanNode(true);
      case "false": return new BooleanNode(false);
      default: throw new Error(`Unknown boolean ${value.toAST()}`);
    }
  },

  text(_1: Ohm.Node, chars: Ohm.Node, _2: Ohm.Node) {
    return JSON.parse((this as any).primitiveValue.replace(/\n/, "\\n"));
  },

  ws(_: Ohm.Node, rule: Ohm.Node) {
    return rule.toAST();
  },

  emptyListOf() {
    return [];
  },

  nonemptyListOf(x: Ohm.Node, separator: Ohm.Node, xs: Ohm.Node) {
    return [x.toAST()].concat(xs.toAST());
  },

  _terminal() {
    return this.primitiveValue;
  }
});