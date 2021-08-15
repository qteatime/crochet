import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("list.count", (xs) =>
    ffi.integer(BigInt(ffi.list_to_array(xs).length))
  );

  ffi.defun("list.concat", (xs, ys) => {
    return ffi.list(ffi.list_to_array(xs).concat(ffi.list_to_array(ys)));
  });

  ffi.defun("list.slice", (xs0, from0, to0) => {
    const xs = ffi.list_to_array(xs0);
    const from = ffi.integer_to_bigint(from0);
    const to = ffi.integer_to_bigint(to0);

    return ffi.list(xs.slice(Number(from) - 1, Number(to)));
  });

  ffi.defun("list.at", (xs, i) => {
    return ffi.list_to_array(xs)[Number(ffi.integer_to_bigint(i)) - 1];
  });

  ffi.defun("list.at-put", (xs, i, v) => {
    const result = ffi.list_to_array(xs).slice();
    result[Number(ffi.integer_to_bigint(i)) - 1] = v;
    return ffi.list(result);
  });

  ffi.defun("list.at-delete", (xs, i0) => {
    const result = [];
    const values = ffi.list_to_array(xs);
    const target = Number(ffi.integer_to_bigint(i0)) - 1;
    for (let i = 0; i < values.length; ++i) {
      if (i !== target) {
        result.push(values[i]);
      }
    }
    return ffi.list(result);
  });

  ffi.defun("list.at-insert", (xs0, i0, x) => {
    const xs = ffi.list_to_array(xs0).slice();
    const i = ffi.integer_to_bigint(i0);
    xs.splice(Number(i) - 1, 0, x);
    return ffi.list(xs);
  });

  ffi.defun("list.after-insert", (xs0, i0, x) => {
    const xs = ffi.list_to_array(xs0).slice();
    const i = ffi.integer_to_bigint(i0);
    xs.splice(Number(i), 0, x);
    return ffi.list(xs);
  });

  ffi.defun("list.reverse", (xs0) => {
    const source = ffi.list_to_array(xs0);
    const result = [];
    for (let i = source.length - 1; i >= 0; i--) {
      result.push(source[i]);
    }
    return ffi.list(result);
  });

  ffi.defmachine("list.zip-with", function* (xs0, ys0, fn0) {
    const xs = ffi.list_to_array(xs0);
    const ys = ffi.list_to_array(ys0);
    if (xs.length !== ys.length) {
      throw ffi.panic("invalid-size", `Cannot zip lists of different lengths`);
    }

    const result = [];
    for (let i = 0; i < xs.length; ++i) {
      const x = xs[i];
      const y = ys[i];
      const v = yield ffi.apply(fn0, [x, y]);
      result.push(v);
    }

    return ffi.list(result);
  });

  ffi.defmachine("list.fold", function* (xs0, z0, f0) {
    let acc = z0;
    for (const x of ffi.list_to_array(xs0)) {
      acc = yield ffi.apply(f0, [acc, x]);
    }
    return acc;
  });

  ffi.defmachine("list.foldr", function* (xs0, z0, f0) {
    let acc = z0;
    const xs = ffi.list_to_array(xs0);
    for (let i = xs.length - 1; i >= 0; --i) {
      const x = xs[i];
      acc = yield ffi.apply(f0, [x, acc]);
    }
    return acc;
  });

  ffi.defmachine("list.flatmap", function* (xs0, f0) {
    const result = [];
    for (const x of ffi.list_to_array(xs0)) {
      const ys = yield ffi.apply(f0, [x]);
      for (const y of ffi.list_to_array(ys)) {
        result.push(y);
      }
    }
    return ffi.list(result);
  });

  ffi.defmachine("list.map", function* (xs0, f0) {
    const result = [];
    for (const x of ffi.list_to_array(xs0)) {
      const y = yield ffi.apply(f0, [x]);
      result.push(y);
    }
    return ffi.list(result);
  });

  ffi.defmachine("list.unique", function* (xs0) {
    const result = [];
    outer: for (const x of ffi.list_to_array(xs0)) {
      for (const y of result) {
        if (ffi.intrinsic_equals(x, y)) {
          continue outer;
        }
      }
      result.push(x);
    }

    return ffi.list(result);
  });

  ffi.defmachine("list.contains", function* (xs, y) {
    for (const x of ffi.list_to_array(xs)) {
      if (ffi.intrinsic_equals(x, y)) {
        return ffi.true;
      }
    }
    return ffi.false;
  });

  ffi.defmachine("list.sort", function* (xs, f0) {
    const result = ffi.list_to_array(xs).slice();
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
    return ffi.list(result);
  });
};
