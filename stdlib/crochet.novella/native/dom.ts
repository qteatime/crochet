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

  function* enumerate<A>(xs: A[]) {
    let index = 0;
    for (const x of xs) {
      yield { index: index++, value: x };
    }
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

  class HTMLWrapper {
    constructor(readonly value: HTMLElement) {}

    on(event: string, callback: (...x: any[]) => any) {
      this.value.addEventListener(event, callback);
      return this;
    }

    unwrap() {
      return this.value;
    }
  }

  function $(x: HTMLElement) {
    return new HTMLWrapper(x);
  }

  function wrap(x0: number, max: number) {
    const x = x0 % max;
    return x < 0 ? max + x : x;
  }

  function clear(x: HTMLElement) {
    x.textContent = "";
    return x;
  }

  function highlight_query(query: string, text: string) {
    if (query.trim() == "") {
      return text;
    }

    const re = new RegExp(
      query.trim().replace(/([^\w\d])/g, (_, x) => "\\" + x),
      "gi"
    );
    let last = 0;
    const elements = [];
    while (true) {
      const next = re.exec(text);
      if (next == null || re.lastIndex == -1) {
        elements.push(text.slice(last));
        break;
      } else {
        elements.push(text.slice(last, next.index));
        elements.push(
          h("span", { class: "novella-selection-highlight" }, [next[0]])
        );
        last = re.lastIndex;
      }
    }
    return h("span", { class: "novella-selection-with-highlights" }, elements);
  }

  abstract class MenuItem {
    abstract render(query: string): { text: HTMLElement; suffix: HTMLElement };
    abstract prefix_text(): string;
    abstract suffix_text(): string[];
  }

  class MILeaf extends MenuItem {
    constructor(readonly text: string, readonly value: CrochetValue) {
      super();
    }

    render(query: string) {
      return {
        text: h("div", { class: "novella-menu-item-text" }, [
          highlight_query(query, this.text),
        ]),
        suffix: h("div", { class: "novella-menu-item-empty" }, []),
      };
    }

    prefix_text() {
      return this.text;
    }

    suffix_text() {
      return [this.text];
    }
  }

  class MIBranch extends MenuItem {
    constructor(readonly prefix: string, readonly items: MenuItem[]) {
      super();
    }

    prefix_text() {
      return this.prefix;
    }

    suffix_text() {
      return this.items.flatMap((x) =>
        x.suffix_text().map((x) => `${this.prefix} ${x}`)
      );
    }

    render(query: string) {
      return {
        text: h("div", { class: "novella-menu-item-branch" }, [
          highlight_query(query, this.prefix),
        ]),
        suffix: h("div", { class: "novella-menu-item-rotating-suffix" }, [
          ...this.items
            .flatMap((x) => x.suffix_text())
            .map((x) =>
              h("div", { class: "novella-menu-item-rotating-suffix-text" }, [x])
            ),
        ]),
      };
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

  ffi.defun("dom.make-css", (css0) => {
    const css = ffi.text_to_string(css0);
    const node = document.createElement("style");
    node.setAttribute("type", "text/css");
    node.setAttribute("media", "screen");
    node.appendChild(document.createTextNode(css));
    return ffi.box(node);
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

  ffi.defun("dom.add-class", (node0, class0) => {
    const node = ffi.unbox_typed(HTMLElement, node0);
    node.classList.add(ffi.text_to_string(class0));
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

  ffi.defun("dom.make-menu-branch", (prefix, items0) => {
    const items = ffi
      .list_to_array(items0)
      .map((x) => ffi.unbox_typed(MenuItem, x));
    return ffi.box(new MIBranch(ffi.text_to_string(prefix), items));
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
    let all_items = menu.items;
    let items = menu.items;
    let trail: MIBranch[] = [];
    let position = 0;
    let roll_timer: any = null;
    let previous_value = "";

    const menu_container = h("div", { class: "novella-menu-container" }, []);
    const menu_prefix = h("div", { class: "novella-menu-prefix" }, [prefix]);
    const menu_breadcrumb = h("div", { class: "novella-menu-breadcrumb" }, []);
    const menu_input = h(
      "input",
      { class: "novella-menu-input" },
      []
    ) as HTMLInputElement;
    const menu_selection = h(
      "div",
      { class: "novella-menu-selection-container" },
      []
    );
    const menu_selection_completion = h(
      "div",
      { class: "novella-menu-selection-completion" },
      []
    );
    const menu_selection_current = h(
      "div",
      { class: "novella-menu-selection-current" },
      [menu_input]
    );
    const menu_suffix = h("div", { class: "novella-menu-suffix" }, []);

    menu_container.appendChild(menu_prefix);
    menu_container.appendChild(menu_breadcrumb);
    menu_container.appendChild(menu_selection);
    menu_selection.appendChild(menu_selection_current);
    menu_selection.appendChild(menu_selection_completion);
    menu_container.appendChild(menu_suffix);

    function render_selection() {
      if (items.length === 0) {
        return;
      }
      const query = menu_input.value;
      const { suffix: current_suffix } = items[position].render(query);
      const completions = items.map((x) => x.render(query).text);
      clear(menu_breadcrumb);
      for (const { index, value } of enumerate(trail)) {
        menu_breadcrumb.appendChild(
          h("div", { class: "novella-menu-breadcrumb-node" }, [
            value.render("").text,
            $(
              h("button", { class: "novella-menu-breadcrumb-remove" }, [
                h("i", { class: "novella-icon fas fa-times" }, []),
              ])
            )
              .on("click", (ev: MouseEvent) => {
                if (index == 0) {
                  trail = [];
                  items = menu.items;
                  position = 0;
                  render_selection();
                } else {
                  trail = trail.slice(0, index);
                  items = trail[index - 1].items;
                  position = 0;
                  render_selection();
                }
              })
              .unwrap(),
          ])
        );
      }

      menu_input.focus();
      clear(menu_suffix).appendChild(current_suffix);
      clear(menu_selection_completion);
      for (const { index, value } of enumerate(completions)) {
        const x = h(
          "button",
          { class: "novella-menu-selection-completion-item" },
          [value]
        );
        x.addEventListener("click", () => {
          accept_selection(items[index]);
        });
        menu_selection_completion.appendChild(x);
        if (index === position) {
          x.classList.add("novella-menu-selection-completion-selected");
          menu_selection_completion.scrollTop = x.offsetTop;
        }
      }
      roll_animate();
    }

    function roll_animate() {
      clearTimeout(roll_timer);
      const items = Array.from(
        menu_suffix.querySelectorAll(
          ".novella-menu-item-rotating-suffix .novella-menu-item-rotating-suffix-text"
        )
      );
      if (items.length === 0) {
        return;
      }

      let current = 0;
      function do_next() {
        clearTimeout(roll_timer);

        for (const { index, value } of enumerate(items)) {
          if (index === current) {
            value.classList.add("novella-rotating-suffix-shown");
          } else {
            value.classList.remove("novella-rotating-suffix-shown");
          }
        }
        current = wrap(current + 1, items.length);

        roll_timer = setTimeout(do_next, 1500);
      }
      do_next();
    }

    function accept_selection(selected: MenuItem) {
      if (selected instanceof MILeaf) {
        deferred.resolve(selected.value);
      } else if (selected instanceof MIBranch) {
        trail.push(selected);
        menu_input.value = "";
        previous_value = "";
        all_items = selected.items;
        items = selected.items;
        position = 0;
        render_selection();
      }
    }

    function filter_items() {
      items = all_items.filter((x) =>
        x.prefix_text().includes(menu_input.value)
      );
      if (items.length === 0) {
        menu_container.classList.add("novella-invalid-selection");
      } else {
        menu_container.classList.remove("novella-invalid-selection");
      }
    }

    function input_listener(ev: KeyboardEvent) {
      filter_items();
      if (ev.key === "ArrowUp") {
        ev.stopPropagation();
        ev.preventDefault();
        if (position === 0) {
          return;
        }
        position = position - 1;
        render_selection();
      } else if (ev.key === "ArrowDown") {
        ev.stopPropagation();
        ev.preventDefault();
        if (position >= items.length - 1) {
          return;
        }
        position = position + 1;
        render_selection();
      } else if (ev.key === "Enter") {
        if (items.length === 0) {
          return;
        }
        const selected = items[position];
        accept_selection(selected);
        ev.stopPropagation();
        ev.preventDefault();
        return;
      } else if (ev.key === "Backspace" || ev.key === "Escape") {
        if (menu_input.value === "") {
          if (previous_value !== "") {
            previous_value = "";
            return;
          }
          trail.pop();
          if (trail.length === 0) {
            all_items = menu.items;
          } else {
            all_items = trail[trail.length - 1].items;
          }
          items = all_items.slice();
          position = 0;
          render_selection();
        } else {
          render_selection();
        }
      } else {
        position = 0;
        render_selection();
      }
      previous_value = menu_input.value;
    }

    render_selection();
    node.appendChild(menu_container);
    document.addEventListener("keyup", input_listener);
    menu_input.focus();

    const result = yield ffi.await(deferred.promise);

    document.removeEventListener("keyup", input_listener);
    node.removeChild(menu_container);

    return result;
  });

  ffi.defun("dom.make-sound", (name0, loop) => {
    const name = ffi.text_to_string(name0);
    const el = h(
      "audio",
      { "data-name": name, class: "novella-sound-channel" },
      []
    ) as HTMLAudioElement;
    el.loop = ffi.to_js_boolean(loop);
    return ffi.box(el);
  });

  ffi.defun("dom.play-sound", (channel0, src) => {
    const channel = ffi.unbox_typed(HTMLAudioElement, channel0);
    channel.src = ffi.text_to_string(src);
    channel.play();
    return ffi.nothing;
  });
};
