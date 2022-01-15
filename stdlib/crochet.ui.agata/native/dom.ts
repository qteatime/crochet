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
    const x = unbox_typed(x0, HTMLInputElement);
    return ffi.text(x.value);
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
};
