import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  // Arithmetic
  ffi.defun("integer.add", (x, y) =>
    ffi.integer(ffi.integer_to_bigint(x) + ffi.integer_to_bigint(y))
  );

  ffi.defun("integer.sub", (x, y) =>
    ffi.integer(ffi.integer_to_bigint(x) - ffi.integer_to_bigint(y))
  );

  ffi.defun("integer.mul", (x, y) =>
    ffi.integer(ffi.integer_to_bigint(x) * ffi.integer_to_bigint(y))
  );

  ffi.defun("integer.div", (x, y) =>
    ffi.integer(ffi.integer_to_bigint(x) / ffi.integer_to_bigint(y))
  );

  ffi.defun("integer.rem", (x, y) =>
    ffi.integer(ffi.integer_to_bigint(x) % ffi.integer_to_bigint(y))
  );

  ffi.defun("integer.power", (x, y) =>
    ffi.integer(ffi.integer_to_bigint(x) ** ffi.integer_to_bigint(y))
  );

  // Relational
  ffi.defun("integer.eq", (x, y) =>
    ffi.boolean(ffi.integer_to_bigint(x) === ffi.integer_to_bigint(y))
  );

  ffi.defun("integer.neq", (x, y) =>
    ffi.boolean(ffi.integer_to_bigint(x) !== ffi.integer_to_bigint(y))
  );

  ffi.defun("integer.lt", (x, y) =>
    ffi.boolean(ffi.integer_to_bigint(x) < ffi.integer_to_bigint(y))
  );

  ffi.defun("integer.lte", (x, y) =>
    ffi.boolean(ffi.integer_to_bigint(x) <= ffi.integer_to_bigint(y))
  );

  ffi.defun("integer.gt", (x, y) =>
    ffi.boolean(ffi.integer_to_bigint(x) > ffi.integer_to_bigint(y))
  );

  ffi.defun("integer.gte", (x, y) =>
    ffi.boolean(ffi.integer_to_bigint(x) >= ffi.integer_to_bigint(y))
  );

  // Conversion
  ffi.defun("integer.to-float", (x) => {
    return ffi.float(Number(ffi.integer_to_bigint(x)));
  });

  ffi.defun("integer.parse", (x0) => {
    const x1 = ffi.text_to_string(x0);
    try {
      return ffi.integer(BigInt(x1));
    } catch (_) {
      return ffi.nothing;
    }
  });

  ffi.defun("integer.to-text", (x0) => {
    const x1 = ffi.integer_to_bigint(x0);
    return ffi.text(x1.toString());
  });

  // Enumeration
  ffi.defun("integer.range", (from0, to0, by0) => {
    const from = ffi.integer_to_bigint(from0);
    const to = ffi.integer_to_bigint(to0);
    const by = ffi.integer_to_bigint(by0);

    const result = [];
    for (let i = from; i <= to; i += by) {
      result.push(ffi.integer(i));
    }
    return ffi.list(result);
  });
};
