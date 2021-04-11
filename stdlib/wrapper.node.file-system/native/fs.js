"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const FS = require("fs");
exports.default = async (plugin) => {
    plugin
        .define_ffi("path")
        .defun("basename", (path) => plugin.from_string(Path.basename(plugin.get_string(path))))
        .defun("basename-ext", (path, ext) => plugin.from_string(Path.basename(plugin.get_string(path), plugin.get_string(ext))))
        .defun("delimiter", () => plugin.from_string(Path.delimiter))
        .defun("dirname", (path) => plugin.from_string(Path.dirname(plugin.get_string(path))))
        .defun("extname", (path) => plugin.from_string(Path.extname(plugin.get_string(path))))
        .defun("is-absolute", (path) => plugin.from_bool(Path.isAbsolute(plugin.get_string(path))))
        .defun("join", (xs) => plugin.from_string(Path.join(...plugin.get_array(xs).map((x) => plugin.get_string(x)))))
        .defun("normalise", (path) => plugin.from_string(Path.normalize(plugin.get_string(path))))
        .defun("relative", (from, to) => plugin.from_string(Path.relative(plugin.get_string(from), plugin.get_string(to))))
        .defun("resolve", (xs) => plugin.from_string(Path.join(...plugin.get_array(xs).map((x) => plugin.get_string(x)))))
        .defun("separator", () => plugin.from_string(Path.sep));
    plugin
        .define_ffi("fs")
        .defun("append-file-text", (path, data) => {
        FS.appendFileSync(plugin.get_string(path), plugin.get_string(data));
        return plugin.nothing();
    })
        .defun("copy-file", (from, to) => {
        FS.copyFileSync(plugin.get_string(from), plugin.get_string(to));
        return plugin.nothing();
    })
        .defun("exists", (path) => plugin.from_bool(FS.existsSync(plugin.get_string(path))))
        .defun("mkdir", (path) => {
        FS.mkdirSync(plugin.get_string(path));
        return plugin.nothing();
    })
        .defun("mkdir-temp", (prefix) => {
        const result = FS.mkdtempSync(plugin.get_string(prefix));
        return plugin.from_string(result);
    })
        .defun("readdir", (path) => {
        return plugin.from_array(FS.readdirSync(plugin.get_string(path)).map((x) => plugin.from_string(x)));
    })
        .defun("read-file-text", (path) => {
        return plugin.from_string(FS.readFileSync(plugin.get_string(path), "utf8"));
    })
        .defun("real-path", (path) => {
        return plugin.from_string(FS.realpathSync(plugin.get_string(path)));
    })
        .defun("rename", (from, to) => {
        FS.renameSync(plugin.get_string(from), plugin.get_string(to));
        return plugin.nothing();
    })
        .defun("rmdir", (path, recursive) => {
        FS.rmdirSync(plugin.get_string(path), {
            recursive: plugin.get_bool(recursive),
        });
        return plugin.nothing();
    })
        .defun("rm", (path, force, recursive) => {
        FS.rmSync(plugin.get_string(path), {
            force: plugin.get_bool(force),
            recursive: plugin.get_bool(recursive),
        });
        return plugin.nothing();
    })
        .defun("write-file-text", (path, data) => {
        FS.writeFileSync(plugin.get_string(path), plugin.get_string(data));
        return plugin.nothing();
    })
        .defun("is-file", (path) => {
        return plugin.from_bool(FS.statSync(plugin.get_string(path)).isFile());
    })
        .defun("is-directory", (path) => {
        return plugin.from_bool(FS.statSync(plugin.get_string(path)).isDirectory());
    });
};
