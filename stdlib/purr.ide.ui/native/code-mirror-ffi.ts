import type { ForeignInterface, CrochetValue } from "../../../build/crochet";
import type { make_editor, EditorShell } from "../npm-native/code-mirror";

declare var CodeMirror: {
  make_editor: typeof make_editor;
  EditorShell: typeof EditorShell;
};

export default (ffi: ForeignInterface) => {
  const { make_editor, EditorShell } = CodeMirror;

  ffi.defun("code-mirror.make-editor", (node0, options0) => {
    const node = ffi.unbox_typed(HTMLElement, node0);
    const options = ffi.record_to_map(options0);
    const mode = options.has("mode")
      ? ffi.text_to_string(options.get("mode")!)
      : "crochet";
    const value = options.has("value")
      ? ffi.text_to_string(options.get("value")!)
      : "";
    const editor: EditorShell = make_editor({ mode, value });
    setTimeout(() => {
      editor.render(node);
    });
    return ffi.box(editor);
  });

  ffi.defmachine("code-mirror.watch-value", function* (cm0, fn) {
    const cm = ffi.unbox_typed(EditorShell, cm0);
    let timer: any = null;
    yield ffi.await(
      ffi.run_asynchronously(function* () {
        yield ffi.apply(fn, [
          ffi.untrusted_text(cm.view?.state.doc.toString() ?? ""),
        ]);
        return ffi.nothing;
      })
    );
    cm.on_update((x) => {
      if (x.docChanged) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          ffi.run_asynchronously(function* () {
            yield ffi.apply(fn, [ffi.untrusted_text(x.state.doc.toString())]);
            return ffi.nothing;
          });
        }, 250);
      }
    });
    return ffi.nothing;
  });

  // function get_editor(x: CrochetValue) {
  //   return ffi.unbox_typed(CodeMirror, x) as CM.Editor;
  // }
  // ffi.defun("code-mirror.render", (node0, options0) => {
  //   const node = ffi.unbox_typed(HTMLElement, node0);
  //   const options1 = ffi.record_to_map(options0);
  //   const keymap0 = ffi
  //     .list_to_array(options1.get("key-map") ?? ffi.list([]))
  //     .map((x) => ffi.list_to_array(x))
  //     .map(([k, v]) => [
  //       ffi.text_to_string(k),
  //       () => {
  //         ffi.run_asynchronously(function* () {
  //           yield ffi.apply(v, []);
  //           return ffi.nothing;
  //         });
  //       },
  //     ]);
  //   const options = {
  //     mode: ffi.text_to_string(options1.get("mode")!),
  //     value: ffi.text_to_string(options1.get("value")!),
  //     readOnly: ffi.to_plain_native(options1.get("read-only")!) as any,
  //     lineNumbers: ffi.to_js_boolean(options1.get("line-numbers")!),
  //     lineWrapping: ffi.to_js_boolean(options1.get("line-wrapping")!),
  //     viewportMargin: ffi.float_to_number(options1.get("viewport-margin")!),
  //     extraKeys: Object.fromEntries(keymap0),
  //   };
  //   const cm = CodeMirror(node, options);
  //   return ffi.box(cm);
  // });
  // ffi.defun("code-mirror.on", (cm, ev, fn) => {
  //   get_editor(cm).on(ffi.text_to_string(ev) as any, (ev: any) => {
  //     ffi.run_asynchronously(function* () {
  //       yield ffi.apply(fn, [ffi.box(ev)]);
  //       return ffi.nothing;
  //     });
  //   });
  //   return ffi.nothing;
  // });
  // ffi.defun("code-mirror.set", (cm, key, val) => {
  //   get_editor(cm).setOption(
  //     ffi.text_to_string(key) as any,
  //     ffi.to_plain_native(val)
  //   );
  //   return ffi.nothing;
  // });
  // ffi.defun("code-mirror.get-value", (cm) => {
  //   return ffi.text(get_editor(cm).getValue() ?? "");
  // });
  // ffi.defun("code-mirror.set-value", (cm, val) => {
  //   get_editor(cm).setValue(ffi.text_to_string(val));
  //   return ffi.nothing;
  // });
  // ffi.defun("code-mirror.refresh", (cm) => {
  //   setTimeout(() => {
  //     get_editor(cm).refresh();
  //   });
  //   return ffi.nothing;
  // });
  // ffi.defun("code-mirror.value-from-node", (node) => {
  //   const el = ffi.unbox_typed(HTMLElement, node);
  //   if (el.children.length !== 1) {
  //     throw ffi.panic("invalid-node", `Expected a code-editor widget node`);
  //   }
  //   const cm: CM.Editor | null = (el.children[0] as any).CodeMirror;
  //   if (cm == null) {
  //     throw ffi.panic("invalid-node", `Expected a code-editor widget node`);
  //   }
  //   return ffi.text(cm.getDoc().getValue());
  // });
};
