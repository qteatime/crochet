import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  const nan = ffi.float_64(NaN);
  const inf = ffi.float_64(Number.POSITIVE_INFINITY);
  const ninf = ffi.float_64(Number.NEGATIVE_INFINITY);

  // Constants & Tests
  ffi.defun("float-64.nan", () => nan);

  ffi.defun("float-64.is-nan", (x) =>
    ffi.boolean(Number.isNaN(ffi.float_to_number(x)))
  );

  ffi.defun("float-64.is-finite", (x) =>
    ffi.boolean(Number.isFinite(ffi.float_to_number(x)))
  );

  ffi.defun("float-64.infinity", () => inf);

  ffi.defun("float-64.negative-infinity", () => ninf);

  ffi.defun("float-64.trunc", (x) =>
    ffi.float_64(Math.trunc(ffi.float_to_number(x)))
  );

  ffi.defun("float-64.floor", (x) =>
    ffi.float_64(Math.floor(ffi.float_to_number(x)))
  );

  ffi.defun("float-64.ceil", (x) =>
    ffi.float_64(Math.ceil(ffi.float_to_number(x)))
  );

  ffi.defun("float-64.round", (x) =>
    ffi.float_64(Math.round(ffi.float_to_number(x)))
  );

  // Arithmetic
  ffi.defun("float-64.add", (x, y) =>
    ffi.float_64(ffi.float_to_number(x) + ffi.float_to_number(y))
  );

  ffi.defun("float-64.sub", (x, y) =>
    ffi.float_64(ffi.float_to_number(x) - ffi.float_to_number(y))
  );

  ffi.defun("float-64.mul", (x, y) =>
    ffi.float_64(ffi.float_to_number(x) * ffi.float_to_number(y))
  );

  ffi.defun("float-64.div", (x, y) =>
    ffi.float_64(ffi.float_to_number(x) / ffi.float_to_number(y))
  );

  ffi.defun("float-64.rem", (x, y) =>
    ffi.float_64(ffi.float_to_number(x) % ffi.float_to_number(y))
  );

  ffi.defun("float-64.power", (x, y) =>
    ffi.float_64(ffi.float_to_number(x) ** Number(ffi.integer_to_bigint(y)))
  );

  // Relational
  ffi.defun("float-64.eq", (x, y) =>
    ffi.boolean(ffi.float_to_number(x) === ffi.float_to_number(y))
  );

  ffi.defun("float-64.neq", (x, y) =>
    ffi.boolean(ffi.float_to_number(x) !== ffi.float_to_number(y))
  );

  ffi.defun("float-64.lt", (x, y) =>
    ffi.boolean(ffi.float_to_number(x) < ffi.float_to_number(y))
  );

  ffi.defun("float-64.lte", (x, y) =>
    ffi.boolean(ffi.float_to_number(x) <= ffi.float_to_number(y))
  );

  ffi.defun("float-64.gt", (x, y) =>
    ffi.boolean(ffi.float_to_number(x) > ffi.float_to_number(y))
  );

  ffi.defun("float-64.gte", (x, y) =>
    ffi.boolean(ffi.float_to_number(x) >= ffi.float_to_number(y))
  );

  // Conversion
  ffi.defun("float-64.to-integer", (x) => {
    return ffi.integer(BigInt(ffi.float_to_number(x)));
  });

  ffi.defun("float-64.parse", (x0) => {
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
        return ffi.float_64(x2);
      }
    }
  });

  ffi.defun("float-64.to-text", (x0) => {
    return ffi.text(ffi.float_to_number(x0).toString());
  });
};
