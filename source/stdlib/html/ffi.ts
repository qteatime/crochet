import {
  CrochetInteger,
  CrochetRecord,
  CrochetStream,
  CrochetText,
  CrochetType,
  CrochetValue,
  False,
  ForeignBag,
  State,
  True,
} from "../../runtime";
import {
  foreign,
  foreign_namespace,
  foreign_type,
  machine,
} from "../../runtime/world/ffi-decorators";
import { cast, defer, delay } from "../../utils";
import { canvas } from "./canvas";
import {
  CrochetHtml,
  CrochetMenu,
  TCrochetHtml,
  TCrochetMenu,
} from "./element";

@foreign_namespace("crochet.ui.html")
export class HtmlFfi {
  @foreign_type("element")
  static get type_element(): CrochetType {
    return TCrochetHtml.type;
  }

  @foreign_type("menu")
  static get type_menu(): CrochetType {
    return TCrochetMenu.type;
  }

  @foreign("show")
  static async *show(state: State, value: CrochetHtml) {
    await canvas.show(value.value);
    return value;
  }

  @foreign("wait")
  static async *wait(state: State) {
    await canvas.click_to_continue();
    return False.instance;
  }

  @foreign("mark")
  static async *mark(state: State) {
    if (canvas.is_empty()) {
      return;
    } else {
      canvas.set_mark();
    }
    return False.instance;
  }

  @foreign("box")
  @machine()
  static box(
    name: CrochetText,
    klass: CrochetText,
    attributes: CrochetRecord,
    children: CrochetStream
  ) {
    const element = document.createElement(name.value);
    element.setAttribute("class", "crochet-box " + klass.value);
    for (const child of children.values) {
      element.appendChild(cast(child, CrochetHtml).value);
    }
    for (const [key, value] of attributes.values.entries()) {
      element.setAttribute(key, cast(value, CrochetText).value);
    }
    return new CrochetHtml(element);
  }

  @foreign("text")
  @machine()
  static text(value: CrochetText) {
    const text = document.createTextNode(value.value);
    const el = document.createElement("span");
    el.className = "crochet-text-span";
    el.appendChild(text);
    return new CrochetHtml(el);
  }

  @foreign("menu")
  @machine()
  static menu(klass: CrochetText, items: CrochetStream) {
    const selection = defer<CrochetValue>();

    const menu = document.createElement("div");
    menu.setAttribute("data-interactive", "true");
    menu.className = "crochet-box " + klass.value;
    for (const child of items.values) {
      const record = cast(child, CrochetRecord);
      const title = cast(record.projection.project("Title"), CrochetHtml);
      const value = record.projection.project("Value");
      menu.appendChild(title.value);
      title.value.addEventListener(
        "click",
        (ev) => {
          ev.stopPropagation();
          ev.preventDefault();
          title.value.setAttribute("data-selected", "true");
          menu.setAttribute("data-selected", "true");
          selection.resolve(value);
        },
        { once: true }
      );
    }

    return new CrochetMenu(menu, selection.promise);
  }

  @foreign("menu-selected")
  static async *menu_selected(state: State, menu: CrochetMenu) {
    return await menu.selected;
  }

  @foreign("preload")
  static async *preload(state: State, url: CrochetText) {
    const deferred = defer<CrochetValue>();

    const image = new Image();
    image.onload = () => deferred.resolve(True.instance);
    image.onerror = () =>
      deferred.reject(new Error(`Failed to load image ${url.value}`));
    image.src = url.value;

    return await deferred.promise;
  }

  @foreign("animate")
  static async *animate(
    state: State,
    element: CrochetHtml,
    time0: CrochetInteger
  ) {
    const time = Number(time0.value);
    for (const child of Array.from(element.value.children)) {
      (child as HTMLElement).style.opacity = "1";
      await delay(time);
    }
    return element;
  }

  @foreign("make-animation")
  static async *make_animation(state: State, children0: CrochetStream) {
    const element = document.createElement("div");
    const children = children0.values.map((x) => cast(x, CrochetHtml).value);

    element.className = "crochet-animation";
    for (const child of children) {
      element.appendChild(child);
    }
    children[0].style.opacity = "1";

    let last_width = 0;
    let last_height = 0;
    const interval = setInterval(() => {
      if (element.parentNode == null) {
        return;
      }

      const width = Math.max(...children.map((x) => x.offsetWidth));
      const height = Math.max(...children.map((x) => x.offsetHeight));
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
      if (width == last_width && height == last_height) {
        clearInterval(interval);
      } else {
        last_width = width;
        last_height = height;
      }
    }, 250);

    return new CrochetHtml(element);
  }
}
