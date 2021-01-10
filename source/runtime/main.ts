import { Crochet, CrochetInput, CrochetRenderer } from "./core/crochet";
import { CrochetDialogue } from "./dialogue/dialogue";

const input = new CrochetInput();
const renderer = new CrochetRenderer();
const dialogue = new CrochetDialogue();
const game = new Crochet(renderer, input, dialogue);

game.run().catch(error => {
  console.error(error);
  process.exit(1);
})