import {
  box,
  CrochetInteger,
  CrochetNothing,
  CrochetText,
  CrochetUnknown,
  False,
  ForeignInterface,
  unbox,
  _await,
} from "../../runtime";
import { delay, nothing } from "../../utils";
import { ForeignNamespace } from "../ffi-def";

export function time_ffi(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.time:time").defmachine(
    "sleep",
    [CrochetInteger],
    function* (_, ms) {
      yield _await(delay(Number(ms.value)));
      return CrochetNothing.instance;
    }
  );
}

export function pure_instant_ffi(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.time:instant")
    .defun("from-ms", [CrochetInteger], (x) => {
      return box(new Date(Number(x.value)));
    })
    .defun("from-iso", [CrochetText], (x) => {
      const m: [RegExp, (...str: string[]) => number[]][] = [
        [
          /^(\d+)-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d+)$/,
          (_, y, m, d, h, mm, ss, ms) => [+y, +m, +d, +h, +mm, +ss, +ms],
        ],
        [
          /^(\d+)-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/,
          (_, y, m, d, h, mm, ss) => [+y, +m, +d, +h, +mm, +ss, 0],
        ],
        [/^(\d+)-(\d{2})-(\d{2})$/, (_, y, m, d) => [+y, +m, +d, 0, 0, 0, 0]],
      ];

      const text = x.value;
      for (const [re, f] of m) {
        const match = text.match(re);
        if (match != null) {
          const [Y, M, D, h, m, s, ms] = f(...match);
          return box(new Date(Y, M, D, h, m, s, ms));
        }
      }

      return CrochetNothing.instance;
    })
    .defun(
      "epoch-ms",
      [CrochetUnknown],
      (x) => new CrochetInteger(BigInt(unbox<Date>(x).getDate()))
    )
    .defun("to-iso", [CrochetUnknown], (x) => {
      const d = unbox<Date>(x);
      const t = `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${d
        .getDate()
        .toString()
        .padStart(2, "0")}T${d
        .getHours()
        .toString()
        .padStart(2, "0")}:${d
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${d
        .getSeconds()
        .toString()
        .padStart(2, "0")}.${d.getMilliseconds().toString()}`;
      return new CrochetText(t);
    });

  new ForeignNamespace(ffi, "crochet.time:date")
    .defun("year", [CrochetUnknown], (x) => {
      return new CrochetInteger(BigInt(unbox<Date>(x).getUTCFullYear()));
    })
    .defun("month", [CrochetUnknown], (x) => {
      return new CrochetInteger(BigInt(unbox<Date>(x).getUTCMonth() + 1));
    })
    .defun("day", [CrochetUnknown], (x) => {
      return new CrochetInteger(BigInt(unbox<Date>(x).getUTCDate()));
    })
    .defun("hours", [CrochetUnknown], (x) => {
      return new CrochetInteger(BigInt(unbox<Date>(x).getUTCHours()));
    })
    .defun("minutes", [CrochetUnknown], (x) => {
      return new CrochetInteger(BigInt(unbox<Date>(x).getUTCMinutes()));
    })
    .defun("seconds", [CrochetUnknown], (x) => {
      return new CrochetInteger(BigInt(unbox<Date>(x).getUTCSeconds()));
    })
    .defun("milliseconds", [CrochetUnknown], (x) => {
      return new CrochetInteger(BigInt(unbox<Date>(x).getUTCMilliseconds()));
    });
}

export function wall_clock_ffi(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.time.wall-clock:clock").defun(
    "now",
    [],
    () => new CrochetInteger(BigInt(new Date().getTime()))
  );
}

export default [time_ffi, pure_instant_ffi, wall_clock_ffi];
