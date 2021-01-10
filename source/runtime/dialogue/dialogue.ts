import { Crochet } from "../core/crochet";
import { Element, Text } from "./algebra";

export class CrochetDialogue {
  private buffer: Element[] = [];
  private queue: Element[] = [];
  private current: Element | null = null;

  push_dialogue(element: Element) {
    this.queue.push(element);
    if (this.current == null) {
      this.current = this.queue.shift()!;
    }
  }

  render(game: Crochet) {
    for (const element of this.buffer) {
      element.render(game);
    }
    this.buffer = [];
    this.current?.render(game);
  }

  update(game: Crochet) {
    for (const element of this.buffer) {
      element.update(game);
    }
    this.current = this.current?.update(game) ?? null;
    this.handle_input(game);
    if (this.current == null && this.queue.length > 0) {
      this.current = this.queue.shift() ?? null;
    }
  }

  handle_input(game: Crochet) {
    if (game.input.is_down("return")) {
      if (this.current != null) {
        this.current.fast_forward(game);
      } else {
        this.current = this.queue.shift() ?? null;
      }
    }
  }
}