import { Crochet } from "../core/crochet";
import { CrochetInteger } from "../intrinsics/number";
import { CrochetText } from "../intrinsics/text";
import { CrochetValue } from "../intrinsics/value";

export abstract class Element {
  abstract render(game: Crochet): void;
  abstract update(game: Crochet): Element | null;
  abstract fast_forward(game: Crochet): void;
}

export class Text extends Element {
  readonly graphemes: string[];
  private buffer = "";
  private characters = 0;

  fast_forward(game: Crochet): void {
    this.step(this.graphemes.length);
  }

  render(game: Crochet): void {
    game.renderer.draw_text(this.buffer);
    this.buffer = "";
  }

  update(game: Crochet): Element | null {
    this.step(1);
    if (this.characters >= this.graphemes.length) {
      return null;
    } else {
      return this;
    }
  }

  step(chars: number) {
    this.buffer += this.graphemes.slice(this.characters, this.characters + chars).join("");
    this.characters += chars;
  }

  constructor(text: string) {
    super();
    this.graphemes = [...text];
  }
}

export class Concatenate extends Element {
  private exit = new Set();
  private buffer = [this.left];
  private next = [this.right];
  private current: Element | null = this.left;

  fast_forward(game: Crochet): void {
    this.buffer = this.buffer.concat(this.next);
    for (const element of this.buffer) {
      element.fast_forward(game);
      this.exit.add(element);
    }
    this.next = [];
    this.current = null;
  }

  render(game: Crochet): void {
    const buffer = this.buffer;
    this.buffer = [];
    for (const element of buffer) {
      element.render(game);
      if (!this.exit.has(element)) {
        this.buffer.push(element);
      }
    }
  }

  update(game: Crochet): Element | null {
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
    } else {
      return this;
    }
  }

  constructor(readonly left: Element, readonly right: Element) {
    super();
  }
}

export class Pause extends Element {
  private started: number | null = null;
  private wait_time: number;

  fast_forward(game: Crochet): void {
    this.started = new Date().getTime() - this.wait_time;
  }

  render(game: Crochet): void {
  }

  update(game: Crochet): Element | null {
    if (!this.started) {
      this.started = new Date().getTime();
    }
    if (new Date().getTime() - this.started >= this.wait_time) {
      return null;
    } else {
      return this;
    }
  }

  constructor(readonly time: CrochetInteger) {
    super();
    this.wait_time = Number(time.value);
  }
}

export class Wait extends Element {
  private dismissed = false;

  fast_forward(game: Crochet): void {
  }

  render(game: Crochet): void {
  }

  update(game: Crochet): Element | null {
    if (game.input.is_down("return")) {
      this.dismissed = true;
      return null;
    } else {
      return this;
    }
  }
}

export function from_primitive(value: CrochetValue | Element): Element {
  if (value instanceof CrochetText) {
    return new Text(value.value);
  } else if (value instanceof Element) {
    return value;
  } else {
    throw new Error(`Not supported ${value}`);
  }
}