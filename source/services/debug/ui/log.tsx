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
      <div className="crochet-ui--log" ref={this.log}>
        {this.props.items.map((x) => (
          <div className="crochet-ui--log-entry">{x}</div>
        ))}
      </div>
    );
  }

  append(x: React.ReactNode) {
    this.entries.push(x);
    const root = document.createElement("div");
    root.className = "crochet-ui--log-entry crochet-ui--log-dynamic-entry";
    ReactDOM.render(<React.Fragment>{x}</React.Fragment>, root);
    this.log.current?.appendChild(root);
    root.scrollIntoView();
  }
}
