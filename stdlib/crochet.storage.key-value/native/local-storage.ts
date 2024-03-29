import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("local-storage.lookup", (key0) => {
    const key = ffi.text_to_string(key0);
    const value = localStorage.getItem(key);
    if (value == null) {
      return ffi.nothing;
    } else {
      return ffi.text(value);
    }
  });

  ffi.defun("local-storage.store", (key0, value0) => {
    const key = ffi.text_to_string(key0);
    const value = ffi.text_to_string(value0);
    try {
      localStorage.setItem(key, value);
      return ffi.nothing;
    } catch (error) {
      if (error instanceof DOMException) {
        switch (error.name) {
          case "QuotaExceededError":
          case "QUOTA_EXCEEDED_ERROR":
            return ffi.text("quota-exceeded");
          default:
            return ffi.text("unknown-error");
        }
      } else {
        return ffi.text("unknown-error");
      }
    }
  });

  ffi.defun("local-storage.delete", (key0) => {
    const key = ffi.text_to_string(key0);
    localStorage.removeItem(key);
    return ffi.nothing;
  });

  ffi.defun("local-storage.count", (prefix0) => {
    const prefix = ffi.text_to_string(prefix0);
    let count = 0;
    for (let i = 0; i < localStorage.length; ++i) {
      const key = localStorage.key(i);
      if (key != null && key.startsWith(prefix)) {
        count += 1;
      }
    }
    return ffi.integer(BigInt(count));
  });
};
