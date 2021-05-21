import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  const nan = ffi.float(NaN);
  const inf = ffi.float(Number.POSITIVE_INFINITY);
  const ninf = ffi.float(Number.NEGATIVE_INFINITY);

  // Constants & Tests
  ffi.defun("float.nan", () => nan);

  ffi.defun("float.is-nan", (x) =>
    ffi.boolean(Number.isNaN(ffi.float_to_number(x)))
  );

  ffi.defun("float.is-finite", (x) =>
    ffi.boolean(Number.isFinite(ffi.float_to_number(x)))
  );

  ffi.defun("float.infinity", () => inf);

  ffi.defun("float.negative-infinity", () => ninf);

  ffi.defun("float.trunc", (x) =>
    ffi.float(Math.trunc(ffi.float_to_number(x)))
  );

  ffi.defun("float.floor", (x) =>
    ffi.float(Math.floor(ffi.float_to_number(x)))
  );

  ffi.defun("float.ceil", (x) => ffi.float(Math.ceil(ffi.float_to_number(x))));

  ffi.defun("float.round", (x) =>
    ffi.float(Math.round(ffi.float_to_number(x)))
  );

  // Arithmetic
  ffi.defun("float.add", (x, y) =>
    ffi.float(ffi.float_to_number(x) + ffi.float_to_number(y))
  );

  ffi.defun("float.sub", (x, y) =>
    ffi.float(ffi.float_to_number(x) - ffi.float_to_number(y))
  );

  ffi.defun("float.mul", (x, y) =>
    ffi.float(ffi.float_to_number(x) * ffi.float_to_number(y))
  );

  ffi.defun("float.div", (x, y) =>
    ffi.float(ffi.float_to_number(x) / ffi.float_to_number(y))
  );

  ffi.defun("float.rem", (x, y) =>
    ffi.float(ffi.float_to_number(x) % ffi.float_to_number(y))
  );

  ffi.defun("float.power", (x, y) =>
    ffi.float(ffi.float_to_number(x) ** Number(ffi.integer_to_bigint(y)))
  );

  // Relational
  ffi.defun("float.eq", (x, y) =>
    ffi.boolean(ffi.float_to_number(x) === ffi.float_to_number(y))
  );

  ffi.defun("float.neq", (x, y) =>
    ffi.boolean(ffi.float_to_number(x) !== ffi.float_to_number(y))
  );

  ffi.defun("float.lt", (x, y) =>
    ffi.boolean(ffi.float_to_number(x) < ffi.float_to_number(y))
  );

  ffi.defun("float.lte", (x, y) =>
    ffi.boolean(ffi.float_to_number(x) <= ffi.float_to_number(y))
  );

  ffi.defun("float.gt", (x, y) =>
    ffi.boolean(ffi.float_to_number(x) > ffi.float_to_number(y))
  );

  ffi.defun("float.gte", (x, y) =>
    ffi.boolean(ffi.float_to_number(x) >= ffi.float_to_number(y))
  );

  // Conversion
  ffi.defun("float.to-integer", (x) => {
    return ffi.integer(BigInt(ffi.float_to_number(x)));
  });

  ffi.defun("float.parse", (x0) => {
    const x1 = ffi.text_to_string(x0).trim();
    if (x1 === "") {
      return ffi.nothing;
    } else {
      const x2 = Number(x1);
      if (isNaN(x2)) {
        if (x1 === "NaN") {
          return nan;
        } else {
          return ffi.nothing;
        }
      } else {
        return ffi.float(x2);
      }
    }
  });

  ffi.defun("float.to-text", (x0) => {
    return ffi.text(ffi.float_to_number(x0).toString());
  });
};
