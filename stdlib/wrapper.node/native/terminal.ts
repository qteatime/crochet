import type { Plugin } from "../../../build/plugin";

export default async (plugin: Plugin) => {
  plugin.define_ffi("terminal").defun("hello", [], () => {
    console.log("Hello from native!");
    return plugin.nothing();
  });
};
