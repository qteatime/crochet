"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const Ohm = require("ohm-js");
const Fs = require("fs");
const Path = require("path");
const ast_1 = require("./ast");
const grammarFile = Path.join(__dirname, "../../grammar/dialogue.ohm");
const grammar = Ohm.grammar(Fs.readFileSync(grammarFile, "utf8"));
function parse(source) {
    const match = grammar.match(source);
    if (match.failed()) {
        throw new Error(match.message);
    }
    else {
        return toAST(match).toAST();
    }
}
exports.parse = parse;
const toAST = grammar.createSemantics().addOperation("toAST", {
    Program(phrase, _) {
        return phrase.toAST();
    },
    concatenate_cat(left, right) {
        return new ast_1.ConcatenateNode(left.toAST(), right.toAST());
    },
    word_at_sign(_, __) {
        return new ast_1.TextNode("@");
    },
    word_expr(_, expr) {
        return expr.toAST();
    },
    word_chars(xs) {
        const text = xs.toAST().join("");
        return new ast_1.TextNode(text);
    },
    application_application(name, _1, args, _2) {
        return new ast_1.ApplicationNode(name.toAST(), args.toAST());
    },
    projection_projection(record, _, field) {
        return new ast_1.ProjectionNode(record.toAST(), field.toAST());
    },
    primaryExpr_variable(name) {
        return new ast_1.LoadNode(name.toAST());
    },
    primaryExpr_group(_1, expr, _2) {
        return expr.toAST();
    },
    identifier(start, rest) {
        return new ast_1.IdentifierNode(start.toAST() + rest.toAST().join(""));
    },
    number(digits) {
        return new ast_1.NumberNode(BigInt(digits.toAST().join("")));
    },
    boolean(value) {
        switch (value.toAST()) {
            case "true": return new ast_1.BooleanNode(true);
            case "false": return new ast_1.BooleanNode(false);
            default: throw new Error(`Unknown boolean ${value.toAST()}`);
        }
    },
    text(_1, chars, _2) {
        return JSON.parse(this.primitiveValue.replace(/\n/, "\\n"));
    },
    ws(_, rule) {
        return rule.toAST();
    },
    emptyListOf() {
        return [];
    },
    nonemptyListOf(x, separator, xs) {
        return [x.toAST()].concat(xs.toAST());
    },
    _terminal() {
        return this.primitiveValue;
    }
});
