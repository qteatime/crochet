import {
  CrochetRecord,
  CrochetStream,
  CrochetText,
  CrochetValue,
  False,
  ForeignBag,
  State,
} from "../../runtime";
import {
  foreign,
  foreign_namespace,
  machine,
} from "../../runtime/world/ffi-decorators";
import { cast, defer } from "../../utils";
import { lazy } from "../../utils/decorators";
import { CrochetHtml, CrochetMenu } from "./element";

export class Canvas {
  @lazy()
  static get instance() {
    return document.createElement("div");
  }
}

@foreign_namespace("crochet.ui.html")
export class HtmlFfi {
  @foreign("show")
  static async *show(state: State, value: CrochetHtml) {
    Canvas.instance.appendChild(value.value);
  }

  @foreign("wait")
  static async *wait(state: State) {
    const result = defer<CrochetValue>();

    Canvas.instance.addEventListener(
      "click",
      (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        result.resolve(False.instance);
      },
      { once: true }
    );

    return await result.promise;
  }

  @foreign("box")
  @machine()
  static box(name: CrochetText, klass: CrochetText, children: CrochetStream) {
    const element = document.createElement(name.value);
    element.setAttribute("class", "crochet-box " + klass.value);
    for (const child of children.values) {
      element.appendChild(cast(child, CrochetHtml).value);
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
    menu.className = "crochet-box crochet-menu " + klass;
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
}
