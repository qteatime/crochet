"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Http = require("http");
exports.default = async (plugin) => {
    function to_dict(map) {
        const result = Object.create(null);
        for (const [k, v] of map.entries()) {
            result[k] = plugin.get_string(v);
        }
        return result;
    }
    function make_options(map) {
        function maybe_set(key, transform) {
            const value = map.get(key);
            if (value != null) {
                options[key] = transform(value);
            }
        }
        const options = Object.create(null);
        maybe_set("auth", (x) => plugin.get_string(x));
        maybe_set("headers", (x) => to_dict(plugin.get_map(x)));
        maybe_set("method", (x) => plugin.get_string(x));
        maybe_set("timeout", (x) => Number(plugin.get_integer(x)));
        return options;
    }
    async function request(url, data, options) {
        return new Promise((resolve, reject) => {
            if (data != "") {
                options.headers["Content-Length"] = Buffer.byteLength(data);
            }
            const req = Http.request(url, options, (res) => {
                const result = new Map();
                result.set("status-code", plugin.from_integer(BigInt(res.statusCode)));
                result.set("headers", plugin.from_json_object(res.headers));
                res.setEncoding("utf8");
                const chunks = [];
                res.on("data", (chunk) => chunks.push(chunk));
                res.on("end", () => {
                    result.set("body", plugin.from_string(chunks.join("")));
                    resolve(plugin.from_map(new Map([
                        ["success", plugin.from_bool(true)],
                        ["response", plugin.from_map(result)],
                    ])));
                });
            });
            req.on("error", (error) => {
                resolve(plugin.from_map(new Map([
                    ["success", plugin.from_bool(false)],
                    ["message", plugin.from_string(error.message ?? "")],
                ])));
            });
            if (data != "") {
                req.write(data);
            }
            req.end();
        });
    }
    function get_port(url) {
        if (url.port != "") {
            return plugin.from_integer(BigInt(url.port));
        }
        else {
            return plugin.nothing();
        }
    }
    function get_search(url) {
        const result = new Map();
        for (const [k, v] of url.searchParams.entries()) {
            result.set(k, plugin.from_string(v));
        }
        return plugin.from_map(result);
    }
    plugin
        .define_ffi("http")
        .defmachine("request", function* (_, url0, data0, options0) {
        const url = plugin.get_string(url0);
        const data = plugin.get_string(data0);
        const options = make_options(plugin.get_map(options0));
        const result = yield plugin.await(request(url, data, options));
        return plugin.from_js(result);
    });
    plugin
        .define_ffi("url")
        .defun("from-text", (text) => plugin.box(new URL(plugin.get_string(text))))
        .defun("protocol", (url) => plugin.from_string(plugin.unbox(url).protocol))
        .defun("username", (url) => plugin.from_string(plugin.unbox(url).username))
        .defun("password", (url) => plugin.from_string(plugin.unbox(url).password))
        .defun("host", (url) => plugin.from_string(plugin.unbox(url).host))
        .defun("hostname", (url) => plugin.from_string(plugin.unbox(url).hostname))
        .defun("port", (url) => plugin.from_integer(BigInt(plugin.unbox(url).port)))
        .defun("pathname", (url) => plugin.from_string(plugin.unbox(url).pathname))
        .defun("query", (url0) => {
        const url = plugin.unbox(url0);
        return get_search(url);
    })
        .defun("hash", (url) => plugin.from_string(plugin.unbox(url).hash))
        .defun("to-text", (url) => plugin.from_string(plugin.unbox(url).toString()))
        .defun("from-record", (record) => {
        const data = plugin.get_map(record);
        const url = new URL("");
        if (data.has("path")) {
            url.pathname = plugin.get_string(data.get("path"));
        }
        if (data.has("protocol")) {
            url.protocol = plugin.get_string(data.get("protocol"));
        }
        if (data.has("username")) {
            url.username = plugin.get_string(data.get("username"));
        }
        if (data.has("password")) {
            url.password = plugin.get_string(data.get("password"));
        }
        if (data.has("host")) {
            url.host = plugin.get_string(data.get("host"));
        }
        if (data.has("port")) {
            url.port = plugin.get_integer(data.get("port")).toString();
        }
        if (data.has("query")) {
            const search = plugin.get_map(data.get("query"));
            for (const [k, v] of search) {
                url.searchParams.set(k, plugin.get_string(v));
            }
        }
        return plugin.box(url);
    })
        .defun("to-record", (url0) => {
        const url = plugin.unbox(url0);
        const result = new Map([
            ["path", plugin.from_string(url.pathname)],
            ["protocol", plugin.from_string(url.protocol)],
            ["username", plugin.from_string(url.username)],
            ["password", plugin.from_string(url.password)],
            ["host", plugin.from_string(url.host)],
            ["port", get_port(url)],
            ["query", get_search(url)],
        ]);
        return plugin.from_map(result);
    });
};
