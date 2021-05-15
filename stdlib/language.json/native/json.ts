import type { ForeignInterface, CrochetValue } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  function to_json(x: unknown): unknown {
    if (typeof x === "bigint") {
      return Number(x);
    } else if (Array.isArray(x)) {
      return x.map(to_json);
    } else if (x instanceof Map) {
      const value = Object.create(null);
      for (const [k, v] of x.entries()) {
        value[k] = to_json(v);
      }
      return value;
    } else {
      return x;
    }
  }

  function from_json(x: unknown): unknown {
    if (Array.isArray(x)) {
      return x.map(from_json);
    } else if (typeof x === "object" && x != null) {
      const result = new Map<string, unknown>();
      for (const [k, v] of Object.entries(x)) {
        result.set(k, from_json(v));
      }
      return result;
    } else {
      return x;
    }
  }

  ffi.defun("json.parse", (text) => {
    return ffi.from_plain_native(
      from_json(JSON.parse(ffi.text_to_string(text)))
    );
  });

  ffi.defun("json.serialise", (value) => {
    const json = to_json(ffi.to_plain_native(value));
    return ffi.text(JSON.stringify(json));
  });

  ffi.defun("json.pretty-print", (value, indent) => {
    const json = to_json(ffi.to_plain_native(value));
    return ffi.text(
      JSON.stringify(json, null, Number(ffi.integer_to_bigint(indent)))
    );
  });
};
