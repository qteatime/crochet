import * as Ohm from "ohm-js";
import {
  apply,
  CrochetInteger,
  CrochetLambda,
  CrochetNothing,
  CrochetRecord,
  CrochetText,
  CrochetTuple,
  CrochetUnknown,
  CrochetValue,
  cvalue,
  ErrArbitrary,
  ForeignInterface,
  from_bool,
  State,
  Thread,
  type_name,
} from "../../runtime";
import { cast } from "../../utils/utils";
import { ForeignNamespace } from "../ffi-def";
const OhmUtil = require("ohm-js/src/util");

function to_array(x: CrochetTuple | unknown[]) {
  if (x instanceof CrochetTuple) {
    return x.values;
  } else if (Array.isArray(x)) {
    return x;
  } else {
    throw new ErrArbitrary(
      "invalid-type",
      `Expected native array or tuple, got ${type_name(x)}`
    );
  }
}

const builtin_visitor = {
  _terminal(this: Ohm.Node): any {
    return new CrochetText(this.primitiveValue);
  },

  _iter(this: any, children: Ohm.Node): any {
    if (this._node.isOptional()) {
      if (this.numChildren === 0) {
        return CrochetNothing.instance;
      } else {
        return children[0].visit();
      }
    }
    return new CrochetTuple(children.map((x: any) => x.visit()));
  },

  nonemptyListOf(first: Ohm.Node, _: Ohm.Node, rest: Ohm.Node): any {
    return new CrochetTuple([first.visit(), ...to_array(rest.visit())]);
  },

  emptyListOf(): any {
    return new CrochetTuple([]);
  },

  NonemptyListOf(first: Ohm.Node, _: Ohm.Node, rest: Ohm.Node): any {
    return new CrochetTuple([first.visit(), ...to_array(rest.visit())]);
  },

  EmptyListOf(): any {
    return new CrochetTuple([]);
  },
};

function to_visitor(visitor0: CrochetRecord) {
  const visitor = Object.create(null);
  for (const [k, v] of Object.entries(builtin_visitor)) {
    visitor[k] = v;
  }
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
        // We don't care about checking the semantic actions here
        (grammar as any)._checkTopDownActionDict = () => {};
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
        throw new ErrArbitrary("invalid-type", `Not a failed parse tree`);
      }
      return new CrochetText(match.message);
    })
    .defun(
      "make-semantics",
      [CrochetUnknown, CrochetRecord],
      (grammar0, visitor) => {
        const grammar = grammar0.value as Ohm.Grammar;
        const semantics = grammar.createSemantics();
        semantics.addOperation("visit", to_visitor(visitor));
        return new CrochetUnknown(semantics);
      }
    )
    .defun(
      "apply-semantics",
      [CrochetUnknown, CrochetUnknown],
      (semantics0, parse_tree0) => {
        const semantics = semantics0.value as Ohm.Semantics;
        const parse_tree = parse_tree0.value as Ohm.MatchResult;
        return cvalue(semantics(parse_tree).visit());
      }
    )
    .defun("visitor-identity", [], () => {
      return new CrochetUnknown(function (x: Ohm.Node) {
        return x.visit();
      });
    })
    .defun("visitor-source", [], () => {
      return new CrochetUnknown(function (this: Ohm.Node) {
        return new CrochetText(this.sourceString);
      });
    })
    .defun("visitor-singleton", [], () => {
      return new CrochetUnknown(function (this: Ohm.Node) {
        return this.children[0].visit();
      });
    })
    .defmachine("visitor-lambda", [CrochetValue], function* (state, lambda) {
      return new CrochetUnknown(function (this: Ohm.Node, ...args: Ohm.Node[]) {
        const machine = apply(state, lambda, [
          new CrochetUnknown(this),
          ...args.map((x) => x.visit()),
        ]);
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
