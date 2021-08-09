import * as Ohm from "ohm-js";
const OhmUtil = require("ohm-js/src/util");
import type {
  CrochetValue,
  ForeignInterface,
  Machine,
} from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  function to_array(x: CrochetValue | unknown[]) {
    if (Array.isArray(x)) {
      return x;
    } else if (ffi.is_list(x)) {
      return ffi.list_to_array(x);
    } else {
      throw ffi.panic(
        "invalid-type",
        `Expected native array or list, got ${x}`
      );
    }
  }

  const builtin_visitor = {
    _terminal(this: Ohm.Node): any {
      return ffi.text(this.primitiveValue);
    },

    _iter(this: any, children: Ohm.Node): any {
      if (this._node.isOptional()) {
        if (this.numChildren === 0) {
          return ffi.nothing;
        } else {
          return children[0].visit();
        }
      }
      return ffi.list(children.map((x: any) => x.visit()));
    },

    nonemptyListOf(first: Ohm.Node, _: Ohm.Node, rest: Ohm.Node): any {
      return ffi.list([first.visit(), ...to_array(rest.visit())]);
    },

    emptyListOf(): any {
      return ffi.list([]);
    },

    NonemptyListOf(first: Ohm.Node, _: Ohm.Node, rest: Ohm.Node): any {
      return ffi.list([first.visit(), ...to_array(rest.visit())]);
    },

    EmptyListOf(): any {
      return ffi.list([]);
    },
  };

  function to_visitor(visitor0: Map<string, CrochetValue>) {
    const visitor = Object.create(null);
    for (const [k, v] of Object.entries(builtin_visitor)) {
      visitor[k] = v;
    }
    for (const [k, v] of visitor0.entries()) {
      visitor[k] = ffi.unbox(v);
    }
    return visitor;
  }

  ffi.defun("lingua.make-grammar", (text) => {
    const grammar = Ohm.grammar(ffi.text_to_string(text));
    (grammar as any)._checkTopDownActionDict = () => {};
    return ffi.box(grammar);
  });

  ffi.defun("lingua.parse", (grammar0, input0, rule0) => {
    const grammar = ffi.unbox(grammar0) as Ohm.Grammar;
    const input = ffi.text_to_string(input0);
    const rule = ffi.text_to_string(rule0);
    const match = grammar.match(input, rule);
    return ffi.box(match);
  });

  ffi.defun("lingua.succeeded", (match0) => {
    const match = ffi.unbox(match0) as Ohm.MatchResult;
    return ffi.boolean(match.succeeded());
  });

  ffi.defun("lingua.error-message", (match0) => {
    const match = ffi.unbox(match0) as Ohm.MatchResult;
    if (match.message == null) {
      throw ffi.panic("invalid-type", `Not a failed parse tree`);
    }
    return ffi.text(match.message);
  });

  ffi.defun("lingua.make-semantics", (grammar0, visitor0) => {
    const grammar = ffi.unbox(grammar0) as Ohm.Grammar;
    const semantics = grammar.createSemantics();
    semantics.addOperation("visit", to_visitor(ffi.record_to_map(visitor0)));
    return ffi.box(semantics);
  });

  ffi.defun("lingua.apply-semantics", (semantics0, parse_tree0) => {
    const semantics = ffi.unbox(semantics0) as Ohm.Semantics;
    const parse_tree = ffi.unbox(parse_tree0) as Ohm.MatchResult;
    return semantics(parse_tree).visit();
  });

  ffi.defun("lingua.visitor-identity", () => {
    return ffi.box((x: Ohm.Node) => x.visit());
  });

  ffi.defun("lingua.visitor-source", () => {
    return ffi.box(function (this: Ohm.Node) {
      return ffi.text(this.sourceString);
    });
  });

  ffi.defun("lingua.visitor-singleton", () => {
    return ffi.box(function (this: Ohm.Node) {
      return this.children[0].visit();
    });
  });

  ffi.defun("lingua.visitor-lambda", (lambda) => {
    return ffi.box(function (this: Ohm.Node, ...args: Ohm.Node[]) {
      const self = this;
      const fn = function* (): Machine<CrochetValue> {
        return yield ffi.apply(lambda, [
          ffi.box(self),
          ...args.map((x) => x.visit()),
        ]);
      };
      const value = ffi.run_synchronous(fn);
      return value;
    });
  });

  ffi.defun("lingua.interval", (node0) => {
    const node = ffi.unbox(node0) as Ohm.Node;
    return ffi.box(node.source);
  });

  ffi.defun("lingua.interval-position", (interval0) => {
    const interval = ffi.unbox(interval0) as Ohm.Node;
    const { lineNum, colNum } = OhmUtil.getLineAndColumn(
      (interval as any).sourceString,
      interval.startIdx
    );
    return ffi.record(
      new Map([
        ["line", ffi.integer(BigInt(lineNum))],
        ["column", ffi.integer(BigInt(colNum))],
      ])
    );
  });

  ffi.defun("lingua.interval-range", (interval0) => {
    const interval = ffi.unbox(interval0) as Ohm.Interval;
    return ffi.record(
      new Map([
        ["start", ffi.integer(BigInt(interval.startIdx))],
        ["stop", ffi.integer(BigInt(interval.endIdx))],
      ])
    );
  });

  ffi.defun("lingua.interval-source", (interval0) => {
    const interval = ffi.unbox(interval0) as Ohm.Interval;
    return ffi.text(interval.contents);
  });

  ffi.defun("lingua.interval-annotated-source", (interval0) => {
    const interval = ffi.unbox(interval0) as Ohm.Interval;
    return ffi.text(interval.getLineAndColumnMessage());
  });
};
