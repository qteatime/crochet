"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.from_primitive = exports.Wait = exports.Pause = exports.Concatenate = exports.Text = exports.Element = void 0;
const text_1 = require("../intrinsics/text");
class Element {
}
exports.Element = Element;
class Text extends Element {
    constructor(text) {
        super();
        this.buffer = "";
        this.characters = 0;
        this.graphemes = [...text];
    }
    fast_forward(game) {
        this.step(this.graphemes.length);
    }
    render(game) {
        game.renderer.draw_text(this.buffer);
        this.buffer = "";
    }
    update(game) {
        this.step(1);
        if (this.characters >= this.graphemes.length) {
            return null;
        }
        else {
            return this;
        }
    }
    step(chars) {
        this.buffer += this.graphemes.slice(this.characters, this.characters + chars).join("");
        this.characters += chars;
    }
}
exports.Text = Text;
class Concatenate extends Element {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
        this.exit = new Set();
        this.buffer = [this.left];
        this.next = [this.right];
        this.current = this.left;
    }
    fast_forward(game) {
        this.buffer = this.buffer.concat(this.next);
        for (const element of this.buffer) {
            element.fast_forward(game);
            this.exit.add(element);
        }
        this.next = [];
        this.current = null;
    }
    render(game) {
        const buffer = this.buffer;
        this.buffer = [];
        for (const element of buffer) {
            element.render(game);
            if (!this.exit.has(element)) {
                this.buffer.push(element);
            }
        }
    }
    update(game) {
        const next = this.current?.update(game);
        if (next == null) {
            this.exit.add(this.current);
            this.current = this.next.shift() ?? null;
            if (this.current != null) {
                this.buffer.push(this.current);
            }
        }
        if (this.current == null && this.buffer.length === 0) {
            return null;
        }
        else {
            return this;
        }
    }
}
exports.Concatenate = Concatenate;
class Pause extends Element {
    constructor(time) {
        super();
        this.time = time;
        this.started = null;
        this.wait_time = Number(time.value);
    }
    fast_forward(game) {
        this.started = new Date().getTime() - this.wait_time;
    }
    render(game) {
    }
    update(game) {
        if (!this.started) {
            this.started = new Date().getTime();
        }
        if (new Date().getTime() - this.started >= this.wait_time) {
            return null;
        }
        else {
            return this;
        }
    }
}
exports.Pause = Pause;
class Wait extends Element {
    constructor() {
        super(...arguments);
        this.dismissed = false;
    }
    fast_forward(game) {
    }
    render(game) {
    }
    update(game) {
        if (game.input.is_down("return")) {
            this.dismissed = true;
            return null;
        }
        else {
            return this;
        }
    }
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
