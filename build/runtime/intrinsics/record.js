"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrochetRecord = void 0;
const value_1 = require("./value");
class CrochetRecord extends value_1.CrochetValue {
    constructor(value) {
        super();
        this.value = value;
    }
    project(name) {
        return this.value.get(name) ?? null;
    }
}
exports.CrochetRecord = CrochetRecord;
