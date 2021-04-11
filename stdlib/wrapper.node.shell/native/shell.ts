import type { Plugin } from "../../../build/plugin";
import { execFileSync } from "child_process";
import { CrochetValue } from "../../../build/runtime";

export default async (plugin: Plugin) => {
  function to_env(map: Map<string, CrochetValue>) {
    const result = Object.create(null);
    for (const [k, v] of map.entries()) {
      result[k] = plugin.get_string(v);
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

    maybe_set("cwd", (x) => plugin.get_string(x));
    maybe_set("input", (x) => plugin.get_string(x));
    maybe_set("env", (x) => to_env(plugin.get_map(x)));
    maybe_set("uid", (x) => Number(plugin.get_integer(x)));
    maybe_set("gid", (x) => Number(plugin.get_integer(x)));
    maybe_set("timeout", (x) => Number(plugin.get_integer(x)));

    return options;
  }

  plugin.define_ffi("shell").defun("exec-file", (file0, args0, options0) => {
    const file = plugin.get_string(file0);
    const args = plugin.get_array(args0).map((x) => plugin.get_string(x));
    const options = make_options(plugin.get_map(options0));
    const result = execFileSync(file, args, options);
    return plugin.from_js(result);
  });
};
