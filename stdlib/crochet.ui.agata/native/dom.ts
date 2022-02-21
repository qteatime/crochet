import type { CrochetValue, ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  function unbox_typed<T extends Function>(
    x0: CrochetValue,
    type: T
  ): T["prototype"] {
    const x = ffi.unbox(x0);
    if (x instanceof type) {
      return x as any;
    } else {
      throw ffi.panic("invalid-type", `Expected native ${type.name}`);
    }
  }

  function get_element(x0: CrochetValue) {
    return unbox_typed(x0, HTMLElement);
  }

  function get_node(x0: CrochetValue) {
    return unbox_typed(x0, Node);
  }

  ffi.defun("dom.make", (tag, klass) => {
    const element = document.createElement(ffi.text_to_string(tag));
    element.className = ffi.text_to_string(klass);
    return ffi.box(element);
  });

  ffi.defun("dom.children-fragment", (x0) => {
    const x = get_element(x0);
    const f = document.createDocumentFragment();
    for (const c of x.children) {
      f.append(c);
    }
    return ffi.box(f);
  });

  ffi.defun("dom.make-text", (text) => {
    return ffi.box(document.createTextNode(ffi.text_to_string(text)));
  });

  ffi.defun("dom.set-attribute", (x, attr, value) => {
    get_element(x).setAttribute(
      ffi.text_to_string(attr),
      ffi.text_to_string(value)
    );
    return ffi.nothing;
  });

  ffi.defun("dom.unset-attribute", (x, attr) => {
    get_element(x).removeAttribute(ffi.text_to_string(attr));
    return ffi.nothing;
  });

  ffi.defun("dom.append", (x, y) => {
    get_element(x).appendChild(get_node(y));
    return ffi.nothing;
  });

  ffi.defun("dom.prepend", (x0, y) => {
    const x = get_element(x0);
    if (x.firstChild == null) {
      x.appendChild(get_node(y));
    } else {
      x.insertBefore(x.firstChild, get_node(y));
    }
    return ffi.nothing;
  });

  ffi.defun("dom.detach", (x) => {
    get_element(x).remove();
    return ffi.nothing;
  });

  ffi.defun("dom.is-attached", (x) => {
    return ffi.boolean(get_element(x).parentNode != null);
  });

  ffi.defun("dom.replace-contents", (x0, y) => {
    const x = get_element(x0);
    x.innerHTML = "";
    x.appendChild(get_node(y));
    return ffi.nothing;
  });

  ffi.defun("dom.set-style", (x0, style0) => {
    const x = get_element(x0);
    const style = ffi.record_to_map(style0);
    for (const [k, v] of style.entries()) {
      x.style[k as any] = ffi.text_to_string(v);
    }
    return ffi.nothing;
  });

  ffi.defun("dom.ensure-element", (x0) => {
    const x = get_element(x0);
    return ffi.box(x);
  });

  ffi.defun("dom.input-value", (x0) => {
    const x = unbox_typed(x0, HTMLElement);
    if (x instanceof HTMLInputElement || x instanceof HTMLTextAreaElement) {
      return ffi.text(x.value);
    } else {
      throw ffi.panic("invalid-type", `Not an input element`);
    }
  });

  ffi.defun("dom.set-text-input-value", (x0, value) => {
    const x = unbox_typed(x0, HTMLElement);
    if (x instanceof HTMLInputElement || x instanceof HTMLTextAreaElement) {
      x.value = ffi.text_to_string(value);
      return ffi.nothing;
    } else {
      throw ffi.panic("invalid-type", `Not an input element`);
    }
  });

  ffi.defun("dom.input-is-checked", (x0) => {
    const x = unbox_typed(x0, HTMLInputElement);
    return ffi.boolean(x.checked);
  });

  ffi.defun("dom.listen", (x0, name, block) => {
    const x = get_element(x0);
    x.addEventListener(ffi.text_to_string(name), (ev) => {
      ffi.run_asynchronously(function* () {
        yield ffi.apply(block, [ffi.box(ev)]);
        return ffi.nothing;
      });
    });
    return ffi.nothing;
  });

  ffi.defun("dom.trap-listen", (x0, name, block) => {
    const x = get_element(x0);
    x.addEventListener(ffi.text_to_string(name), (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      ffi.run_asynchronously(function* () {
        yield ffi.apply(block, [ffi.box(ev)]);
        return ffi.nothing;
      });
    });
    return ffi.nothing;
  });

  ffi.defun("dom.add-class", (x0, name) => {
    const x = get_element(x0);
    x.classList.add(ffi.text_to_string(name));
    return ffi.nothing;
  });

  ffi.defun("dom.remove-class", (x0, name) => {
    const x = get_element(x0);
    x.classList.remove(ffi.text_to_string(name));
    return ffi.nothing;
  });

  ffi.defun("dom.make-css", (css) => {
    const style = document.createElement("style");
    style.textContent = ffi.text_to_string(css);
    return ffi.box(style);
  });

  ffi.defmachine("dom.preload-image", function* (src, fn) {
    const p: Promise<CrochetValue> = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        ffi.run_asynchronously(function* () {
          resolve(ffi.boolean(true));
          return ffi.nothing;
        });
      };
      img.onerror = (error) => {
        ffi.run_asynchronously(function* () {
          resolve(ffi.boolean(false));
          return ffi.nothing;
        });
      };
      img.src = ffi.text_to_string(src);
    });
    return yield ffi.await(p);
  });

  ffi.defun("dom.alert", (msg) => {
    alert(ffi.text_to_string(msg));
    return ffi.nothing;
  });

  ffi.defun("dom.now", () => {
    return ffi.integer(BigInt(new Date().getTime()));
  });

  ffi.defun("dom.is-html-element", (x0) => {
    try {
      const x = ffi.unbox_typed(HTMLElement, x0);
      document.createNodeIterator(x);
      return ffi.boolean(true);
    } catch (e) {
      return ffi.boolean(false);
    }
  });

  ffi.defun("dom.auto-resize-text-area", (node0) => {
    const node = ffi.unbox_typed(HTMLTextAreaElement, node0);

    node.addEventListener("input", () => {
      node.style.height = "";
      node.style.height = `${node.scrollHeight}px`;
    });

    return ffi.nothing;
  });
};
