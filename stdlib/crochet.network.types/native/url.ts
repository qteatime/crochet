import type { ForeignInterface, CrochetValue } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("url.decode-component", (x) => {
    return ffi.text(decodeURIComponent(ffi.text_to_string(x)));
  });

  ffi.defun("url.encode-component", (x) => {
    return ffi.text(encodeURIComponent(ffi.text_to_string(x)));
  });

  ffi.defun("url.parse", (url) => {
    return ffi.box(new URL(ffi.text_to_string(url)));
  });

  ffi.defun("url.hash", (url0) => {
    const url = ffi.unbox_typed(URL, url0);
    return ffi.text(url.hash);
  });

  ffi.defun("url.host", (url0) => {
    const url = ffi.unbox_typed(URL, url0);
    return ffi.text(url.host);
  });

  ffi.defun("url.hostname", (url0) => {
    const url = ffi.unbox_typed(URL, url0);
    return ffi.text(url.hostname);
  });

  ffi.defun("url.origin", (url0) => {
    const url = ffi.unbox_typed(URL, url0);
    return ffi.text(url.origin);
  });

  ffi.defun("url.port", (url0) => {
    const url = ffi.unbox_typed(URL, url0);
    if (url.port === "") {
      return ffi.nothing;
    } else {
      return ffi.integer(BigInt(url.port));
    }
  }))

  ffi.defun("url.query", (url0) => {
    const url = ffi.unbox_typed(URL, url0);
    return ffi.box(url.searchParams);
  });

  ffi.defun("url.pathname", (url0) => {
    return ffi.text(ffi.unbox_typed(URL, url0).pathname);
  });

  ffi.defun("url.username", (x) => {
    return ffi.text(ffi.unbox_typed(URL, x).username);
  });

  ffi.defun("url.password", (x) => {
    return ffi.text(ffi.unbox_typed(URL, x).password);
  });

  ffi.defun("url.protocol", (url0) => {
    return ffi.text(ffi.unbox_typed(URL, url0).protocol);
  });

  ffi.defun("url.to-text", (url0) => {
    const url = ffi.unbox_typed(URL, url0);
    return ffi.text(url.toString());
  });

  ffi.defun("url.set-path", (url0, path) => {
    const url1 = ffi.unbox_typed(URL, url0);
    const url = new URL(url1);
    url.pathname = ffi.text_to_string(path);
    return ffi.box(url);
  });

  ffi.defun("url.set-query", (url0, query0) => {
    const url1 = ffi.unbox_typed(URL, url0);
    const query = ffi.unbox_typed(URLSearchParams, query0);
    const url = new URL(url1);
    url.search = query.toString();
    return ffi.box(url);
  });

  ffi.defun("url.set-hash", (url0, hash) => {
    const url1 = ffi.unbox_typed(URL, url0);
    const url = new URL(url1);
    url.hash = ffi.text_to_string(hash);
    return ffi.box(url);
  });

  // -- search params
  ffi.defun("url.query-empty", () => {
    return ffi.box(new URLSearchParams());
  });

  ffi.defun("url.query-keys", (x0) => {
    const keys: CrochetValue[] = [];
    const x = ffi.unbox_typed(URLSearchParams, x0);
    for (const key of x.keys()) {
      keys.push(ffi.text(key));
    }
    return ffi.list(keys);
  });

  ffi.defun("url.query-values", (x0) => {
    const values: CrochetValue[] = [];
    const x = ffi.unbox_typed(URLSearchParams, x0);
    for (const value of x.values()) {
      values.push(ffi.text(value));
    }
    return ffi.list(values);
  });

  ffi.defun("url.query-entries", (x0) => {
    const entries: CrochetValue[] = [];
    const x = ffi.unbox_typed(URLSearchParams, x0);
    for (const [k, v] of x.entries()) {
      entries.push(ffi.list([ffi.text(k), ffi.text(v)]));
    }
    return ffi.list(entries);
  });

  ffi.defun("url.query-count", (x0) => {
    const keys = [...ffi.unbox_typed(URLSearchParams, x0).keys()];
    return ffi.integer(BigInt(keys.length));
  });

  ffi.defun("url.query-at", (x0, key) => {
    const x = ffi.unbox_typed(URLSearchParams, x0);
    return ffi.text(x.get(ffi.text_to_string(key))!);
  });

  ffi.defun("url.query-contains", (x0, key) => {
    const x = ffi.unbox_typed(URLSearchParams, x0);
    return ffi.boolean(x.has(ffi.text_to_string(key)));
  });

  ffi.defun("url.query-put", (x0, key, value) => {
    const x1 = ffi.unbox_typed(URLSearchParams, x0);
    const x = new URLSearchParams(x1);
    x.set(ffi.text_to_string(key), ffi.text_to_string(value));
    return ffi.box(x);
  });

  ffi.defun("url.query-remove", (x0, key) => {
    const x1 = ffi.unbox_typed(URLSearchParams, x0);
    const x = new URLSearchParams(x1);
    x.delete(ffi.text_to_string(key));
    return ffi.box(x);
  });

  ffi.defun("url.query-text", (x0) => {
    const x1 = ffi.unbox_typed(URLSearchParams, x0);
    const x = new URLSearchParams(x1);
    x.sort();
    return ffi.text(x.toString());
  });

  ffi.defun("url.query-all-at", (x0, key) => {
    const x1 = ffi.unbox_typed(URLSearchParams, x0);
    const values = x1.getAll(ffi.text_to_string(key));
    return ffi.list(values.map((x) => ffi.text(x)));
  });

  ffi.defun("url.query-append", (x0, key, value) => {
    const x1 = ffi.unbox_typed(URLSearchParams, x0);
    const x = new URLSearchParams(x1);
    x.append(ffi.text_to_string(key), ffi.text_to_string(value));
    return ffi.box(x);
  });

  ffi.defun("url.query-sort", (x0) => {
    const x1 = ffi.unbox_typed(URLSearchParams, x0);
    const x = new URLSearchParams(x1);
    x.sort();
    return ffi.box(x);
  });
};
