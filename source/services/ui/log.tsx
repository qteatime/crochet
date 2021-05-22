import * as React from "react";
import * as ReactDOM from "react-dom";
import { IElement } from "./basic";

type ILog = IElement & {
  items: React.ReactNode[];
};

export class Log extends React.Component<ILog> {
  readonly log = React.createRef<HTMLDivElement>();
  readonly entries: React.ReactNode[];

  constructor(props: ILog) {
    super(props);
    this.entries = props.items;
  }

  render() {
    return (
      <div className="log" ref={this.log}>
        {this.props.items}
      </div>
    );
  }

  append(x: React.ReactNode) {
    this.entries.push(x);
    const root = document.createElement("div");
    root.className = "crochet-ui--log-dynamic-entry";
    ReactDOM.render(<React.Fragment>{x}</React.Fragment>, root);
    this.log.current?.appendChild(root);
  }
}
