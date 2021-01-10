"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
class Environment {
    constructor() {
        this.procedures = new Map();
        this.bindings = new Map();
    }
    lookup_procedure(name) {
        return this.procedures.get(name) ?? null;
    }
    lookup(name) {
        return this.bindings.get(name) ?? null;
    }
    define(name, value) {
        this.bindings.set(name, value);
    }
    define_procedure(name, value) {
        this.procedures.set(name, value);
    }
}
exports.Environment = Environment;
