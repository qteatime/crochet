import { EditorView as View, basicSetup } from "codemirror";
import type { EditorView } from "@codemirror/view";
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

  constructor(private initial_value: string, readonly state: EditorState) {}

  render(node: HTMLElement) {
    if (this.view != null) {
      throw new Error(`internal: render() called twice`);
    }

    this.view = new View({
      doc: this.initial_value,
      state: this.state,
      parent: node,
    });
  }

  set_mode(mode_name: string) {
    const mode = mode_map.get(mode_name) ?? javascript();
    this.view!.dispatch({
      effects: langConf.reconfigure(mode),
    });
  }

  get_value() {
    return this.state.doc.toString();
  }

  set_value(value: string) {
    if (this.view == null) {
      this.initial_value = value;
    } else {
      this.view!.dispatch({
        changes: {
          from: 0,
          to: this.state.doc.length,
          insert: value,
        },
      });
    }
  }
}

export function make_editor(options: Options) {
  const mode = mode_map.get(options.mode) ?? javascript();
  const state = EditorState.create({
    extensions: [basicSetup, langConf.of(mode)],
  });

  return new EditorShell(options.value, state);
}
