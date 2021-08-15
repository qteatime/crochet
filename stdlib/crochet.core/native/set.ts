import type {
  CrochetValue,
  ForeignInterface,
  ISet,
} from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  const Set = ffi.collection.Set;
  const isSet = ffi.collection.isSet;

  function get_set(x0: CrochetValue) {
    const x = ffi.unbox(x0);
    if (!isSet(x)) {
      throw ffi.panic("invalid-type", "Expected a set");
    }
    return x as any as ISet<CrochetValue>;
  }

  ffi.defun("set.count", (x) => {
    return ffi.integer(BigInt(get_set(x).size));
  });

  ffi.defun("set.contains", (x, v) => {
    return ffi.boolean(get_set(x).has(v));
  });

  ffi.defun("set.make-from-list", (xs) => {
    return ffi.box(Set(ffi.list_to_array(xs)));
  });

  ffi.defun("set.equals", (a, b) => {
    return ffi.boolean(get_set(a).equals(get_set(b)));
  });

  ffi.defun("set.add", (x, v) => {
    return ffi.box(get_set(x).add(v));
  });

  ffi.defun("set.remove", (x, v) => {
    return ffi.box(get_set(x).remove(v));
  });

  ffi.defun("set.values", (x) => {
    return ffi.list([...get_set(x).values()]);
  });

  ffi.defun("set.union", (a, b) => {
    return ffi.box(get_set(a).union(get_set(b)));
  });

  ffi.defun("set.intersection", (a, b) => {
    return ffi.box(get_set(a).intersect(get_set(b)));
  });

  ffi.defun("set.complement", (a, b) => {
    return ffi.box(get_set(a).subtract(get_set(b)));
  });

  ffi.defmachine("set.map", function* (a, f) {
    let result = Set();
    for (const x of get_set(a)) {
      const v = yield ffi.apply(f, [x]);
      result = result.add(v);
    }
    return ffi.box(result);
  });

  ffi.defmachine("set.flatmap", function* (a, f) {
    let result = Set();
    for (const x of get_set(a)) {
      const v = yield ffi.apply(f, [x]);
      result = result.union(get_set(v));
    }
    return ffi.box(result);
  });

  ffi.defmachine("set.filter", function* (a, f) {
    let result = Set();
    for (const x of get_set(a)) {
      const v = yield ffi.apply(f, [x]);
      if (ffi.to_js_boolean(v)) {
        result = result.add(x);
      }
    }
    return ffi.box(result);
  });

  ffi.defmachine("set.fold", function* (a, z, f) {
    let acc: CrochetValue = z;
    for (const x of get_set(a)) {
      acc = yield ffi.apply(f, [acc, x]);
    }
    return acc;
  });
};
