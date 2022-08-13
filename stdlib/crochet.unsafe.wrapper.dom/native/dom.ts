import type { CrochetValue, ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  // Constructors
  ffi.defun("dom.make-text", (text) => {
    return ffi.box(document.createTextNode(ffi.text_to_string(text)));
  });

  ffi.defun("dom.get-node", (node0) => {
    ffi.unbox_typed(Node, node0);
    return node0;
  });

  ffi.defun("dom.get-element", (element0) => {
    ffi.unbox_typed(HTMLElement, element0);
    return element0;
  });

  ffi.defun("dom.make-element", (tag) => {
    return ffi.box(document.createElement(ffi.text_to_string(tag)));
  });

  ffi.defun("dom.make-fragment", () => {
    return ffi.box(document.createDocumentFragment());
  });

  // Nodes
  ffi.defun("dom.append-node", (to0, node0) => {
    const to = ffi.unbox_typed(Node, to0);
    const node = ffi.unbox_typed(Node, node0);
    to.appendChild(node);
    return ffi.nothing;
  });

  ffi.defun("dom.prepend-node", (to0, node0) => {
    const to = ffi.unbox_typed(Node, to0);
    const node = ffi.unbox_typed(Node, node0);
    const first_child = to.firstChild;
    if (first_child != null) {
      to.insertBefore(first_child, node);
    } else {
      to.appendChild(node);
    }
    return ffi.nothing;
  });

  ffi.defun("dom.remove-contents", (node0) => {
    const node = ffi.unbox_typed(Node, node0);
    for (const child of node.childNodes) {
      node.removeChild(child);
    }
    return ffi.nothing;
  });

  ffi.defun("dom.detach-node", (node0) => {
    const node = ffi.unbox_typed(Node, node0);
    if (node.parentNode != null) {
      node.parentNode.removeChild(node);
    }
    return ffi.nothing;
  });

  // Elements
  ffi.defun("dom.set-attribute", (el0, attr0, value0) => {
    const el = ffi.unbox_typed(HTMLElement, el0);
    const attr = ffi.text_to_string(attr0);
    const value = ffi.text_to_string(value0);
    el.setAttribute(attr, value);
    return ffi.nothing;
  });

  ffi.defun("dom.set-style", (el0, styles0) => {
    const el = ffi.unbox_typed(HTMLElement, el0);
    const styles = ffi.record_to_map(styles0);
    for (const [key, value] of styles.entries()) {
      (el.style as any)[key] = ffi.text_to_string(value);
    }
    return ffi.nothing;
  });

  // Classes
  ffi.defun("dom.add-class", (el0, name) => {
    const el = ffi.unbox_typed(HTMLElement, el0);
    el.classList.add(ffi.text_to_string(name));
    return ffi.nothing;
  });

  ffi.defun("dom.remove-class", (el0, name) => {
    const el = ffi.unbox_typed(HTMLElement, el0);
    el.classList.remove(ffi.text_to_string(name));
    return ffi.nothing;
  });

  ffi.defun("dom.toggle-class", (el0, name) => {
    const el = ffi.unbox_typed(HTMLElement, el0);
    el.classList.toggle(ffi.text_to_string(name));
    return ffi.nothing;
  });

  // Event listeners
  ffi.defun("dom.add-listener", (el0, name0, handler) => {
    const el = ffi.unbox_typed(HTMLElement, el0);
    const name = ffi.text_to_string(name0);
    const fun = function (ev: Event) {
      ffi.run_asynchronously(function* () {
        yield ffi.apply(handler, [ffi.box(ev)]);
        return ffi.nothing;
      });
      // TODO: handle errors here
    };

    el.addEventListener(name, fun);
    return ffi.box(fun);
  });

  ffi.defun("dom.remove-listener", (el0, name0, handler0) => {
    const el = ffi.unbox_typed(HTMLElement, el0);
    const name = ffi.text_to_string(name0);
    const fun = ffi.unbox_typed(Function, handler0);
    el.removeEventListener(name, fun as any);
    return ffi.nothing;
  });
};
