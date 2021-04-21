import {
  CrochetInteger,
  CrochetRecord,
  CrochetTuple,
  CrochetText,
  CrochetValue,
  cvalue,
  False,
  Machine,
  True,
  _await,
  ForeignInterface,
  ValuePattern,
  CrochetNothing,
} from "../../../runtime";
import { cast, defer, delay } from "../../../utils";
import { ForeignNamespace } from "../../ffi-def";
import { canvas } from "./canvas";
import {
  CrochetHtml,
  CrochetMenu,
  TCrochetHtml,
  TCrochetMenu,
} from "./element";

export function html_ffi(ffi: ForeignInterface) {
  new ForeignNamespace(ffi, "crochet.ui.html:html")
    .deftype("element", TCrochetHtml.type)
    .deftype("menu", TCrochetMenu.type)
    .defmachine("show", [CrochetHtml], function* (_, html): Machine {
      yield _await(canvas.show(html.value));
      return ValuePattern;
    })
    .defmachine("wait", [], function* (_): Machine {
      yield _await(canvas.click_to_continue());
      return CrochetNothing.instance;
    })
    .defun("mark", [], () => {
      if (!canvas.is_empty()) {
        canvas.set_mark();
      }
      return CrochetNothing.instance;
    })
    .defun(
      "box",
      [CrochetText, CrochetText, CrochetRecord, CrochetTuple],
      (name, klass, attributes, children) => {
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
    )
    .defun("text", [CrochetText], (text0) => {
      const text = document.createTextNode(text0.value);
      const el = document.createElement("span");
      el.className = "crochet-text-span";
      el.appendChild(text);
      return new CrochetHtml(el);
    })
    .defun("menu", [CrochetText, CrochetTuple], (klass, items) => {
      const selection = defer<CrochetValue>();

      const menu = document.createElement("div");
      menu.setAttribute("data-interactive", "true");
      menu.className = "crochet-box " + klass.value;
      for (const child of items.values) {
        const record = cast(child, CrochetRecord);
        const title = cast(
          record.projection.project("Title", null),
          CrochetHtml
        );
        const value = record.projection.project("Value", null);
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
    })
    .defmachine("menu-selected", [CrochetMenu], function* (_, menu): Machine {
      return yield _await(menu.selected);
    })
    .defmachine("preload", [CrochetText], function* (_, url): Machine {
      const deferred = defer<CrochetValue>();

      const image = new Image();
      image.onload = () => deferred.resolve(True.instance);
      image.onerror = () =>
        deferred.reject(new Error(`Failed to load image ${url.value}`));
      image.src = url.value;

      const result = cvalue(yield _await(deferred.promise));
      return result;
    })
    .defmachine(
      "animate",
      [CrochetHtml, CrochetInteger],
      function* (_, element, time0) {
        const time = Number(time0.value);
        for (const child of Array.from(element.value.children)) {
          (child as HTMLElement).style.opacity = "1";
          yield _await(delay(time));
        }
        return element;
      }
    )
    .defun("make-animation", [CrochetTuple], (children1) => {
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
          return CrochetNothing.instance;
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
    });
}

export default [html_ffi];
