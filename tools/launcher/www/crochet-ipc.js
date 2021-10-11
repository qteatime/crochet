(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const helpers_1 = require("./helpers");
class Client {
    constructor(id, capabilities, origin) {
        this.id = id;
        this.capabilities = capabilities;
        this.origin = origin;
        this.methods = new Map();
        this._instance = null;
        this.methods.set("run-tests", this.run_tests.bind(this));
    }
    get instance() {
        if (this._instance != null) {
            return this._instance;
        }
        else {
            throw new Error(`Not yet instantiated.`);
        }
    }
    async initialise() {
        if (this._instance != null) {
            throw new Error(`Already initialised`);
        }
        const crochet = new Crochet.CrochetForBrowser(`/${this.id}/library`, new Set(this.capabilities), false);
        await crochet.boot_from_file(`/${this.id}/app/crochet.json`, Crochet.Package.target_web());
        this._instance = crochet;
    }
    post_message(method, data) {
        window.parent.postMessage({ method, id: this.id, data }, this.origin);
    }
    dispatch(data) {
        const method = this.methods.get(data.method);
        if (method != null) {
            method(data.data);
        }
        else {
            console.log(`Unhandled message:`, this.id, data);
        }
    }
    listen() {
        window.addEventListener("message", (ev) => {
            if (ev.origin !== this.origin || ev.data.id !== this.id) {
                console.log(`Unhandled message:`, this.id, ev.data, ev.origin);
                return;
            }
            this.dispatch(ev.data);
        });
    }
    async run_tests(_) {
        this.post_message("testing-started", {});
    }
}
exports.Client = Client;
async function main() {
    const query = (0, helpers_1.parse_query)(document.location.search);
    const capabilities = (query.get("capabilities") || "").split(",");
    const client = new Client(query.get("id"), new Set(capabilities), query.get("origin"));
    client.listen();
    try {
        await client.initialise();
        client.post_message("ready", {});
    }
    catch (e) {
        client.post_message("failed-to-start", {
            message: String(e),
        });
    }
}
main().catch((e) => {
    console.log(e);
});

},{"./helpers":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse_query = void 0;
function parse_query(query) {
    const pairs = query.replace(/^\?/, "").split("&");
    const result = new Map();
    for (const pair of pairs) {
        const [key, value] = pair.split("=");
        result.set(decodeURIComponent(key), decodeURIComponent(value));
    }
    return result;
}
exports.parse_query = parse_query;

},{}]},{},[1]);
