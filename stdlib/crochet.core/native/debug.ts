import type { ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  ffi.defun("debug.type", (value) => {
    return ffi.get_static_type(value);
  });

  ffi.defun("debug.type-info", (value) => {
    return ffi.get_type_info(value);
  });

  ffi.defun("debug.type-pairs", (value) => {
    return ffi.get_type_pairs(value);
  });

  ffi.defun("debug.is-instance", (value) => {
    return ffi.boolean(ffi.is_instance(value));
  });

  ffi.defun("debug.to-json", (value) => {
    const object = ffi.to_plain_json_native(value);
    return ffi.text(JSON.stringify(object, null, 2));
  });
};
