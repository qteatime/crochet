import type { ForeignInterface, CrochetValue } from "../../../../build/crochet";
import type * as Monaco from "monaco-editor";

declare var monaco: typeof Monaco;

export default (ffi: ForeignInterface) => {
  monaco.languages.register({ id: "crochet" });
  monaco.editor.defineTheme("purr", {
    base: "vs",
    inherit: true,
    rules: [
      {
        token: "keyword",
        foreground: "2f2f2f",
        fontStyle: "bold",
      },
      {
        token: "comment",
        foreground: "757575",
        fontStyle: "italic",
      },
      {
        token: "string",
        foreground: "388E3C",
      },
      {
        token: "constant.numeric",
        foreground: "0288D1",
      },
      {
        token: "variable",
        foreground: "EC407A",
      },
      {
        token: "entity.name.function",
        foreground: "0288D1",
        fontStyle: "bold",
      },
      {
        token: "punctuation",
        foreground: "607D8B",
      },
    ],
  } as any);
  monaco.languages.setMonarchTokensProvider("crochet", {
    defaultToken: "invalid",

    keywords: [
      "relation",
      "predicate",
      "when",
      "do",
      "command",
      "action",
      "type",
      "enum",
      "define",
      "singleton",
      "goto",
      "call",
      "let",
      "return",
      "fact",
      "forget",
      "new",
      "search",
      "if",
      "simulate",
      "true",
      "false",
      "not",
      "and",
      "or",
      "is",
      "self",
      "as",
      "event",
      "quiescence",
      "for",
      "until",
      "in",
      "foreign",
      "on",
      "always",
      "match",
      "then",
      "else",
      "condition",
      "end",
      "with",
      "prelude",
      "rank",
      "tags",
      "abstract",
      "lazy",
      "force",
      "context",
      "sample",
      "of",
      "open",
      "local",
      "test",
      "assert",
      "requires",
      "ensures",
      "handle",
      "effect",
      "continue",
      "perform",
      "has",
      "trait",
      "implement",
      "public",
      "capability",
      "protect",
      "global",
      "otherwise",
      "true",
      "false",
      "nothing",
    ],

    tokenizer: {
      root: [
        [/^%[ \t]*crochet/, "comment.line.heading.crochet"],
        { include: "common" },
      ],

      common: [
        [/(?<![a-zA-Z0-9\-])[A-Z][a-zA-Z0-9\-]*|_/, "variable.name.crochet"],
        [
          /(?<![a-zA-Z0-9\-])([a-z\-][a-zA-Z0-9\-]*:)/,
          "entity.name.function.crochet",
        ],
        [
          /(?<![a-zA-Z0-9\-\.\^])([a-zA-Z\-]+)/,
          {
            cases: {
              "@keywords": "keyword.control.crochet",
              "@default": "identifier.language.crochet",
            },
          },
        ],
        [/\/\/.*/, "comment.line"],
        [/[\(\)\[\]\{\};,]/, "delimiter"],
        [/[\+\*\=\-\%\/\|<>#':\.]/, "operator"],
        [
          /(?<![a-zA-Z0-9\-])[\-\+]?[0-9][0-9_]*/,
          "constant.numeric.integer.crochet",
        ],
        [
          /(?<![a-zA-Z0-9\-])[\-\+]?[0-9][0-9_]*(\.[0-9][0-9_]*)?([eE][\-\+]?[0-9][0-9_]*)?/,
          "constant.numeric.decimal.crochet",
        ],
        [/"/, "string.double", "@string_double"],
      ],

      string_double: [
        [/[^\\"\[]+/, "string"],
        [/\[/, "meta.string.interpolation", "@string_interpolation"],
        [/\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)/, "string.escape"],
        [/\\./, "string.escape.invalid"],
        [/"/, "string", "@popall"],
      ],

      string_interpolation: [
        [/\]/, "meta.string.interpolation", "@string_double"],
        { include: "common" },
      ],
    },
  });

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

  ffi.defun("dom.append-sibling", (root0, node0) => {
    const root = get_element(root0);
    const node = get_node(node0);
    root.parentElement!.appendChild(node);
    return ffi.nothing;
  });

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

  ffi.defun("dom.log", (msg) => {
    console.log(ffi.to_debug_string(msg), msg);
    return ffi.nothing;
  });

  ffi.defun("dom.append", (box, node) => {
    get_node(box).appendChild(get_node(node));
    return ffi.nothing;
  });

  ffi.defun("dom.prepend", (box0, node) => {
    const box = get_node(box0);
    if (box.firstChild) {
      box.insertBefore(get_node(node), box.firstChild);
    } else {
      box.appendChild(get_node(node));
    }
    return ffi.nothing;
  });

  ffi.defmachine("dom.defer", function* (block0) {
    const block = yield ffi.make_closure(0, function* () {
      return yield ffi.apply(block0, []);
    });
    setTimeout(async () => {
      ffi.run_asynchronously(function* () {
        yield ffi.apply(block, []);
        return ffi.nothing;
      });
    });
    return ffi.nothing;
  });

  ffi.defmachine("dom.code-editor", function* (readonly0, code0, on_commit0) {
    const on_commit = yield ffi.make_closure(0, function* () {
      return yield ffi.apply(on_commit0, []);
    });
    const readonly = ffi.to_js_boolean(readonly0);
    const code = ffi.text_to_string(code0);
    const MIN_HEIGHT = 120;

    const container = document.createElement("div");
    container.className = "agata-code-editor-container";
    const editor = monaco.editor.create(container, {
      value: code,
      readOnly: readonly,
      detectIndentation: false,
      language: "crochet",
      theme: "purr",
      minimap: {
        enabled: false,
      },
      padding: {
        top: 10,
        bottom: 10,
      },
      scrollbar: {
        horizontal: "hidden",
        vertical: "hidden",
        verticalScrollbarSize: 0,
        handleMouseWheel: false,
      },
      fontSize: 16,
      fontFamily: "Source Code Pro",
      scrollBeyondLastLine: false,
      tabSize: 2,
      wordWrap: "on",
      wrappingStrategy: "advanced",
    });

    editor.onDidContentSizeChange((event) => {
      const contentHeight = Math.max(MIN_HEIGHT, editor.getContentHeight());
      container.style.height = `${contentHeight}px`;
      editor.layout({
        height: contentHeight,
        width: container.clientWidth - 2,
      });
    });

    window.addEventListener("resize", (event) => {
      const contentHeight = Math.max(MIN_HEIGHT, editor.getContentHeight());
      editor.layout({
        height: contentHeight,
        width: 1,
      });
      editor.layout({
        height: contentHeight,
        width: container.clientWidth - 2,
      });
    });

    editor.addAction({
      id: "purr.actions.run",
      label: "Run",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: (_) => {
        ffi.run_asynchronously(function* () {
          yield ffi.apply(on_commit, []);
          return ffi.nothing;
        });
      },
    });

    return ffi.record(
      new Map([
        ["node", ffi.box(container)],
        ["monaco", ffi.box(editor)],
      ])
    );
  });

  ffi.defun("dom.get-code-editor-value", (box) => {
    const node = ffi.unbox(box) as Monaco.editor.IStandaloneCodeEditor;
    const value = node.getModel()!.getValue();
    return ffi.text(value);
  });

  ffi.defun("dom.get-input-value", (box) => {
    const node = get_element(box) as HTMLInputElement;
    return ffi.text(node.value);
  });

  ffi.defun("dom.fragment", (children) => {
    const fragment = document.createDocumentFragment();
    for (const child of ffi.list_to_array(children)) {
      fragment.appendChild(get_node(child));
    }
    return ffi.box(fragment);
  });

  ffi.defun("dom.setup-focus", (box) => {
    const node = get_element(box);
    function try_focus() {
      if (node.isConnected) {
        node.scrollIntoView();
        node.focus();
      } else {
        setTimeout(try_focus, 100);
      }
    }
    setTimeout(try_focus, 0);
    return ffi.nothing;
  });

  ffi.defun("dom.setup-monaco-focus", (box, monaco) => {
    const node = get_element(box);
    const editor = ffi.unbox(monaco) as Monaco.editor.IStandaloneCodeEditor;
    function try_focus() {
      if (node.isConnected) {
        node.scrollIntoView();
        editor.focus();
      } else {
        setTimeout(try_focus, 100);
      }
    }
    setTimeout(try_focus, 0);
    return ffi.nothing;
  });

  ffi.defun("dom.input", (type0, readonly0, value0, placeholder0) => {
    const type = ffi.text_to_string(type0);
    const readonly = ffi.to_js_boolean(readonly0);
    const value = ffi.text_to_string(value0);
    const placeholder = ffi.text_to_string(placeholder0);

    const node = document.createElement("input");
    node.className = `agata-input agata-input-${type}`;
    node.type = type;
    node.readOnly = readonly;
    node.value = value;
    node.placeholder = placeholder;

    return ffi.box(node);
  });

  ffi.defun("dom.label", (label0, input0) => {
    const label = ffi.text_to_string(label0);
    const input = get_node(input0);
    const node = document.createElement("label");
    node.className = "agata-labelled";
    const clabel = document.createElement("div");
    clabel.className = "agata-label-text";
    clabel.appendChild(document.createTextNode(label));
    node.appendChild(clabel);
    const cinput = document.createElement("div");
    cinput.className = "agata-labelled-input";
    cinput.appendChild(input);
    node.appendChild(cinput);
    return ffi.box(node);
  });

  ffi.defun("dom.modal-container", (klass0) => {
    const klass = ffi.text_to_string(klass0);
    const node = document.createElement("div");
    node.className = klass;
    const container = document.createElement("div");
    container.className = `${klass}-content`;
    node.appendChild(container);
    const label = document.createElement("div");
    label.className = `${klass}-label`;
    node.appendChild(label);
    return ffi.record(
      new Map([
        ["root", ffi.box(node)],
        ["container", ffi.box(container)],
        ["label", ffi.box(label)],
      ])
    );
  });

  ffi.defun("dom.show-modal", (box) => {
    get_element(box).classList.add("agata-modal-visible");
    return ffi.nothing;
  });

  ffi.defun("dom.hide-modal", (box) => {
    get_element(box).classList.remove("agata-modal-visible");
    return ffi.nothing;
  });

  ffi.defun("dom.promise", () => {
    const p: any = {};
    p.promise = new Promise((resolve, reject) => {
      p.resolve = resolve;
      p.reject = reject;
    });
    return ffi.box(p);
  });

  ffi.defun("dom.resolve", (p0, x) => {
    const p = ffi.unbox(p0) as any;
    p.resolve(x);
    return ffi.nothing;
  });

  ffi.defun("dom.reject", (p0, x) => {
    const p = ffi.unbox(p0) as any;
    p.reject(x);
    return ffi.nothing;
  });

  ffi.defmachine("dom.wait", function* (p0) {
    const p = ffi.unbox(p0) as any;
    return yield ffi.await(p.promise);
  });
};
