import * as Ohm from "ohm-js";
import {
  apply,
  CrochetInteger,
  CrochetLambda,
  CrochetRecord,
  CrochetText,
  CrochetUnknown,
  CrochetValue,
  cvalue,
  ForeignInterface,
  from_bool,
  State,
  Thread,
} from "../../runtime";
import { cast } from "../../utils";
import { ForeignNamespace } from "../ffi-def";
const OhmUtil = require("ohm-js/src/util");

function to_visitor(visitor0: CrochetRecord) {
  const visitor = Object.create(null);
  for (const [k, v] of visitor0.values) {
    visitor[k] = cast(v, CrochetUnknown).value;
  }
  return visitor;
}

export function lingua_ffi(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.text.parsing.lingua:lingua")
    .defun("make-grammar", [CrochetText], (text) => {
      const grammar = Ohm.grammar(text.value);
      return new CrochetUnknown(grammar);
    })
    .defun(
      "parse",
      [CrochetUnknown, CrochetText, CrochetText],
      (grammar0, input, rule) => {
        const grammar = grammar0.value as Ohm.Grammar;
        const match = grammar.match(input.value, rule.value);
        return new CrochetUnknown(match);
      }
    )
    .defun("succeeded", [CrochetUnknown], (match0) => {
      const match = match0.value as Ohm.MatchResult;
      return from_bool(match.succeeded());
    })
    .defun("error-message", [CrochetUnknown], (match0) => {
      const match = match0.value as Ohm.MatchResult;
      if (match.message == null) {
        throw new Error(`non-failed parse tree`);
      }
      return new CrochetText(match.message);
    })
    .defun(
      "make-semantics",
      [CrochetUnknown, CrochetText, CrochetRecord],
      (grammar0, name, visitor) => {
        const grammar = grammar0.value as Ohm.Grammar;
        const semantics = grammar.createSemantics();
        semantics.addOperation(name.value, to_visitor(visitor));
        return new CrochetUnknown(semantics);
      }
    )
    .defun("visitor-identity", [], () => {
      return new CrochetUnknown((self: Ohm.Node) => self.toAST());
    })
    .defun("visitor-source", [], () => {
      return new CrochetUnknown(
        (self: Ohm.Node) => new CrochetText(self.sourceString)
      );
    })
    .defun("visitor-singleton", [], () => {
      return new CrochetUnknown((self: Ohm.Node) => self.children[0].toAst());
    })
    .defmachine("visitor-lambda", [CrochetValue], function* (state, lambda) {
      return new CrochetUnknown((...args: Ohm.Node[]) => {
        const machine = apply(
          state,
          lambda,
          args.map((x) => new CrochetUnknown(x))
        );
        const value = Thread.for_machine(machine).run_sync();
        return cvalue(value);
      });
    })
    .defun("interval", [CrochetUnknown], (node0) => {
      const node = node0.value as Ohm.Node;
      return new CrochetUnknown(node.source);
    })
    .defun("interval-position", [CrochetUnknown], (interval0) => {
      const interval = interval0.value as Ohm.Interval;
      const { lineNum, colNum } = OhmUtil.getLineAndColumn(
        (interval as any).sourceString,
        interval.startIdx
      );
      return new CrochetRecord(
        new Map([
          ["line", new CrochetInteger(BigInt(lineNum))],
          ["column", new CrochetInteger(BigInt(colNum))],
        ])
      );
    })
    .defun("interval-range", [CrochetUnknown], (interval0) => {
      const interval = interval0.value as Ohm.Interval;
      return new CrochetRecord(
        new Map([
          ["start", new CrochetInteger(BigInt(interval.startIdx))],
          ["stop", new CrochetInteger(BigInt(interval.endIdx))],
        ])
      );
    })
    .defun("interval-source", [CrochetUnknown], (interval0) => {
      const interval = interval0.value as Ohm.Interval;
      return new CrochetText(interval.contents);
    })
    .defun("interval-annotated-source", [CrochetUnknown], (interval0) => {
      const interval = interval0.value as Ohm.Interval;
      return new CrochetText(interval.getLineAndColumnMessage());
    });
}

export default [lingua_ffi];
