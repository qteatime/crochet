"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.from_primitive = exports.Wait = exports.Pause = exports.Concatenate = exports.Text = exports.Element = void 0;
const text_1 = require("../runtime/intrinsics/text");
class Element {
}
exports.Element = Element;
class Text extends Element {
    constructor(text) {
        super();
        this.text = text;
    }
}
exports.Text = Text;
class Concatenate extends Element {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
}
exports.Concatenate = Concatenate;
class Pause extends Element {
    constructor(time) {
        super();
        this.time = time;
    }
}
exports.Pause = Pause;
class Wait extends Element {
}
exports.Wait = Wait;
function from_primitive(value) {
    if (value instanceof text_1.CrochetText) {
        return new Text(value.value);
    }
    else if (value instanceof Element) {
        return value;
    }
    else {
        throw new Error(`Not supported ${value}`);
    }
}
exports.from_primitive = from_primitive;
