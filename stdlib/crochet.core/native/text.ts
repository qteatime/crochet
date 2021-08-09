import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("text.concat", (x, y) => {
    return ffi.text(ffi.text_to_string(x) + ffi.text_to_string(y));
  });

  ffi.defun("interpolation.concat", (x, y) => {
    return ffi.concat_interpolation(x, y);
  });

  ffi.defun("interpolation.parts", (x) => {
    return ffi.list(
      ffi.interpolation_to_parts(x).map((x) => {
        if (typeof x === "string") {
          return ffi.static_text(x);
        } else {
          return x;
        }
      })
    );
  });

  ffi.defun("interpolation.holes", (x) => {
    return ffi.list(
      ffi.interpolation_to_parts(x).filter((x) => typeof x !== "string") as any
    );
  });

  ffi.defun("interpolation.static-text", (x) => {
    return ffi.text(
      ffi
        .interpolation_to_parts(x)
        .map((x) => {
          if (typeof x === "string") {
            return x;
          } else {
            return "[_]";
          }
        })
        .join("")
    );
  });

  ffi.defun("interpolation.to-plain-text", (x) => {
    function flatten(x: any): string {
      return ffi
        .interpolation_to_parts(x)
        .map((x) => {
          if (typeof x === "string") {
            return x;
          } else if (ffi.is_interpolation(x)) {
            return flatten(x);
          } else {
            return ffi.text_to_string(x);
          }
        })
        .join("");
    }

    return ffi.text(flatten(x));
  });

  ffi.defun("interpolation.normalise", (x) => {
    return ffi.normalise_interpolation(x);
  });

  ffi.defun("text.repeat", (x0, n0) => {
    const x = ffi.text_to_string(x0);
    const n = Number(ffi.integer_to_bigint(n0));
    return ffi.text(x.repeat(n));
  });

  ffi.defun("text.lines", (x0) => {
    const x = ffi.text_to_string(x0);
    const lines = x.split(/\r\n|\r|\n/).map((x) => ffi.text(x));
    return ffi.list(lines);
  });

  ffi.defun("text.code-points", (x0) => {
    const points = [];
    for (const point of ffi.text_to_string(x0)) {
      points.push(ffi.integer(BigInt(point.codePointAt(0)!)));
    }
    return ffi.list(points);
  });

  ffi.defun("text.from-code-points", (x0) => {
    const points = ffi
      .list_to_array(x0)
      .map((a) => Number(ffi.integer_to_bigint(a)));
    const text = String.fromCodePoint(...points);
    return ffi.text(text);
  });

  ffi.defun("text.ends-with", (a, b) => {
    return ffi.boolean(ffi.text_to_string(a).endsWith(ffi.text_to_string(b)));
  });

  ffi.defun("text.starts-with", (a, b) => {
    return ffi.boolean(ffi.text_to_string(a).startsWith(ffi.text_to_string(b)));
  });

  ffi.defun("text.contains", (a, b) => {
    return ffi.boolean(ffi.text_to_string(a).includes(ffi.text_to_string(b)));
  });

  ffi.defun("text.trim-start", (a) => {
    return ffi.text(ffi.text_to_string(a).trimStart());
  });

  ffi.defun("text.trim-end", (a) => {
    return ffi.text(ffi.text_to_string(a).trimEnd());
  });

  ffi.defun("text.trim", (a) => {
    return ffi.text(ffi.text_to_string(a).trim());
  });

  ffi.defun("text.to-upper", (a) => {
    return ffi.text(ffi.text_to_string(a).toUpperCase());
  });

  ffi.defun("text.to-lower", (a) => {
    return ffi.text(ffi.text_to_string(a).toLowerCase());
  });

  ffi.defun("text.is-ascii", (a) => {
    for (const x of ffi.text_to_string(a)) {
      if ((x.codePointAt(0) ?? 0) >= 128) {
        return ffi.false;
      }
    }
    return ffi.true;
  });

  ffi.defun("text.from-lines", (xs) => {
    let result = "";
    let first = true;
    for (const x of ffi.list_to_array(xs)) {
      if (!first) {
        result += "\n";
      }
      result += ffi.text_to_string(x);
      first = false;
    }
    return ffi.text(result);
  });
};
