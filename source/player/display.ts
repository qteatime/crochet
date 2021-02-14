import { defer, delay } from "../utils/utils";
import { h } from "./html";

type Item<A> = {
  title: string;
  value: A;
};

export class Display {
  private history: HTMLElement = h("div", { class: "crochet-history" });
  private mark: null | HTMLElement = null;

  constructor(private canvas: HTMLElement) {}

  private async wait_mark(x: HTMLElement) {
    if (this.mark == null) {
      this.mark = x;
      return;
    }

    const old_visibility = x.style.visibility;
    const old_animation = x.style.animation;
    x.style.visibility = "hidden";
    x.style.animation = "none";
    this.canvas.appendChild(x);
    const bottom = x.offsetTop + x.offsetHeight;
    this.canvas.removeChild(x);
    x.style.animation = old_animation;
    x.style.visibility = old_visibility;

    const markTop = this.mark.offsetTop;
    const height = this.canvas.clientHeight;
    if (bottom - markTop > height) {
      await this.click_to_continue();
      this.mark = x;
    }
  }

  async new_page() {
    for (const child of Array.from(this.canvas.children)) {
      this.history.appendChild(child);
    }
  }

  async click_to_continue(x?: HTMLElement) {
    await delay(100);
    const deferred = defer<void>();
    this.canvas.setAttribute("data-wait", "true");
    this.canvas.addEventListener(
      "click",
      (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        this.canvas.removeAttribute("data-wait");
        if (x != null) {
          this.mark = x;
        } else {
          const children = this.canvas.children;
          this.mark = children.item(children.length - 1) as HTMLElement;
        }
        deferred.resolve();
      },
      { once: true }
    );
    return deferred.promise;
  }

  async show(x: HTMLElement) {
    await this.wait_mark(x);
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
    element.addEventListener(
      "click",
      (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        element.setAttribute("data-selected", "true");
        on_click();
      },
      { once: true }
    );
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
    await this.show(
      this.menu(options, (selection) => deferred.resolve(selection))
    );
    return deferred.promise;
  }
}
