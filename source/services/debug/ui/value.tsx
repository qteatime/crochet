import { CrochetValue, Environment, Environments } from "../../../vm";
import * as React from "react";
import { Tabs } from "./tabs";
import { text_unsafe, html } from "../representation";
import { IElement } from "./basic";
import {
  List,
  ListItem,
  Proplist,
  ProplistField,
  ProplistItem,
  ProplistValue,
} from "./info";
import { Foldable } from "./folds";

export function Value(props: IElement & { value: CrochetValue }) {
  return (
    <Tabs
      tabs={[
        {
          key: "structure",
          tab: "Structure",
          content: (
            <div className="crochet-debug--transcript-message-value">
              {html.render_value(props.value)}
            </div>
          ),
        },
        {
          key: "plain-text",
          tab: "Plain Text",
          content: (
            <div className="crochet-debug--transcript-message-text">
              {text_unsafe.render_value(props.value)}
            </div>
          ),
        },
      ]}
    />
  );
}

export function ValueS(props: IElement & { value: CrochetValue }) {
  return <React.Fragment>{html.render_value(props.value)}</React.Fragment>;
}

export function ListV(props: IElement & { values: React.ReactNode[] }) {
  return (
    <List>
      {props.values.map((x) => (
        <ListItem>{x}</ListItem>
      ))}
    </List>
  );
}

export function LongListV(
  props: IElement & { values: React.ReactNode[]; maxItems?: number }
) {
  const max = props.maxItems ?? 5;
  if (props.values.length < max) {
    return <ListV values={props.values} />;
  }

  const always = props.values.slice(0, max);
  const folded = props.values.slice(max);

  return (
    <List>
      {always.map((x) => (
        <ListItem>{x}</ListItem>
      ))}
      <Foldable>
        {folded.map((x) => (
          <ListItem>{x}</ListItem>
        ))}
      </Foldable>
    </List>
  );
}

export function MapV(
  props: IElement & { pairs: [React.ReactNode, React.ReactNode][] }
) {
  return (
    <Proplist>
      {props.pairs.map(([k, v]) => {
        return (
          <ProplistItem>
            <ProplistField>{k}</ProplistField>
            <ProplistValue>{v}</ProplistValue>
          </ProplistItem>
        );
      })}
    </Proplist>
  );
}

export function EnvV(props: IElement & { env: Environment }) {
  const bound = [...Environments.bound_values_up_to(null, props.env)];
  return <MapV pairs={bound.map(([k, v]) => [k, <ValueS value={v} />])} />;
}
