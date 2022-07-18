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
};
