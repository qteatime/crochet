import * as React from "react";
import { TraceTag } from "../../vm";
import { Transcript } from "../transcript";
import { Column, Row } from "./ui/basic";

interface Props {
  transcript: Transcript;
}

interface State {
  items: {
    title: string;
    value: TraceTag;
    checked: boolean;
  }[];
}

export class Tracing extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { items: this.make_items() };
  }

  make_items() {
    return [
      {
        title: "Logging messages",
        value: TraceTag.LOG,
        checked: true,
      },
      {
        title: "Inserting facts",
        value: TraceTag.FACT,
        checked: false,
      },
      {
        title: "Forgetting facts",
        value: TraceTag.FORGET,
        checked: false,
      },
      {
        title: "Simulation action execution",
        value: TraceTag.SIMULATION_ACTION,
        checked: false,
      },
      {
        title: "Simulation event execution",
        value: TraceTag.SIMULATION_EVENT,
        checked: false,
      },
      {
        title: "Simulation action choice",
        value: TraceTag.SIMULATION_ACTION_CHOICE,
        checked: false,
      },
    ];
  }

  render() {
    return (
      <Column style="crochet-debug--tracing">
        {this.state.items.map((x, i) => this.render_item(x, i))}
      </Column>
    );
  }

  render_item(x: State["items"][0], i: number) {
    return (
      <Row style="crochet-debug--tracing-item">
        <label>
          <input
            type="checkbox"
            checked={x.checked}
            onChange={() => this.on_changed(x, i)}
          />
          {x.title}
        </label>
      </Row>
    );
  }

  on_changed(x: State["items"][0], i: number) {
    const items = this.state.items.slice();
    x.checked = !x.checked;
    this.props.transcript.set_filter(this.make_filter(items));

    this.setState({ items: items });
  }

  make_filter(xs: State["items"]) {
    return Object.fromEntries(xs.map((x) => [x.value, x.checked]));
  }
}
