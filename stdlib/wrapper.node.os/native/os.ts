import type { Plugin } from "../../../build/plugin";

export default async (plugin: Plugin) => {
  plugin
    .define_ffi("os")
    .defun("abort", () => {
      process.abort();
      return plugin.nothing();
    })
    .defun("exit", (code) => {
      process.exit(Number(plugin.get_integer(code)));
      return plugin.nothing();
    })
    .defun("arch", () => {
      return plugin.from_string(process.arch);
    })
    .defun("argv", () => {
      let args = process.argv.slice(2);
      const start = args.findIndex((x) => x === "--");
      if (start === -1) {
        args = [];
      } else {
        args = args.slice(start + 1);
      }

      return plugin.from_array(args.map((x) => plugin.from_string(x)));
    })
    .defun("chdir", (dir) => {
      process.chdir(plugin.get_string(dir));
      return plugin.nothing();
    })
    .defun("cwd", () => {
      return plugin.from_string(process.cwd());
    })
    .defun("env", () => {
      const map = new Map();
      for (const [k, v] of Object.entries(process.env)) {
        map.set(k, plugin.from_string(v ?? ""));
      }
      return plugin.from_map(map);
    })
    .defun("platform", () => {
      return plugin.from_string(process.platform);
    })
    .defun("pid", () => {
      return plugin.from_integer(BigInt(process.pid));
    });
};
