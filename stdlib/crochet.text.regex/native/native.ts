import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("re.escape", (text0) => {
    const text1 = ffi.text_to_string(text0);
    const text2 = text1.replace(/(\W)/g, "\\$1");
    return ffi.text(text2);
  });

  ffi.defun("re.test", (code, flags, text) => {
    const re = new RegExp(ffi.text_to_string(code), ffi.text_to_string(flags));
    const result = re.test(ffi.text_to_string(text));
    return ffi.boolean(result);
  });

  ffi.defun("re.search", (code, flags, text) => {
    const re = new RegExp(ffi.text_to_string(code), ffi.text_to_string(flags));
    const result = ffi.text_to_string(text).match(re);
    if (result == null) {
      return ffi.nothing;
    } else {
      return ffi.box(result);
    }
  });

  ffi.defun("re.search-all", (code, flags, text) => {
    const re = new RegExp(
      ffi.text_to_string(code),
      ffi.text_to_string(flags) + "g"
    );
    const results = [...ffi.text_to_string(text).matchAll(re)];
    return ffi.list(results.map((x) => ffi.box(x)));
  });

  ffi.defun("re.replace", (code, flags, substitution, text) => {
    const re = new RegExp(ffi.text_to_string(code), ffi.text_to_string(flags));
    const result = ffi
      .text_to_string(text)
      .replace(re, ffi.text_to_string(substitution));
    return ffi.text(result);
  });

  ffi.defun("re.replace-all", (code, flags, substitution, text) => {
    const re = new RegExp(
      ffi.text_to_string(code),
      ffi.text_to_string(flags) + "g"
    );
    const result = ffi
      .text_to_string(text)
      .replaceAll(re, ffi.text_to_string(substitution));
    return ffi.text(result);
  });

  ffi.defun("re.valid", (text) => {
    try {
      new RegExp(ffi.text_to_string(text));
      return ffi.true;
    } catch (_) {
      return ffi.false;
    }
  });

  ffi.defun("re.matched-text", (match) => {
    return ffi.text((ffi.unbox(match) as any)[0]);
  });

  ffi.defun("re.matched-index", (match, index) => {
    const m = ffi.unbox(match) as any;
    const i = Number(ffi.integer_to_bigint(index));
    if (i >= m.length) {
      ffi.panic("out-of-bounds", `Index ${i} is not a valid capture`);
    }
    return ffi.text(m[i]);
  });

  ffi.defun("re.matched-name", (match, name0) => {
    const m = ffi.unbox(match) as any;
    const name = ffi.text_to_string(name0);
    if (!(name in m.groups)) {
      ffi.panic("invalid-group", `Group ${name} does not exist`);
    }
    return ffi.text(m.groups[name]);
  });

  ffi.defun("re.matched-groups", (match) => {
    const m = ffi.unbox(match) as any;
    return ffi.list(m.slice(1).map((x: any) => ffi.text(x)));
  });

  ffi.defun("re.matched-named-groups", (match) => {
    const m = ffi.unbox(match) as any;
    return ffi.record(
      new Map(
        Object.entries(m.groups || {}).map(([k, v]) => [k, ffi.text(v as any)])
      )
    );
  });

  ffi.defun("re.valid-id", (text) => {
    return ffi.boolean(
      /^[a-zA-Z][a-zA-Z_0-9]*$/.test(ffi.text_to_string(text))
    );
  });
};
