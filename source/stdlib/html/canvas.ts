import { die } from "../../runtime";
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
      throw die(`HTML canvas has not been initialised`);
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

  private is_interactive(x: HTMLElement): boolean {
    if (x.getAttribute("data-interactive") === "true") {
      return true;
    }
    const children = Array.from(x.children);
    if (children.length === 0) {
      return false;
    } else {
      return children.some(
        (x) => x instanceof HTMLElement && this.is_interactive(x)
      );
    }
  }

  private async wait_mark(x: HTMLElement) {
    if (this.mark == null) {
      this.mark = x;
      return;
    }

    const dimensions = this.measure(x);
    if (dimensions.bottom - this.mark.offsetTop > this.canvas.clientHeight) {
      await this.click_to_continue(x);
    }
    if (this.is_interactive(x)) {
      this.mark = null;
    }
  }

  async animate(x: HTMLElement, frames: Keyframe[], time: number) {
    const deferred = defer<void>();
    const animation = x.animate(frames, time);
    animation.addEventListener("finish", () => deferred.resolve());
    animation.addEventListener("cancel", () => deferred.resolve());
    await deferred.promise;
  }

  async animate_appear(x: HTMLElement, time: number) {
    x.style.opacity = "0";
    x.style.top = "-1em";
    x.style.position = "relative";
    const appear = [
      { opacity: 0, top: "-1em" },
      { opacity: 1, top: "0px" },
    ];
    await this.animate(x, appear, time);
    x.style.opacity = "1";
    x.style.top = "0px";
    x.style.position = "relative";
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
    x.style.opacity = "0";
    this.canvas.appendChild(x);
    x.scrollIntoView();
    await this.animate_appear(x, 200);
  }

  async show_error(error: string) {
    console.error(error);
    const element = document.createElement("div");
    element.className = "crochet-error";
    element.appendChild(document.createTextNode(error));
    this.canvas.appendChild(element);
  }

  set_mark(x?: HTMLElement) {
    if (x == null) {
      this.mark =
        (this.canvas.children.item(
          this.canvas.children.length - 1
        ) as HTMLElement) ?? null;
    } else {
      this.mark = x;
    }
  }

  is_empty() {
    return this.canvas.childElementCount === 0;
  }

  render_to(x: HTMLElement) {
    this._canvas = x;
  }
}

export const canvas = new Canvas();
