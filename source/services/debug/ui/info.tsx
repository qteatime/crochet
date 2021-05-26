import * as React from "react";
import { IElement, Style } from "./basic";

export function List(props: IElement & { values: React.ReactNode[] }) {
  return (
    <div className="crochet-ui-info-list">
      {props.values.map((x) => {
        return <div className="crochet-ui-info-list-item">{x}</div>;
      })}
    </div>
  );
}
