import { EditorView as View, basicSetup } from "codemirror";
import { EditorView, ViewUpdate } from "@codemirror/view";
import { Compartment, EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { xml } from "@codemirror/lang-xml";
import { html } from "@codemirror/lang-html";
import { markdown } from "@codemirror/lang-markdown";
import { ValuePattern } from "../../../build/vm/logic/unification";

const langConf = new Compartment();

export type Options = {
  mode: string;
  value: string;
};

const mode_map = new Map(
  Object.entries({
    javascript: javascript(),
    css: css(),
    json: json(),
    xml: xml(),
    html: html(),
    markdown: markdown(),
  })
);

export class EditorShell {
  public view: EditorView | null = null;
  private subscribers: ((update: ViewUpdate) => null)[] = [];

  constructor(readonly options: Options) {}

  render(node: HTMLElement) {
    if (this.view != null) {
      throw new Error(`internal: render() called twice`);
    }

    const mode = mode_map.get(this.options.mode) ?? javascript();
    const state = EditorState.create({
      extensions: [
        basicSetup,
        langConf.of(mode),
        EditorView.updateListener.of((x) => this.notify_update(x)),
      ],
    });

    this.view = new View({
      doc: this.options.value,
      state: state,
      parent: node,
    });
  }

  set_mode(mode_name: string) {
    const mode = mode_map.get(mode_name) ?? javascript();
    this.run((view) => {
      view.dispatch({
        effects: langConf.reconfigure(mode),
      });
    });
  }

  get_value() {
    return this.view!.state.doc.toString();
  }

  set_value(value: string) {
    this.run((view) => {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: value,
        },
      });
    });
  }

  private run(f: (view: EditorView) => any) {
    if (this.view != null) {
      f(this.view);
    } else {
      setTimeout(() => this.run(f), 100);
    }
  }

  notify_update(x: ViewUpdate) {
    for (const f of this.subscribers) {
      f(x);
    }
  }

  on_update(f: (state: ViewUpdate) => any) {
    this.subscribers.push(f);
  }
}

export function make_editor(options: Options) {
  return new EditorShell(options);
}
