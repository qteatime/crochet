import type { ForeignInterface, CrochetValue } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  function unwrap_body(x: CrochetValue) {
    if (ffi.is_text(x)) {
      return ffi.text_to_string(x);
    } else if (ffi.is_nothing(x)) {
      return null;
    } else {
      throw ffi.panic(
        "invalid-body",
        "Unsupported body value",
        ffi.record(new Map([["body", x]]))
      );
    }
  }

  function unwrap_headers(headers0: CrochetValue) {
    const headers = ffi.list_to_array(headers0);
    return headers.map(([k, v]: any) => [
      ffi.text_to_string(k),
      ffi.text_to_string(v),
    ]);
  }

  function unwrap_integrity(x: CrochetValue) {
    if (ffi.is_text(x)) {
      return ffi.text_to_string(x);
    } else if (ffi.is_nothing(x)) {
      return undefined;
    } else {
      throw ffi.panic("invalid-type", "Expected text or nothing", x);
    }
  }

  ffi.defun(
    "http.fetch",
    (
      url,
      method,
      body,
      headers,
      cache,
      mode,
      credentials,
      redirect,
      referrer,
      integrity
    ) => {
      const abort = new AbortController();
      const response = fetch(ffi.text_to_string(url), {
        method: ffi.text_to_string(method),
        body: unwrap_body(body),
        headers: unwrap_headers(headers),
        cache: ffi.text_to_string(cache) as any,
        mode: ffi.text_to_string(mode) as any,
        credentials: ffi.text_to_string(credentials) as any,
        redirect: ffi.text_to_string(redirect) as any,
        referrer: ffi.text_to_string(referrer),
        integrity: unwrap_integrity(integrity),
        signal: abort.signal,
      });
      return ffi.record(
        new Map([
          ["abort", ffi.box(abort)],
          ["response", ffi.box(response)],
        ])
      );
    }
  );

  ffi.defun("http.abort", (abort) => {
    ffi.unbox_typed(AbortController, abort).abort();
    return ffi.nothing;
  });

  ffi.defmachine("http.wait-response", function* (promise0) {
    const promise = ffi.unbox_typed(Promise, promise0);
    let value: CrochetValue;
    try {
      value = yield ffi.await(promise.then((x) => ffi.box(x)));
    } catch (error: any) {
      return ffi.record(
        new Map([
          ["ok", ffi.boolean(false)],
          [
            "aborted",
            ffi.boolean(
              error instanceof DOMException && error.name === "AbortError"
            ),
          ],
          ["reason", ffi.text(String(error))],
        ])
      );
    }
    ffi.unbox_typed(Response, value);
    return ffi.record(
      new Map([
        ["ok", ffi.boolean(true)],
        ["value", value],
      ])
    );
  });

  ffi.defmachine("http.response-text", function* (response0) {
    const response = ffi.unbox_typed(Response, response0);
    const text = yield ffi.await(response.text().then((x) => ffi.text(x)));
    return text;
  });
};
