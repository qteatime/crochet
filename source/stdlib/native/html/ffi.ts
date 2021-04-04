import {
  CrochetInteger,
  CrochetRecord,
  CrochetStream,
  CrochetText,
  CrochetType,
  CrochetValue,
  cvalue,
  False,
  ForeignBag,
  Machine,
  State,
  True,
  _await,
} from "../../../runtime";
import {
  foreign,
  foreign_namespace,
  foreign_type,
  machine,
} from "../../../runtime/world/ffi-decorators";
import { cast, defer, delay } from "../../../utils";
import { canvas } from "./canvas";
import {
  CrochetHtml,
  CrochetMenu,
  TCrochetHtml,
  TCrochetMenu,
} from "./element";

@foreign_namespace("crochet.ui.html:html")
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
  static *show(state: State, value0: CrochetValue): Machine {
    const value = cast(value0, CrochetHtml);
    yield _await(canvas.show(value.value));
    return value;
  }

  @foreign("wait")
  static *wait(state: State): Machine {
    yield _await(canvas.click_to_continue());
    return False.instance;
  }

  @foreign("mark")
  static *mark(state: State): Machine {
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
    name0: CrochetValue,
    klass0: CrochetValue,
    attributes0: CrochetValue,
    children0: CrochetValue
  ) {
    const name = cast(name0, CrochetText);
    const klass = cast(klass0, CrochetText);
    const attributes = cast(attributes0, CrochetRecord);
    const children = cast(children0, CrochetStream);

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
  static text(value0: CrochetValue) {
    const value = cast(value0, CrochetText);

    const text = document.createTextNode(value.value);
    const el = document.createElement("span");
    el.className = "crochet-text-span";
    el.appendChild(text);
    return new CrochetHtml(el);
  }

  @foreign("menu")
  @machine()
  static menu(klass0: CrochetValue, items0: CrochetValue) {
    const klass = cast(klass0, CrochetText);
    const items = cast(items0, CrochetStream);

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
  static *menu_selected(state: State, menu0: CrochetValue): Machine {
    const menu = cast(menu0, CrochetMenu);

    return yield _await(menu.selected);
  }

  @foreign("preload")
  static *preload(state: State, url0: CrochetValue): Machine {
    const url = cast(url0, CrochetText);

    const deferred = defer<CrochetValue>();

    const image = new Image();
    image.onload = () => deferred.resolve(True.instance);
    image.onerror = () =>
      deferred.reject(new Error(`Failed to load image ${url.value}`));
    image.src = url.value;

    const result = cvalue(yield _await(deferred.promise));
    return result;
  }

  @foreign("animate")
  static *animate(
    state: State,
    element0: CrochetValue,
    time0: CrochetValue
  ): Machine {
    const element = cast(element0, CrochetHtml);
    const time = Number(cast(time0, CrochetInteger));

    for (const child of Array.from(element.value.children)) {
      (child as HTMLElement).style.opacity = "1";
      yield _await(delay(time));
    }
    return element;
  }

  @foreign("make-animation")
  static *make_animation(state: State, children0: CrochetValue) {
    const children1 = cast(children0, CrochetStream);

    const element = document.createElement("div");
    const children = children1.values.map((x) => cast(x, CrochetHtml).value);

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

export default [HtmlFfi];
