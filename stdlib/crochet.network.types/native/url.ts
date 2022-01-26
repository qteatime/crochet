import type { ForeignInterface } from "../../../build/crochet";

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
};
