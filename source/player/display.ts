import { h } from "./html";

export class Display {
  constructor(private canvas: Element) {}

  append(x: Element) {
    this.canvas.appendChild(x);
    x.scrollIntoView();
  }

  show_error(error: string) {
    console.error(error);
    const element = h("div", { class: "crochet-error" }, error);
    this.canvas.appendChild(element);
  }

  show_text(text: string) {
    const element = h("div", { class: "crochet-text" }, text);
    this.append(element);
  }
}
