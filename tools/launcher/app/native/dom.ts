import type { ForeignInterface, CrochetValue } from "../../../../build/crochet";

export default (ffi: ForeignInterface) => {
  function get_node(x0: CrochetValue): Node {
    const x = ffi.unbox(x0);
    if (x instanceof Node) {
      return x;
    } else {
      throw ffi.panic("invalid-type", "Expected a DOM Node");
    }
  }

  function get_element(x0: CrochetValue): HTMLElement {
    const x = ffi.unbox(x0);
    if (x instanceof HTMLElement) {
      return x;
    } else {
      throw ffi.panic("invalid-type", "Expected an HTMLElement");
    }
  }

  function get_frame(x0: CrochetValue): HTMLIFrameElement {
    const x = ffi.unbox(x0);
    if (x instanceof HTMLIFrameElement) {
      return x;
    } else {
      throw ffi.panic("invalid-type", "Expected an HTMLIFrameElement");
    }
  }

  function to_json(x: any): any {
    if (x instanceof Map) {
      const result = Object.create(null);
      for (const [k, v] of x.entries()) {
        result[k] = to_json(v);
      }
      return result;
    } else if (x instanceof Array) {
      return x.map((a) => to_json(a));
    } else {
      return x;
    }
  }

  ffi.defun("dom.render", (canvas0, widget0) => {
    const canvas = get_element(canvas0);
    const widget = get_node(widget0);
    for (const x of Array.from(canvas.childNodes)) {
      x.remove();
    }
    canvas.appendChild(widget);
    return ffi.nothing;
  });

  ffi.defun("dom.container", (tag0, class0, children0) => {
    const tag = ffi.text_to_string(tag0);
    const klass = ffi.text_to_string(class0);
    const children = ffi.list_to_array(children0);

    const element = document.createElement(tag);
    element.className = klass;
    for (const x of children) {
      element.appendChild(get_node(x));
    }

    return ffi.box(element);
  });

  ffi.defun("dom.icon", (name0) => {
    const name = ffi.text_to_string(name0);
    const icon = document.createElement("i");
    icon.className = `agata-icon fas fa-${name}`;
    return ffi.box(icon);
  });

  ffi.defun("dom.text", (contents0) => {
    const contents = ffi.text_to_string(contents0);
    const node = document.createTextNode(contents);
    return ffi.box(node);
  });

  ffi.defmachine("dom.button", function* (title0, on_click0, children0) {
    const title = ffi.text_to_string(title0);
    const on_click = yield ffi.make_closure(1, function* (ev) {
      return yield ffi.apply(on_click0, [ffi.box(ev)]);
    });
    const children = ffi.list_to_array(children0);

    const button = document.createElement("button");
    button.className = "agata-button";
    button.title = title;
    for (const x of children) {
      button.appendChild(get_node(x));
    }
    button.addEventListener("click", async function (ev) {
      ffi.run_asynchronously(function* () {
        yield ffi.apply(on_click, [ffi.box(ev)]);
        return ffi.nothing;
      });
    });

    return ffi.box(button);
  });

  ffi.defun("dom.tabbed-panel", function (tabs0) {
    let selected: null | HTMLElement[] = null;

    function select(button: HTMLElement, container: HTMLElement) {
      if (selected) {
        selected.forEach((x) => x.classList.remove("selected"));
      }
      selected = [button, container];
      selected.forEach((x) => x.classList.add("selected"));
    }

    const tabs = ffi.list_to_array(tabs0);

    const panel = document.createElement("div");
    panel.className = "agata-tabbed-panel";
    const header = document.createElement("div");
    header.className = "agata-tabbed-panel-header";
    panel.appendChild(header);
    const container = document.createElement("div");
    container.className = "agata-tabbed-panel-container";
    panel.appendChild(container);
    for (const pair of tabs) {
      const [title0, contents0] = ffi.list_to_array(pair);
      const title = ffi.text_to_string(title0);
      const contents = ffi.list_to_array(contents0);

      const tab_button = document.createElement("div");
      tab_button.className = "agata-tabbed-panel-button";
      tab_button.appendChild(document.createTextNode(title));
      header.appendChild(tab_button);

      const tab_container = document.createElement("div");
      tab_container.className = "agata-tabbed-panel-contents";
      for (const x of contents) {
        tab_container.appendChild(get_node(x));
      }
      container.appendChild(tab_container);

      if (!selected) {
        select(tab_button, tab_container);
      }

      tab_button.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        select(tab_button, tab_container);
      });
    }

    return ffi.box(panel);
  });

  ffi.defun("dom.set-style", (name0, value0, node0) => {
    const name = ffi.text_to_string(name0);
    const value = ffi.text_to_string(value0);
    const node = get_element(node0);
    node.style[name as any] = value;
    return ffi.nothing;
  });

  ffi.defmachine("dom.on-message", function* (handler) {
    const callback = yield ffi.make_closure(1, function* (msg) {
      const result = yield ffi.apply(handler, [msg]);
      return result;
    });

    window.addEventListener("message", (ev) => {
      ffi.run_asynchronously(function* () {
        if (ev.origin !== "http://localhost:8001") {
          return ffi.nothing;
        }

        debugger;

        const msg = ffi.text(JSON.stringify(ev.data));
        const result = yield ffi.apply(callback, [msg]);
        return ffi.nothing;
      });
    });

    return ffi.nothing;
  });

  ffi.defun("dom.post-message", (frame0, msg0) => {
    const frame = get_frame(frame0);
    const msg = to_json(ffi.to_plain_native(msg0));
    frame.contentWindow?.postMessage(msg, "http://localhost:8001");
    return ffi.nothing;
  });

  ffi.defun("dom.make-frame", (url0) => {
    const url = ffi.text_to_string(url0);
    const frame = document.createElement("iframe");
    frame.referrerPolicy = "no-referrer";
    frame.setAttribute("sandbox", "allow-scripts allow-same-origin");
    frame.src = url;
    return ffi.box(frame);
  });

  ffi.defun("dom.install-hidden-frame", (frame0) => {
    const frame = get_element(frame0);
    frame.style.display = "none";
    document.body.appendChild(frame);
    return ffi.nothing;
  });

  ffi.defun("dom.encode", (url0) => {
    const url = ffi.text_to_string(url0);
    return ffi.text(encodeURIComponent(url));
  });

  ffi.defmachine("dom.alert", function* (msg0) {
    const msg = ffi.text_to_string(msg0);
    alert(msg);
    return ffi.nothing;
  });

  ffi.defun("dom.debugger", () => {
    debugger;
    return ffi.nothing;
  });
};
