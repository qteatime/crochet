import type { ForeignInterface, CrochetValue } from "../../../../build/crochet";

export default (ffi: ForeignInterface) => {
  async function get_text(url: string) {
    const response = await fetch(url);
    const json = await response.text();
    return ffi.text(json);
  }

  ffi.defmachine("api.examples", function* () {
    return yield ffi.await(get_text("/api/examples"));
  });

  ffi.defmachine("api.libraries", function* () {
    return yield ffi.await(get_text("/api/libraries"));
  });
};
