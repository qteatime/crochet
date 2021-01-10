"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrochetDialogue = void 0;
class CrochetDialogue {
    constructor() {
        this.buffer = [];
        this.queue = [];
        this.current = null;
    }
    push_dialogue(element) {
        this.queue.push(element);
        if (this.current == null) {
            this.current = this.queue.shift();
        }
    }
    render(game) {
        for (const element of this.buffer) {
            element.render(game);
        }
        this.buffer = [];
        this.current?.render(game);
    }
    update(game) {
        for (const element of this.buffer) {
            element.update(game);
        }
        this.current = this.current?.update(game) ?? null;
        this.handle_input(game);
        if (this.current == null && this.queue.length > 0) {
            this.current = this.queue.shift() ?? null;
        }
    }
    handle_input(game) {
        if (game.input.is_down("return")) {
            if (this.current != null) {
                this.current.fast_forward(game);
            }
            else {
                this.current = this.queue.shift() ?? null;
            }
        }
    }
}
exports.CrochetDialogue = CrochetDialogue;
