import * as React from "react";
import { classes } from "./helpers";

export interface IElement {
  style?: string | null | (string | null | undefined)[];
  children?: React.ReactNode;
}

export function Row(props: IElement) {
  return (
    <div className={classes("crochet-ui--row", props.style)}>
      {props.children}
    </div>
  );
}

export function Column(props: IElement) {
  return (
    <div className={classes("crochet-ui--column", props.style)}>
      {props.children}
    </div>
  );
}

export function Grid(props: IElement) {
  return (
    <div className={classes("crochet-ui--grid", props.style)}>
      {props.children}
    </div>
  );
}

export function GridRow(props: IElement) {
  return (
    <div className={classes("crochet-ui--grid-row", props.style)}>
      {props.children}
    </div>
  );
}

export function GridColumn(props: IElement) {
  return (
    <div className={classes("crochet-ui--grid-column", props.style)}>
      {props.children}
    </div>
  );
}

export function Stack(props: IElement) {
  return (
    <div className={classes("crochet-ui--stack", props.style)}>
      {props.children}
    </div>
  );
}

export function Icon(props: IElement & { icon: string }) {
  return (
    <i className={classes("crochet-ui--icon", props.style, props.icon)}></i>
  );
}

export function Style(props: IElement & { theme: string }) {
  return (
    <span className={"crochet-ui--style-" + props.theme}>{props.children}</span>
  );
}
