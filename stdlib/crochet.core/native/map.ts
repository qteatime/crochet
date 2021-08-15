import type {
  CrochetValue,
  ForeignInterface,
  IMap,
} from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  const Map = ffi.collection.Map;
  const isMap = ffi.collection.isMap;

  function get_map(x0: CrochetValue): IMap<CrochetValue, CrochetValue> {
    const x = ffi.unbox(x0);
    if (isMap(x)) {
      return x as any;
    } else {
      throw ffi.panic("invalid-type", "Expected a Map");
    }
  }

  ffi.defun("map.make-from-list", (pairs0) => {
    const pairs = ffi.list_to_array(pairs0);
    const result = Map().withMutations((map) => {
      for (const pair of pairs) {
        const [k, v] = ffi.list_to_array(pair);
        map.set(k, v);
      }
    });
    return ffi.box(result);
  });

  ffi.defun("map.empty", () => {
    return ffi.box(Map());
  });

  ffi.defun("map.keys", (x) => {
    return ffi.list([...get_map(x).keys()]);
  });

  ffi.defun("map.values", (x) => {
    return ffi.list([...get_map(x).values()]);
  });

  ffi.defun("map.entries", (x) => {
    return ffi.list([...get_map(x).entries()].map((x) => ffi.list(x)));
  });

  ffi.defun("map.set", (x, k, v) => {
    return ffi.box(get_map(x).set(k, v));
  });

  ffi.defun("map.at", (x, k) => {
    const result = get_map(x).get(k);
    if (result == null) {
      throw ffi.panic("invalid-key", `key ${k} is not in the map`);
    }
    return result;
  });

  ffi.defun("map.has", (x, k) => {
    return ffi.boolean(get_map(x).has(k));
  });

  ffi.defun("map.remove", (x, k) => {
    return ffi.box(get_map(x).remove(k));
  });

  ffi.defun("map.count", (x) => {
    return ffi.integer(BigInt(get_map(x).size));
  });

  ffi.defun("map.equals", (x, y) => {
    return ffi.boolean(get_map(x).equals(get_map(y)));
  });

  ffi.defun("map.merge", (x, y) => {
    return ffi.box(get_map(x).merge(get_map(y)));
  });

  ffi.defmachine("map.flatmap", function* (x, f) {
    let result = Map();
    for (const pair of get_map(x).entries()) {
      const map = get_map(yield ffi.apply(f, [ffi.list(pair)]));
      result = result.withMutations((m) => {
        for (const [k, v] of map) {
          m.set(k, v);
        }
      });
    }
    return ffi.box(result);
  });

  ffi.defmachine("map.filter", function* (x, f) {
    let result = Map().asMutable();
    for (const pair of get_map(x).entries()) {
      const include = ffi.to_js_boolean(yield ffi.apply(f, [ffi.list(pair)]));
      if (include) {
        const [k, v] = pair;
        result = result.set(k, v);
      }
    }
    return ffi.box(result.asImmutable());
  });

  ffi.defmachine("map.fold", function* (x, z, f) {
    let state = z;
    for (const pair of get_map(x).entries()) {
      state = yield ffi.apply(f, [state, ffi.list(pair)]);
    }
    return state;
  });

  ffi.defmachine("map.map", function* (x, f) {
    let result = Map().asMutable();
    for (const pair0 of get_map(x).entries()) {
      const [k, v] = ffi.list_to_array(yield ffi.apply(f, [ffi.list(pair0)]));
      result = result.set(k, v);
    }
    return ffi.box(result.asImmutable());
  });
};
