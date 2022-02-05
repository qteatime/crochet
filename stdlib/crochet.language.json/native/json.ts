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

  const _null = new JsonNull();

  function make_reify(extended: boolean) {
    function reify_json(key: string, value: unknown) {
      if (value instanceof Json) {
        return value;
      } else if (value == null) {
        return _null;
      } else if (typeof value === "number") {
        return new JsonNumber(value);
      } else if (typeof value === "boolean") {
        return new JsonBoolean(value);
      } else if (typeof value === "string") {
        return new JsonText(value);
      } else if (Array.isArray(value)) {
        return new JsonList(value);
      } else if (extended && typeof value === "object" && "@type" in value) {
        if (!((value as any)["@type"] instanceof JsonText)) {
          throw ffi.panic("invalid-type", "expected text");
        }
        if (!("value" in value)) {
          throw ffi.panic("invalid-type", "expected a proper typed json");
        }
        const type = ((value as any)["@type"] as JsonText).value;
        const v = (value as any).value;
        return new JsonTyped(type, v);
      } else {
        return new JsonRecord(Object.entries(value as any));
      }
    }

    return reify_json;
  }

  ffi.defun("json.typed", (tag, value) => {
    return ffi.box(
      new JsonTyped(ffi.text_to_string(tag), ffi.unbox_typed(Json, value))
    );
  });

  ffi.defun("json.null", () => {
    return ffi.box(_null);
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

  ffi.defun("json.untrusted", (text) => {
    return ffi.untrusted_text(ffi.text_to_string(text));
  });

  ffi.defun("json.parse", (text, extended0) => {
    const extended = ffi.to_js_boolean(extended0);
    const value = JSON.parse(ffi.text_to_string(text), make_reify(extended));
    return ffi.box(value);
  });

  ffi.defun("json.get-type", (x0) => {
    const x = ffi.unbox_typed(Json, x0);
    if (x instanceof JsonNull) {
      return ffi.text("null");
    } else if (x instanceof JsonNumber) {
      return ffi.text("number");
    } else if (x instanceof JsonText) {
      return ffi.text("text");
    } else if (x instanceof JsonBoolean) {
      return ffi.text("boolean");
    } else if (x instanceof JsonList) {
      return ffi.text("list");
    } else if (x instanceof JsonRecord) {
      return ffi.text("record");
    } else if (x instanceof JsonTyped) {
      return ffi.text("typed");
    } else {
      throw ffi.panic("invalid-type", "invalid json type");
    }
  });

  ffi.defun("json.get-number", (x) => {
    return ffi.float_64(ffi.unbox_typed(JsonNumber, x).value);
  });

  ffi.defun("json.get-boolean", (x) => {
    return ffi.boolean(ffi.unbox_typed(JsonBoolean, x).value);
  });

  ffi.defun("json.get-text", (x) => {
    return ffi.text(ffi.unbox_typed(JsonText, x).value);
  });

  ffi.defun("json.get-list", (x) => {
    return ffi.list(ffi.unbox_typed(JsonList, x).values.map((x) => ffi.box(x)));
  });

  ffi.defun("json.get-record-entries", (x) => {
    return ffi.list(
      ffi.unbox_typed(JsonRecord, x).entries.map(([k, v]) => {
        return ffi.list([ffi.text(k), ffi.box(v)]);
      })
    );
  });

  ffi.defun("json.get-typed-tag", (x) => {
    return ffi.text(ffi.unbox_typed(JsonTyped, x).tag);
  });

  ffi.defun("json.get-typed-value", (x) => {
    return ffi.box(ffi.unbox_typed(JsonTyped, x).value);
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
    const json = ffi.unbox_typed(Json, value);
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
