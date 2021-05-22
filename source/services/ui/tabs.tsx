import * as React from "react";
import { IElement } from "./basic";
import { classes } from "./helpers";

type ITabBar = IElement & {
  tabs: [any, React.ReactNode][];
  onSelectionChanged?: (key: any) => void;
  selected?: any;
};

export class TabBar extends React.Component<ITabBar, { selected: any }> {
  constructor(props: ITabBar) {
    super(props);
    this.state = { selected: props.selected };
  }

  render() {
    return (
      <div className={classes("crochet-ui--tab-bar", this.props.style)}>
        {this.props.tabs.map((x) => this.renderTab(x))}
      </div>
    );
  }

  renderTab([key, tab]: [any, React.ReactNode]) {
    return (
      <div
        className="crochet-ui--tab-bar-button"
        data-selected={this.state.selected === key}
        onClick={() => this.select(key)}
      >
        {tab}
      </div>
    );
  }

  select(key: any) {
    this.setState({ selected: key });
    this.props.onSelectionChanged?.(key);
  }
}

export function TabView(
  props: IElement & { selected: any; tabs: [any, React.ReactNode][] }
) {
  const result = props.tabs.find(([k, _]) => k === props.selected);
  if (result == null) {
    return null;
  } else {
    const [_, content] = result;
    return (
      <div className={classes("crochet-ui--tab-view", props.style)}>
        {content}
      </div>
    );
  }
}

type ITabs = IElement & {
  tabs: { key: any; tab: React.ReactNode; content: React.ReactNode }[];
  selected?: any;
};
export class Tabs extends React.Component<ITabs, { selected: any }> {
  constructor(props: ITabs) {
    super(props);
    this.state = { selected: props.selected };
  }

  render() {
    return (
      <div className={classes("crochet-ui--tabs", this.props.style)}>
        <TabBar
          selected={this.state.selected}
          onSelectionChanged={this.selectionChanged}
          tabs={this.props.tabs.map(
            (x) => [x.key, x.tab] as [any, React.ReactNode]
          )}
        />
        <TabView
          selected={this.state.selected}
          tabs={this.props.tabs.map(
            (x) => [x.key, x.content] as [any, React.ReactNode]
          )}
        />
      </div>
    );
  }

  selectionChanged = (x: any) => {
    this.setState({ selected: x });
  };
}
