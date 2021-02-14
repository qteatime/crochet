import { defer } from "../utils/utils";
import { h } from "./html";

type Item<A> = {
  title: string;
  value: A;
};

export class Display {
  constructor(private canvas: Element) {}

  async show(x: Element) {
    this.canvas.appendChild(x);
    x.scrollIntoView();
  }

  async show_error(error: string) {
    console.error(error);
    const element = h("div", { class: "crochet-error" }, error);
    this.canvas.appendChild(element);
  }

  text(text: string) {
    return h("div", { class: "crochet-text" }, text);
  }

  monospaced_text(text: string) {
    return h("div", { class: "crochet-mono" }, text);
  }

  title(text: string) {
    return h("div", { class: "crochet-title" }, text);
  }

  divider() {
    return h("div", { class: "crochet-divider" });
  }

  button(text: string, on_click: () => void) {
    const element = h("div", { class: "crochet-button" }, text);
    element.addEventListener("click", (_) => {
      element.setAttribute("data-selected", "true");
      on_click();
    });
    return element;
  }

  menu<A>(options: Item<A>[], on_selected: (selection: A) => void) {
    const element = h(
      "div",
      { class: "crochet-menu" },
      ...options.map((x) =>
        this.button(x.title, () => {
          element.setAttribute("data-selected", "true");
          on_selected(x.value);
        })
      )
    );
    return element;
  }

  async show_menu<A>(options: Item<A>[]) {
    const deferred = defer<A>();
    this.show(this.menu(options, (selection) => deferred.resolve(selection)));
    return deferred.promise;
  }
}
