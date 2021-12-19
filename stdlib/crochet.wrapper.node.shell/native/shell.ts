import type { CrochetValue, ForeignInterface } from "../../../build/crochet";
import { execFileSync } from "child_process";

export default (ffi: ForeignInterface) => {
  function to_env(map: Map<string, CrochetValue>) {
    const result = Object.create(null);
    for (const [k, v] of map.entries()) {
      result[k] = ffi.text_to_string(v);
    }
    return result;
  }

  function make_options(map: Map<string, CrochetValue>) {
    function maybe_set(key: string, transform: (_: CrochetValue) => any) {
      const value = map.get(key);
      if (value != null) {
        options[key] = transform(value);
      }
    }

    const options = Object.create(null);
    options.encoding = "utf8";

    maybe_set("cwd", (x) => ffi.text_to_string(x));
    maybe_set("input", (x) => ffi.text_to_string(x));
    maybe_set("env", (x) => to_env(ffi.record_to_map(x)));
    maybe_set("uid", (x) => Number(ffi.integer_to_bigint(x)));
    maybe_set("gid", (x) => Number(ffi.integer_to_bigint(x)));
    maybe_set("timeout", (x) => Number(ffi.integer_to_bigint(x)));

    return options;
  }

  ffi.defun("shell.exec-file", (file0, args0, options0) => {
    const file = ffi.text_to_string(file0);
    const args = ffi.list_to_array(args0).map((x) => ffi.text_to_string(x));
    const options = make_options(ffi.record_to_map(options0));

    const result = execFileSync(file, args, options);
    return ffi.untrusted_text(result);
  });
};
