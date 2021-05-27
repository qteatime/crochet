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
    <i
      className={classes(
        "crochet-ui--icon fas",
        props.style,
        "fa-" + props.icon
      )}
    ></i>
  );
}

export function Style(props: IElement & { theme: string }) {
  return (
    <span className={"crochet-ui--style-" + props.theme}>{props.children}</span>
  );
}

export function Button(
  props: IElement & { enabled?: boolean; onClick?: () => void }
) {
  return (
    <button
      className={classes("crochet-ui--button", props.style)}
      data-enabled={props.enabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export function AddButton(
  props: IElement & { enabled?: boolean; onClick?: () => void }
) {
  return (
    <Button
      style="crochet-ui--button-add"
      enabled={props.enabled}
      onClick={props.onClick}
    >
      <Icon icon="plus" />
    </Button>
  );
}

export function If(props: { test: boolean; children: React.ReactNode }) {
  if (props.test == true) {
    return <React.Fragment>{props.children}</React.Fragment>;
  } else {
    return null;
  }
}
