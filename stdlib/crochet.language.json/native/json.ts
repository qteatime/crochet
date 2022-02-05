import type { ForeignInterface, CrochetValue } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  abstract class Json {
    abstract toJSON(): any;
  }

  class JsonNull extends Json {
    toJSON() {
      return null;
    }
  }

  class JsonNumber extends Json {
    constructor(readonly value: number) {
      super();
    }

    toJSON() {
      return this.value;
    }
  }

  class JsonText extends Json {
    constructor(readonly value: string) {
      super();
    }

    toJSON() {
      return this.value;
    }
  }

  class JsonBoolean extends Json {
    constructor(readonly value: boolean) {
      super();
    }

    toJSON() {
      return this.value;
    }
  }

  class JsonList extends Json {
    constructor(readonly values: Json[]) {
      super();
    }

    toJSON() {
      return this.values;
    }
  }

  class JsonRecord extends Json {
    constructor(readonly entries: [string, Json][]) {
      super();
    }

    toJSON() {
      const result = Object.create(null);
      for (const [k, v] of this.entries) {
        result[k] = v;
      }
      return result;
    }
  }

  class JsonTyped extends Json {
    constructor(readonly tag: string, readonly value: Json) {
      super();
    }

    toJSON() {
      return {
        "@type": this.tag,
        value: this.value,
      };
    }
  }

  const _null = ffi.box(new JsonNull());

  ffi.defun("json.typed", (tag, value) => {
    return ffi.box(
      new JsonTyped(ffi.text_to_string(tag), ffi.unbox_typed(Json, value))
    );
  });

  ffi.defun("json.null", () => {
    return _null;
  });

  ffi.defun("json.boolean", (x) => {
    return ffi.box(new JsonBoolean(ffi.to_js_boolean(x)));
  });

  ffi.defun("json.number", (x) => {
    return ffi.box(new JsonNumber(ffi.float_to_number(x)));
  });

  ffi.defun("json.text", (x) => {
    return ffi.box(new JsonText(ffi.text_to_string(x)));
  });

  ffi.defun("json.list", (x) => {
    return ffi.box(
      new JsonList(ffi.list_to_array(x).map((x) => ffi.unbox_typed(Json, x)))
    );
  });

  ffi.defun("json.record", (x) => {
    return ffi.box(
      new JsonRecord(
        ffi.list_to_array(x).map((p) => {
          const [k, v] = ffi.list_to_array(p);
          return [ffi.text_to_string(k), ffi.unbox_typed(Json, v)];
        })
      )
    );
  });

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
      return x.map((a) => from_json(a));
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

  ffi.defun("json.untrusted", (text) => {
    return ffi.untrusted_text(ffi.text_to_string(text));
  });

  ffi.defun("json.parse", (text, trusted) => {
    return ffi.from_plain_native(
      from_json(JSON.parse(ffi.text_to_string(text))),
      ffi.to_js_boolean(trusted)
    );
  });

  ffi.defun("json.serialise", (value, trusted) => {
    const json = ffi.unbox_typed(Json, value);
    const json_text = JSON.stringify(json);
    if (ffi.to_js_boolean(trusted)) {
      return ffi.text(json_text);
    } else {
      return ffi.untrusted_text(json_text);
    }
  });

  ffi.defun("json.pretty-print", (value, indent, trusted) => {
    const json = to_json(ffi.to_plain_native(value));
    const json_text = JSON.stringify(
      json,
      null,
      Number(ffi.integer_to_bigint(indent))
    );
    if (ffi.to_js_boolean(trusted)) {
      return ffi.text(json_text);
    } else {
      return ffi.untrusted_text(json_text);
    }
  });
};
