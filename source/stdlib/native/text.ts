import { start } from "repl";
import {
  foreign_namespace,
  foreign,
  machine,
  CrochetInterpolation,
  CrochetTuple,
  InterpolationDynamic,
  CrochetText,
  CrochetValue,
  from_bool,
  CrochetInteger,
  False,
  True,
  CrochetNothing,
  ForeignInterface,
} from "../../runtime";
import { cast } from "../../utils";
import { ForeignNamespace } from "../ffi-def";

export function text_views(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.text:view")
    .defun("lines", [CrochetText], (x) => {
      return new CrochetTuple(
        x.value.split(/\r\n|\r|\n/).map((x) => new CrochetText(x))
      );
    })
    .defun("code-points", [CrochetText], (x) => {
      const points = [];
      for (const point of x.value) {
        points.push(new CrochetInteger(BigInt(point.codePointAt(0))));
      }
      return new CrochetTuple(points);
    })
    .defun("from-code-points", [CrochetTuple], (x) => {
      const points = x.values.map((a) => Number(cast(a, CrochetInteger).value));
      const text = String.fromCodePoint(...points);
      return new CrochetText(text);
    });
}

export function text_core(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.text:core")
    .defun("ends-with", [CrochetText, CrochetText], (a, b) =>
      from_bool(a.value.endsWith(b.value))
    )
    .defun("starts-with", [CrochetText, CrochetText], (a, b) =>
      from_bool(a.value.startsWith(b.value))
    )
    .defun("contains", [CrochetText, CrochetText], (a, b) =>
      from_bool(a.value.includes(b.value))
    )
    .defun(
      "trim-start",
      [CrochetText],
      (x) => new CrochetText(x.value.trimStart())
    )
    .defun("trim-end", [CrochetText], (x) => new CrochetText(x.value.trimEnd()))
    .defun("trim", [CrochetText], (x) => new CrochetText(x.value.trim()))
    .defun("is-empty", [CrochetText], (x) => from_bool(x.value.length === 0))
    .defun("repeat", [CrochetText, CrochetInteger], (x, i) => {
      return new CrochetText(x.value.repeat(Number(i.value)));
    });
}

export function text_ascii(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.text:ascii")
    .defun(
      "to-upper",
      [CrochetText],
      (x) => new CrochetText(x.value.toUpperCase())
    )
    .defun(
      "to-lower",
      [CrochetText],
      (x) => new CrochetText(x.value.toLowerCase())
    )
    .defun("is-ascii", [CrochetText], (a) => {
      for (const x of a.value) {
        if ((x.codePointAt(0) ?? 0) >= 128) {
          return CrochetNothing.instance;
        }
      }
      return True.instance;
    });
}

export default [text_views, text_core, text_ascii];
