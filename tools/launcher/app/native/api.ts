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

  ffi.defmachine("api.my-projects", function* () {
    return yield ffi.await(get_text(fetch("/api/my-projects")));
  });

  ffi.defmachine("api.read-project", function* (id0) {
    const id = ffi.text_to_string(id0);
    return yield ffi.await(
      get_text(fetch(`/api/read/${encodeURIComponent(id)}`))
    );
  });

  ffi.defmachine("api.create-project", function* (name0, title0, target0) {
    const name = ffi.text_to_string(name0);
    const title = ffi.text_to_string(title0);
    const target = ffi.text_to_string(target0);
    const response = post("/api/create-project", { name, title, target });
    const text = yield ffi.await(get_text(response));
    const json = JSON.parse(ffi.text_to_string(text));
    return ffi.text(json.id);
  });

  ffi.defmachine("api.spawn", function* (file0) {
    const file = ffi.text_to_string(file0);
    const response = post("/api/spawn", { package: file });
    const text = yield ffi.await(get_text(response));
    const json = JSON.parse(ffi.text_to_string(text));
    return ffi.text(json.id);
  });

  ffi.defmachine("api.package", function* (id0, target0) {
    const id = ffi.text_to_string(id0);
    const target = ffi.text_to_string(target0);
    const response = post("/api/package", { id, target });
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

  ffi.defmachine("api.launch-directory", function* (id0) {
    const id = ffi.text_to_string(id0);
    const response = post("/api/launch-directory", { id });
    yield ffi.await(get_text(response));
    return ffi.nothing;
  });

  ffi.defmachine("api.launch-code-editor", function* (id0) {
    const id = ffi.text_to_string(id0);
    const response = post("/api/launch-code-editor", { id });
    yield ffi.await(get_text(response));
    return ffi.nothing;
  });

  ffi.defmachine("api.previously-granted-capabilities", function* (id0) {
    const id = ffi.text_to_string(id0);
    const response = post("/api/capabilities/previously-granted", { id });
    const result = yield ffi.await(get_text(response));
    const json = JSON.parse(ffi.text_to_string(result));
    return ffi.list(json.map((x: any) => ffi.text(x)));
  });

  ffi.defmachine("api.grant-capabilities", function* (id0, cap0) {
    const id = ffi.text_to_string(id0);
    const grants = ffi.list_to_array(cap0).map((x) => ffi.text_to_string(x));
    const response = post("/api/capabilities/grant", { id, grants });
    yield ffi.await(get_text(response));
    return ffi.nothing;
  });
};
