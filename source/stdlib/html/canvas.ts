import { defer } from "../../utils";
import { lazy } from "../../utils/decorators";

export class Rect {
  constructor(
    readonly left: number,
    readonly top: number,
    readonly width: number,
    readonly height: number
  ) {}

  static from_element_offset(x: HTMLElement) {
    return new Rect(x.offsetLeft, x.offsetTop, x.offsetWidth, x.offsetHeight);
  }

  get bottom() {
    return this.top + this.height;
  }

  get right() {
    return this.left + this.width;
  }
}

export class Canvas {
  private mark: HTMLElement | null = null;
  private _canvas!: HTMLElement;

  get canvas() {
    if (this._canvas == null) {
      throw new Error(`internal: HTML canvas has not been initialised`);
    }
    return this._canvas;
  }

  private measure(x: HTMLElement) {
    const old_visibility = x.style.visibility;
    const old_animation = x.style.animation;
    x.style.visibility = "hidden";
    x.style.animation = "none";
    this.canvas.appendChild(x);
    const dimensions = Rect.from_element_offset(x);
    this.canvas.removeChild(x);
    x.style.animation = old_animation;
    x.style.visibility = old_visibility;

    return dimensions;
  }

  private async wait_mark(x: HTMLElement) {
    if (this.mark == null) {
      this.mark = x;
      return;
    }

    const dimensions = this.measure(x);
    if (dimensions.bottom > this.canvas.clientHeight) {
      await this.click_to_continue(x);
    }
  }

  async click_to_continue(x?: HTMLElement) {
    const deferred = defer<void>();
    this.canvas.setAttribute("data-wait", "true");

    this.canvas.addEventListener("click", (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      this.canvas.removeAttribute("data-wait");

      if (x != null) {
        this.mark = x;
      } else {
        const children = this.canvas.children;
        this.mark = (children.item(children.length - 1) as HTMLElement) ?? null;
      }
      deferred.resolve();
    });

    return deferred.promise;
  }

  async show(x: HTMLElement) {
    await this.wait_mark(x);
    this.canvas.appendChild(x);
    x.scrollIntoView();
  }

  async show_error(error: string) {
    console.error(error);
    const element = document.createElement("div");
    element.className = "crochet-error";
    element.appendChild(document.createTextNode(error));
    this.canvas.appendChild(element);
  }

  render_to(x: HTMLElement) {
    this._canvas = x;
  }
}

export const canvas = new Canvas();
