"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrochetInput = exports.KeyState = exports.CrochetRenderer = exports.Crochet = void 0;
const promise_1 = require("../util/promise");
class Crochet {
    constructor(renderer, input, dialogue) {
        this.renderer = renderer;
        this.input = input;
        this.dialogue = dialogue;
        this.ms_per_frame = 1000 / 60;
    }
    async run() {
        console.log("\nCrochet\n-------\n");
        this.input.init();
        this.loop();
    }
    async loop() {
        let previous = new Date().getTime();
        let lag = 0;
        while (true) {
            const now = new Date().getTime();
            const elapsed = now - previous;
            previous = now;
            lag += elapsed;
            while (lag >= this.ms_per_frame) {
                this.update();
                lag -= this.ms_per_frame;
            }
            this.render();
            await promise_1.delay(this.ms_per_frame - lag);
        }
    }
    render() {
        this.dialogue.render(this);
    }
    update() {
        this.dialogue.update(this);
        this.handle_input();
        this.input.update();
    }
    exit() {
        process.exit();
    }
    handle_input() {
        if (this.input.is_down("exit")) {
            process.exit();
        }
    }
}
exports.Crochet = Crochet;
class CrochetRenderer {
    draw_text(value) {
        process.stdout.write(value);
    }
}
exports.CrochetRenderer = CrochetRenderer;
var KeyState;
(function (KeyState) {
    KeyState[KeyState["UP"] = 0] = "UP";
    KeyState[KeyState["DOWN"] = 1] = "DOWN";
})(KeyState = exports.KeyState || (exports.KeyState = {}));
class CrochetInput {
    constructor() {
        this.key_table = new Map([
            ["\u0003", "exit"],
            ["\r", "return"],
            ["\u0027", "escape"]
        ]);
        this.key_state = new Map([
            ["exit", KeyState.UP],
            ["return", KeyState.UP],
            ["escape", KeyState.UP]
        ]);
        this.handle_input = (key0) => {
            const key = this.key_table.get(key0);
            if (key != null) {
                this.key_state.set(key, KeyState.DOWN);
            }
        };
    }
    init() {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding("utf8");
        process.stdin.on("data", this.handle_input);
    }
    update() {
        for (const key of this.key_state.keys()) {
            this.key_state.set(key, KeyState.UP);
        }
    }
    is_down(key) {
        return this.key_state.get(key) === KeyState.DOWN;
    }
    is_up(key) {
        return this.key_state.get(key) === KeyState.UP;
    }
}
exports.CrochetInput = CrochetInput;
