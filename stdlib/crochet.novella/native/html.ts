import { CrochetValue, ForeignInterface } from "../../../build/crochet";

export default (ffi: ForeignInterface) => {
  const known_tags = ["h1", "h2", "p", "header", "section", "strong", "em"];

  //#region Selections
  const references = new WeakMap<CrochetValue, string>();
  const refered_elements = new WeakMap<
    CrochetValue,
    { value: CrochetValue; element: HTMLElement }[]
  >();

  function make_id() {
    const id = new Uint8Array(16);
    crypto.getRandomValues(id);
    return Array.from(id)
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("");
  }

  function get_reference(value: CrochetValue) {
    const ref = references.get(value);
    if (ref != null) {
      return ref;
    } else {
      const id = make_id();
      references.set(value, id);
      return id;
    }
  }

  function set_reference(
    ref: CrochetValue,
    element: HTMLElement,
    value: CrochetValue
  ) {
    element.setAttribute("data-reference", get_reference(ref));
    const elements = refered_elements.get(ref) ?? [];
    elements.push({ value, element });
    refered_elements.set(ref, elements);
  }

  //#region Utilities
  interface Deferred<T> {
    promise: Promise<T>;
    resolve: (_: T) => void;
    reject: (_: any) => void;
  }

  function defer<T>() {
    const result: Deferred<T> = {
      promise: null!,
      resolve: null!,
      reject: null!,
    };
    result.promise = new Promise((resolve, reject) => {
      result.resolve = resolve;
      result.reject = reject;
    });
    return result;
  }

  function role_to_tag(x: string) {
    if (known_tags.includes(x)) {
      return x;
    } else {
      return "span";
    }
  }

  //#region Measuring
  class Rect {
    constructor(
      readonly left: number,
      readonly top: number,
      readonly width: number,
      readonly height: number
    ) {}

    static from_element_offset(x: HTMLElement) {
      return new Rect(x.offsetLeft, x.offsetTop, x.offsetWidth, x.offsetHeight);
    }

    get bottom() {
      return this.top + this.height;
    }

    get right() {
      return this.left + this.width;
    }
  }

  function measure(canvas: Canvas, x: HTMLElement) {
    const old_visibility = x.style.visibility;
    const old_animation = x.style.animation;
    x.style.visibility = "hidden";
    x.style.animation = "none";
    canvas.root.appendChild(x);
    const dimensions = Rect.from_element_offset(x);
    canvas.root.removeChild(x);
    x.style.animation = old_animation;
    x.style.visibility = old_visibility;

    return dimensions;
  }

  //#region Rendering
  class Canvas {
    public mark: HTMLElement | null = null;

    constructor(readonly root: HTMLElement) {}
  }

  function is_interactive(x: HTMLElement) {
    if (x.getAttribute("data-interactive") === "true") {
      return true;
    }
    for (const child of x.children) {
      if (child instanceof HTMLElement && is_interactive(child)) {
        return true;
      }
    }
    return false;
  }

  async function click_to_continue(canvas: Canvas, mark: HTMLElement | null) {
    const deferred = defer<void>();
    canvas.root.setAttribute("data-wait", "true");

    canvas.root.addEventListener(
      "click",
      (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        canvas.root.removeAttribute("data-wait");

        if (mark != null) {
          canvas.mark = mark;
        } else {
          const children = canvas.root.children;
          canvas.mark =
            (children.item(children.length - 1) as HTMLElement) ?? null;
        }

        deferred.resolve();
      },
      { once: true }
    );

    return deferred.promise;
  }

  async function wait_mark(canvas: Canvas, mark: HTMLElement) {
    if (canvas.mark == null) {
      canvas.mark = mark;
      return;
    }

    const dimensions = measure(canvas, mark);
    if (dimensions.bottom - mark.offsetTop > canvas.root.clientHeight) {
      await click_to_continue(canvas, mark);
    }

    if (is_interactive(mark)) {
      canvas.mark = null;
    }
  }

  function get_canvas(x0: CrochetValue) {
    const x = ffi.unbox(x0);
    if (x instanceof Canvas) {
      return x;
    } else {
      throw ffi.panic("invalid-type", `Expected a canvas`);
    }
  }

  //#region Foreign functions
  ffi.defun("html.empty", () => {
    const element = document.createElement("span");
    element.className = "novella-element novella-empty";
    return ffi.box(element);
  });

  ffi.defun("html.element", (attrs0, children0) => {
    const attrs = ffi.record_to_map(attrs0);
    const children = ffi.tuple_to_array(children0);
    const element = document.createElement("span");
    for (const [k, v] of attrs.entries()) {
      element.setAttribute(k, ffi.text_to_string(v));
    }
    for (const x of children) {
      element.appendChild(ffi.unbox(x) as HTMLElement);
    }
    element.classList.add("novella-element");
    return ffi.box(element);
  });

  ffi.defun("html.text", (x) => {
    const element = document.createElement("span");
    element.appendChild(document.createTextNode(ffi.text_to_string(x)));
    element.className = "novella-text";
    return ffi.box(element);
  });

  ffi.defun("html.role", (role0, child) => {
    const role = ffi.text_to_string(role0);
    const tag = role_to_tag(role);
    const element = document.createElement(tag);
    element.setAttribute("data-role", role);
    element.className = "novella-element";
    element.appendChild(ffi.unbox(child) as HTMLElement);
    return ffi.box(element);
  });

  ffi.defmachine("html.show", function* (canvas0, element0) {
    const canvas = get_canvas(canvas0);
    const element = ffi.unbox(element0) as HTMLElement;

    yield ffi.await(wait_mark(canvas, element).then((_) => ffi.nothing));
    canvas.root.appendChild(element);
    element.scrollIntoView();
    return ffi.nothing;
  });

  ffi.defmachine("html.wait", function* (canvas0) {
    const canvas = get_canvas(canvas0);
    yield ffi.await(click_to_continue(canvas, null).then((_) => ffi.nothing));
    return ffi.nothing;
  });

  ffi.defun("html.make-canvas", (element) => {
    return ffi.box(new Canvas(ffi.unbox(element) as HTMLElement));
  });

  ffi.defun("html.button", (element0, ref, value) => {
    const element = ffi.unbox(element0) as HTMLElement;
    const button = document.createElement("button");
    button.className = "novella-element novella-button";
    button.setAttribute("data-interactive", "true");
    button.appendChild(element);
    set_reference(ref, button, value);
    return ffi.box(button);
  });

  ffi.defmachine("html.wait-selection", function* (ref) {
    const deferred = defer<CrochetValue>();
    const elements = refered_elements.get(ref);
    if (elements == null) {
      throw ffi.panic(
        "no-refered-elements",
        `The reference ${ffi.to_debug_string(
          ref
        )} does not have any associated novella elements.`
      );
    }

    let listeners: {
      element: HTMLElement;
      listener: (_: MouseEvent) => void;
    }[] = [];
    for (const { value, element } of elements) {
      const listener = (ev: MouseEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
        for (const x of elements) {
          if (x.element !== element) {
            x.element.setAttribute("data-selected", "false");
          }
        }
        for (const { element, listener } of listeners) {
          element.removeEventListener("click", listener);
        }
        element.setAttribute("data-selected", "true");
        deferred.resolve(value);
      };
      listeners.push({ element, listener });
      element.addEventListener("click", listener, { once: true });
    }

    const result = yield ffi.await(deferred.promise);
    return result;
  });
};
