import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("tuple.count", (xs) =>
    ffi.integer(BigInt(ffi.tuple_to_array(xs).length))
  );

  ffi.defun("tuple.concat", (xs, ys) => {
    return ffi.tuple(ffi.tuple_to_array(xs).concat(ffi.tuple_to_array(ys)));
  });

  ffi.defun("tuple.slice", (xs0, from0, to0) => {
    const xs = ffi.tuple_to_array(xs0);
    const from = ffi.integer_to_bigint(from0);
    const to = ffi.integer_to_bigint(to0);

    return ffi.tuple(xs.slice(Number(from) - 1, Number(to)));
  });

  ffi.defun("tuple.at", (xs, i) => {
    return ffi.tuple_to_array(xs)[Number(ffi.integer_to_bigint(i)) - 1];
  });

  ffi.defun("tuple.at-put", (xs, i, v) => {
    const result = ffi.tuple_to_array(xs).slice();
    result[Number(ffi.integer_to_bigint(i)) - 1] = v;
    return ffi.tuple(result);
  });

  ffi.defun("tuple.at-delete", (xs, i0) => {
    const result = [];
    const values = ffi.tuple_to_array(xs);
    const target = Number(ffi.integer_to_bigint(i0)) - 1;
    for (let i = 0; i < values.length; ++i) {
      if (i !== target) {
        result.push(values[i]);
      }
    }
    return ffi.tuple(result);
  });

  ffi.defun("tuple.at-insert", (xs0, i0, x) => {
    const xs = ffi.tuple_to_array(xs0).slice();
    const i = ffi.integer_to_bigint(i0);
    xs.splice(Number(i) - 1, 0, x);
    return ffi.tuple(xs);
  });

  ffi.defun("tuple.reverse", (xs0) => {
    const source = ffi.tuple_to_array(xs0);
    const result = [];
    for (let i = source.length - 1; i >= 0; i--) {
      result.push(source[i]);
    }
    return ffi.tuple(result);
  });

  ffi.defmachine("tuple.zip-with", function* (xs0, ys0, fn0) {
    const xs = ffi.tuple_to_array(xs0);
    const ys = ffi.tuple_to_array(ys0);
    if (xs.length !== ys.length) {
      throw ffi.panic("invalid-size", `Cannot zip tuples of different lengths`);
    }

    const result = [];
    for (let i = 0; i < xs.length; ++i) {
      const x = xs[i];
      const y = ys[i];
      const v = yield ffi.apply(fn0, [x, y]);
      result.push(v);
    }

    return ffi.tuple(result);
  });

  ffi.defmachine("tuple.fold", function* (xs0, z0, f0) {
    let acc = z0;
    for (const x of ffi.tuple_to_array(xs0)) {
      acc = yield ffi.apply(f0, [acc, x]);
    }
    return acc;
  });

  ffi.defmachine("tuple.foldr", function* (xs0, z0, f0) {
    let acc = z0;
    const xs = ffi.tuple_to_array(xs0);
    for (let i = xs.length - 1; i >= 0; --i) {
      const x = xs[i];
      acc = yield ffi.apply(f0, [x, acc]);
    }
    return acc;
  });

  ffi.defmachine("tuple.flatmap", function* (xs0, f0) {
    const result = [];
    for (const x of ffi.tuple_to_array(xs0)) {
      const ys = yield ffi.apply(f0, [x]);
      for (const y of ffi.tuple_to_array(ys)) {
        result.push(y);
      }
    }
    return ffi.tuple(result);
  });

  ffi.defmachine("tuple.map", function* (xs0, f0) {
    const result = [];
    for (const x of ffi.tuple_to_array(xs0)) {
      const y = yield ffi.apply(f0, [x]);
      result.push(y);
    }
    return ffi.tuple(result);
  });

  ffi.defmachine("tuple.unique", function* (xs0) {
    const result = [];
    outer: for (const x of ffi.tuple_to_array(xs0)) {
      for (const y of result) {
        if (ffi.intrinsic_equals(x, y)) {
          continue outer;
        }
      }
      result.push(x);
    }

    return ffi.tuple(result);
  });

  ffi.defmachine("tuple.contains", function* (xs, y) {
    for (const x of ffi.tuple_to_array(xs)) {
      if (ffi.intrinsic_equals(x, y)) {
        return ffi.true;
      }
    }
    return ffi.false;
  });

  ffi.defmachine("tuple.sort", function* (xs, f0) {
    const result = ffi.tuple_to_array(xs).slice();
    outer: for (let i = 1; i < result.length; ++i) {
      for (let j = i; j > 0; --j) {
        const x = result[j - 1];
        const y = result[j];
        const ord = ffi.integer_to_bigint(yield ffi.apply(f0, [x, y]));
        if (ord > 0n) {
          result[j - 1] = y;
          result[j] = x;
        } else {
          continue outer;
        }
      }
    }
    return ffi.tuple(result);
  });
};
