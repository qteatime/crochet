"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stream = void 0;
class Stream {
    constructor() {
        this.subscribers = [];
    }
    subscribe(x) {
        this.unsubscribe(x);
        this.subscribers.push(x);
    }
    unsubscribe(x) {
        this.subscribers = this.subscribers.filter(y => x !== y);
    }
    publish(value) {
        for (const subscriber of this.subscribers) {
            subscriber(value);
        }
    }
}
exports.Stream = Stream;
