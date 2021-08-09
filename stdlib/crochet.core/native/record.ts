import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("record.count", (x) => {
    return ffi.integer(BigInt(ffi.record_to_map(x).size));
  });

  ffi.defun("record.keys", (x) =>
    ffi.list([...ffi.record_to_map(x).keys()].map((x) => ffi.text(x)))
  );

  ffi.defun("record.values", (x) =>
    ffi.list([...ffi.record_to_map(x).values()])
  );

  ffi.defun("record.pairs", (x) => {
    const result = [];
    for (const [k, v] of ffi.record_to_map(x).entries()) {
      const m = new Map([
        ["key", ffi.text(k)],
        ["value", v],
      ]);
      result.push(ffi.record(m));
    }
    return ffi.list(result);
  });

  ffi.defun("record.concat", (x, y) => {
    const result = new Map();
    for (const [k, v] of ffi.record_to_map(x).entries()) {
      result.set(k, v);
    }
    for (const [k, v] of ffi.record_to_map(y).entries()) {
      result.set(k, v);
    }
    return ffi.record(result);
  });

  ffi.defun("record.from-pairs", (xs) => {
    const result = new Map();
    for (const pair0 of ffi.list_to_array(xs)) {
      const pair = ffi.record_to_map(pair0);
      result.set(ffi.text_to_string(pair.get("key")!), pair.get("value"));
    }
    return ffi.record(result);
  });

  ffi.defun("record.at-default", (r, k0, x) => {
    const m = ffi.record_to_map(r);
    const k = ffi.text_to_string(k0);
    if (m.has(k)) {
      return m.get(k)!;
    } else {
      return x;
    }
  });

  ffi.defun("record.has-key", (r0, k0) => {
    const r = ffi.record_to_map(r0);
    const k = ffi.text_to_string(k0);
    return ffi.boolean(r.has(k));
  });

  ffi.defun("record.delete-at", (r0, k0) => {
    const r = ffi.record_to_map(r0);
    const expected = ffi.text_to_string(k0);
    const result = new Map();
    for (const [k, v] of r.entries()) {
      if (k !== expected) {
        result.set(k, v);
      }
    }
    return ffi.record(result);
  });

  ffi.defun("record.at-put", (r0, k0, v0) => {
    const r = ffi.record_to_map(r0);
    const key = ffi.text_to_string(k0);
    const result = new Map();
    for (const [k, v] of r.entries()) {
      result.set(k, v);
    }
    result.set(key, v0);
    return ffi.record(result);
  });
};
