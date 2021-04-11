"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (plugin) => {
    plugin.define_ffi("terminal").defun("hello", [], () => {
        console.log("Hello from native!");
        return plugin.nothing();
    });
};
