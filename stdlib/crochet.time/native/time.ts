import type { CrochetValue, ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  function parse_iso(text: string) {
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

    for (const [re, f] of m) {
      const match = text.match(re);
      if (match != null) {
        const [Y, M, D, h, m, s, ms] = f(...match);
        return new Date(Y, M, D, h, m, s, ms);
      }
    }

    return null;
  }

  function get_date(x: CrochetValue): Date {
    const result = ffi.unbox(x);
    if (result instanceof Date) {
      return result;
    } else {
      throw ffi.panic("invalid-type", `Invalid native type`);
    }
  }

  ffi.defun("instant.from-ms", (x) => {
    return ffi.box(new Date(Number(ffi.integer_to_bigint(x))));
  });

  ffi.defun("instant.from-iso", (x) => {
    const result = parse_iso(ffi.text_to_string(x));
    if (result == null) {
      return ffi.nothing;
    } else {
      return ffi.box(result);
    }
  });

  ffi.defun("instant.epoch-ms", (x) => {
    return ffi.integer(BigInt(get_date(x).getTime()));
  });

  ffi.defun("instant.to-iso", (x) => {
    const d = get_date(x);
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
    return ffi.text(t);
  });

  // == Date
  ffi.defun("date.year", (x) => {
    return ffi.integer(BigInt(get_date(x).getUTCFullYear()));
  });

  ffi.defun("date.month", (x) => {
    return ffi.integer(BigInt(get_date(x).getUTCMonth() + 1));
  });

  ffi.defun("date.day", (x) => {
    return ffi.integer(BigInt(get_date(x).getUTCDate()));
  });

  ffi.defun("date.hours", (x) => {
    return ffi.integer(BigInt(get_date(x).getUTCHours()));
  });

  ffi.defun("date.minutes", (x) => {
    return ffi.integer(BigInt(get_date(x).getUTCHours()));
  });

  ffi.defun("date.minutes", (x) => {
    return ffi.integer(BigInt(get_date(x).getUTCMinutes()));
  });

  ffi.defun("date.seconds", (x) => {
    return ffi.integer(BigInt(get_date(x).getUTCSeconds()));
  });

  ffi.defun("date.milliseconds", (x) => {
    return ffi.integer(BigInt(get_date(x).getUTCMilliseconds()));
  });
};
