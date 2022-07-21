import { CrochetValue, ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  interface Deferred<A> {
    resolve(a: A): void;
    reject(x: any): void;
    promise: Promise<A>;
  }

  function defer<A>(): Deferred<A> {
    const p: any = {};
    p.promise = new Promise((resolve, reject) => {
      p.resolve = resolve;
      p.reject = reject;
    });
    return p;
  }

  function h(
    tag: string,
    attrs: { [key: string]: string },
    children: (string | Node)[]
  ) {
    const element = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      element.setAttribute(key, value);
    }
    for (const child of children) {
      element.append(child);
    }
    return element;
  }

  function wrap(x0: number, max: number) {
    const x = x0 % max;
    return x < 0 ? max + x : x;
  }

  function wrap_choose<A>(x: A[], index0: number) {
    const index = wrap(index0, x.length);
    return x[index];
  }

  function clear(x: HTMLElement) {
    x.textContent = "";
    return x;
  }

  abstract class MenuItem {
    abstract render(): HTMLElement;
  }

  class MILeaf extends MenuItem {
    constructor(readonly text: string, readonly value: CrochetValue) {
      super();
    }

    render() {
      return h("div", { class: "novella-menu-item-text" }, [this.text]);
    }
  }

  class Menu {
    constructor(readonly items: MenuItem[]) {}
  }

  ffi.defun("dom.make", (tag, klass) => {
    const element = document.createElement(ffi.text_to_string(tag));
    element.className = ffi.text_to_string(klass);
    return ffi.box(element);
  });

  ffi.defun("dom.text", (text) => {
    const node = document.createTextNode(ffi.text_to_string(text));
    return ffi.box(node);
  });

  ffi.defun("dom.is-element", (x) => {
    return ffi.boolean(ffi.unbox(x) instanceof HTMLElement);
  });

  ffi.defun("dom.append", (parent0, child0) => {
    const parent = ffi.unbox_typed(Node, parent0);
    const child = ffi.unbox_typed(Node, child0);
    parent.appendChild(child);
    return parent0;
  });

  ffi.defun("dom.set", (node0, attr0, value0) => {
    const node = ffi.unbox_typed(HTMLElement, node0);
    const attr = ffi.text_to_string(attr0);
    const value = ffi.text_to_string(value0);
    node.setAttribute(attr, value);
    return node0;
  });

  ffi.defun("dom.set-style", (node0, styles0) => {
    const node = ffi.unbox_typed(HTMLElement, node0);
    const styles = ffi.record_to_map(styles0);
    for (const [k, v] of styles) {
      node.style[k as any] = ffi.text_to_string(v);
    }
    return node0;
  });

  ffi.defun("dom.clear", (node0) => {
    const node = ffi.unbox_typed(HTMLElement, node0);
    node.textContent = "";
    return node0;
  });

  ffi.defun("dom.detach", (node0) => {
    const node = ffi.unbox_typed(Node, node0);
    node.parentNode!.removeChild(node);
    return node0;
  });

  ffi.defun("dom.is-attached", (node0) => {
    return ffi.boolean(ffi.unbox_typed(Node, node0).parentNode != null);
  });

  ffi.defmachine("dom.wait-interaction", function* () {
    const deferred = defer();
    const clickListener = (ev: MouseEvent) => {
      if (ev.button === 0) {
        deferred.resolve(null);
        cleanup();
      }
    };

    const keyListener = (ev: KeyboardEvent) => {
      if (ev.key === "Enter") {
        deferred.resolve(null);
        cleanup();
      }
    };

    function cleanup() {
      document.removeEventListener("click", clickListener);
      document.removeEventListener("keyup", keyListener);
    }

    document.addEventListener("click", clickListener);
    document.addEventListener("keyup", keyListener);

    yield ffi.await(deferred.promise.then((_) => ffi.nothing));

    return ffi.nothing;
  });

  ffi.defun("dom.make-menu-leaf", (text, value) => {
    return ffi.box(new MILeaf(ffi.text_to_string(text), value));
  });

  ffi.defun("dom.make-menu", (items0) => {
    const items = ffi
      .list_to_array(items0)
      .map((x) => ffi.unbox_typed(MenuItem, x));
    return ffi.box(new Menu(items));
  });

  ffi.defmachine("dom.show-menu", function* (prefix0, node0, menu0) {
    const prefix = ffi.text_to_string(prefix0);
    const node = ffi.unbox_typed(HTMLElement, node0);
    const menu = ffi.unbox_typed(Menu, menu0);
    const deferred = defer<CrochetValue>();
    let items = menu.items;
    let position = 0;

    const menu_container = h("div", { class: "novella-menu-container" }, []);
    const menu_prefix = h("div", { class: "novella-menu-prefix" }, [prefix]);
    const menu_selection = h(
      "div",
      { class: "novella-menu-selection-container" },
      []
    );
    const menu_selection_previous = h(
      "div",
      { class: "novella-menu-selection-previous" },
      []
    );
    const menu_selection_current = h(
      "div",
      { class: "novella-menu-selection-current" },
      []
    );
    const menu_selection_next = h(
      "div",
      { class: "novella-menu-selection-next" },
      []
    );
    const menu_suffix = h("div", { class: "novella-menu-suffix" }, []);

    menu_container.appendChild(menu_prefix);
    menu_container.appendChild(menu_selection);
    menu_selection.appendChild(menu_selection_previous);
    menu_selection.appendChild(menu_selection_current);
    menu_selection.appendChild(menu_selection_next);
    menu_container.appendChild(menu_suffix);

    function render_selection() {
      const current = render_item(wrap_choose(items, position));
      const previous = render_item(wrap_choose(items, position - 1));
      const next = render_item(wrap_choose(items, position + 1));
      clear(menu_selection_previous).appendChild(previous);
      clear(menu_selection_current).appendChild(current);
      clear(menu_selection_next).appendChild(next);
    }

    function render_item(item: MenuItem) {
      return item.render();
    }

    function accept_selection(selected: MenuItem) {
      if (selected instanceof MILeaf) {
        document.removeEventListener("keyup", input_listener);
        deferred.resolve(selected.value);
      }
    }

    function input_listener(ev: KeyboardEvent) {
      if (ev.key === "ArrowUp") {
        position = wrap(position - 1, items.length);
      } else if (ev.key === "ArrowDown") {
        position = wrap(position + 1, items.length);
      } else if (ev.key === "Enter") {
        const selected = wrap_choose(items, position);
        accept_selection(selected);
        ev.stopPropagation();
        ev.preventDefault();
        return;
      }
      ev.stopPropagation();
      ev.preventDefault();
      render_selection();
    }

    render_selection();
    node.appendChild(menu_container);
    document.addEventListener("keyup", input_listener);

    return yield ffi.await(deferred.promise);
  });
};