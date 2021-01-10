"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrochetFloat = exports.CrochetInteger = exports.CrochetHours = exports.CrochetMinutes = exports.CrochetSeconds = exports.CrochetMs = exports.CrochetTime = exports.CrochetUnit = void 0;
const value_1 = require("./value");
class CrochetUnit extends value_1.CrochetValue {
}
exports.CrochetUnit = CrochetUnit;
class CrochetTime extends CrochetUnit {
}
exports.CrochetTime = CrochetTime;
class CrochetMs extends CrochetTime {
}
exports.CrochetMs = CrochetMs;
class CrochetSeconds extends CrochetTime {
}
exports.CrochetSeconds = CrochetSeconds;
class CrochetMinutes extends CrochetTime {
}
exports.CrochetMinutes = CrochetMinutes;
class CrochetHours extends CrochetTime {
}
exports.CrochetHours = CrochetHours;
class CrochetInteger extends value_1.CrochetValue {
    constructor(value, unit) {
        super();
        this.value = value;
        this.unit = unit;
    }
}
exports.CrochetInteger = CrochetInteger;
class CrochetFloat extends value_1.CrochetValue {
    constructor(value, unit) {
        super();
        this.value = value;
        this.unit = unit;
    }
}
exports.CrochetFloat = CrochetFloat;
