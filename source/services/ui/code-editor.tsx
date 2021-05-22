import * as React from "react";
import { IElement } from "./basic";

type Props = IElement & {
  code?: string;
  onChanged?: (code: string) => void;
};

export class CodeEditor extends React.Component<Props> {
  readonly editor = React.createRef<HTMLTextAreaElement>();

  constructor(props: Props) {
    super(props);
  }

  get code() {
    return this.editor.current!.value;
  }

  render() {
    return (
      <div className="crochet-ui--code-editor">
        <textarea
          ref={this.editor}
          onChange={this.notifyChanged}
          onKeyUp={this.notifyChanged}
          defaultValue={this.props.code}
        ></textarea>
      </div>
    );
  }

  notifyChanged = () => {
    if (!this.editor.current) {
      return;
    }

    this.props.onChanged?.(this.editor.current.value);
  };
}
