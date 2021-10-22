(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
class Client {
    constructor(id, capabilities, origin) {
        this.id = id;
        this.capabilities = capabilities;
        this.origin = origin;
        this.methods = new Map();
        this.methods.set("run-tests", this.run_tests.bind(this));
    }
    async instantiate() {
        const crochet = new Crochet.CrochetForBrowser(`/${this.id}/library`, new Set(this.capabilities), false);
        await crochet.boot_from_file(`/${this.id}/app/crochet.json`, Crochet.Package.target_web());
        return crochet;
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
    async run_tests({ id }) {
        this.post_message("testing-started", { id });
        // TODO: handle errors here
        const instance = await this.instantiate();
        const handler = instance.test_report.subscribe((message) => {
            if (message.id !== id) {
                return;
            }
            switch (message.tag) {
                case "started": {
                    break;
                }
                case "test-started": {
                    this.post_message("test-started", {
                        id: message.id,
                        "test-id": message.test_id,
                        package: message.pkg,
                        module: message.module,
                        title: message.name,
                    });
                    break;
                }
                case "test-skipped": {
                    this.post_message("test-skipped", {
                        id: message.id,
                        "test-id": message.test_id,
                    });
                    break;
                }
                case "test-passed": {
                    this.post_message("test-passed", {
                        id: message.id,
                        "test-id": message.test_id,
                    });
                    break;
                }
                case "test-failed": {
                    this.post_message("test-failed", {
                        id: message.id,
                        "test-id": message.test_id,
                        message: message.message,
                    });
                    break;
                }
                case "finished": {
                    break;
                }
            }
        });
        const result = await instance.run_tests(id, () => true);
        instance.test_report.unsubscribe(handler);
        this.post_message("testing-finished", {
            id,
            passed: result.passed,
            failed: result.failed,
            skipped: result.skipped,
            total: result.total,
            duration: result.finished - result.started,
        });
    }
}
exports.Client = Client;
async function main() {
    const query = new URL(document.location.href).searchParams;
    const capabilities = (query.get("capabilities") || "native").split(",");
    const client = new Client(query.get("id"), new Set(capabilities), query.get("origin"));
    client.listen();
    client.post_message("ready", {});
}
main().catch((e) => {
    console.log(e);
});

},{}]},{},[1]);
