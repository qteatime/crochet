import type { CrochetValue, ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("history.push", (state, title, url) => {
    history.pushState(
      ffi.to_plain_native(state),
      ffi.text_to_string(title),
      ffi.text_to_string(url)
    );
    return ffi.nothing;
  });

  ffi.defun("history.on-state-change", (fn) => {
    window.addEventListener("popstate", (ev) => {
      ffi.run_asynchronously(function* () {
        yield ffi.apply(fn, [ffi.box(ev)]);
        return ffi.nothing;
      });
    });
    return ffi.nothing;
  });
};
