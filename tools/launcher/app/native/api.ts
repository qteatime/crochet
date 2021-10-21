import type { ForeignInterface, CrochetValue } from "../../../../build/crochet";

export default (ffi: ForeignInterface) => {
  async function get_text(res: Promise<Response>) {
    try {
      const response = await res;
      const json = await response.text();
      if (response.status !== 200) {
        throw new Error(`Failed: ${json}`);
      }
      return ffi.text(json);
    } catch (e: any) {
      throw ffi.panic("api-error", String(e));
    }
  }

  async function post(url: string, data: any) {
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  ffi.defmachine("api.examples", function* () {
    return yield ffi.await(get_text(fetch("/api/examples")));
  });

  ffi.defmachine("api.libraries", function* () {
    return yield ffi.await(get_text(fetch("/api/libraries")));
  });

  ffi.defmachine("api.spawn", function* (file0) {
    const file = ffi.text_to_string(file0);
    const response = post("/api/spawn", { package: file });
    const text = yield ffi.await(get_text(response));
    const json = JSON.parse(ffi.text_to_string(text));
    return ffi.text(json.id);
  });

  ffi.defmachine("api.package", function* (file0, target0) {
    const file = ffi.text_to_string(file0);
    const target = ffi.text_to_string(target0);
    const response = post("/api/package", { package: file, target });
    try {
      const text = yield ffi.await(get_text(response));
      const json = JSON.parse(ffi.text_to_string(text));
      return ffi.record(
        new Map([
          ["success", ffi.boolean(true)],
          ["output", ffi.text(json.output)],
        ])
      );
    } catch (e) {
      return ffi.record(
        new Map([
          ["success", ffi.boolean(false)],
          ["message", ffi.text(String(e))],
        ])
      );
    }
  });
};
