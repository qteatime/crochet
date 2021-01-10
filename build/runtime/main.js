"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crochet_1 = require("./core/crochet");
const dialogue_1 = require("./dialogue/dialogue");
const input = new crochet_1.CrochetInput();
const renderer = new crochet_1.CrochetRenderer();
const dialogue = new dialogue_1.CrochetDialogue();
const game = new crochet_1.Crochet(renderer, input, dialogue);
game.run().catch(error => {
    console.error(error);
    process.exit(1);
});
