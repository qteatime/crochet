import type { ForeignInterface, CrochetValue } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  function get_element(x0: CrochetValue): HTMLElement {
    const x = ffi.unbox(x0);
    if (x instanceof HTMLElement) {
      return x;
    } else {
      throw ffi.panic("invalid-type", "Expected an HTMLElement");
    }
  }

  ffi.defun("dom.make-element", (tag) => {
    const element = document.createElement(ffi.text_to_string(tag));
    return ffi.box(element);
  });

  ffi.defun("dom.set-attribute", (element0, name, value) => {
    const element = get_element(element0);
    element.setAttribute(ffi.text_to_string(name), ffi.text_to_string(value));
    return ffi.box(element);
  });

  ffi.defun("dom.append", (element, child) => {
    get_element(element).append(get_element(child));
    return element;
  });

  ffi.defun("dom.make-text", (text) => {
    const element = document.createElement("span");
    element.className = "agata-text";
    element.appendChild(document.createTextNode(ffi.text_to_string(text)));
    return ffi.box(element);
  });
};
