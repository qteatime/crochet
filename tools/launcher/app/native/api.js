"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (ffi) => {
    async function get_text(url) {
        const response = await fetch(url);
        const json = await response.text();
        return ffi.text(json);
    }
    ffi.defmachine("api.examples", function* () {
        return yield ffi.await(get_text("/api/examples"));
    });
};
