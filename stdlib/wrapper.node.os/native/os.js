"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (plugin) => {
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
        return plugin.from_array(process.argv.slice(2).map((x) => plugin.from_string(x)));
    })
        .defun("chdir", (dir) => {
        process.chdir(plugin.get_text(dir));
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
