import { CrochetValue } from "../../vm";
import * as React from "react";
import { Tabs } from "./tabs";
import { text_unsafe, html } from "../representation";
import { IElement } from "./basic";

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
