import * as React from "react";
import { IElement, Style } from "./basic";

export function List(props: IElement) {
  return <div className="crochet-ui-info-list">{props.children}</div>;
}

export function ListItem(props: IElement) {
  return <div className="crochet-ui-info-list-item">{props.children}</div>;
}

export function Heading(props: IElement) {
  return <div className="crochet-ui-info-heading">{props.children}</div>;
}

export function Proplist(props: IElement) {
  return <div className="crochet-ui-info-proplist">{props.children}</div>;
}

export function ProplistItem(props: IElement) {
  return <div className="crochet-ui-info-proplist-item">{props.children}</div>;
}

export function ProplistField(props: IElement) {
  return <div className="crochet-ui-info-proplist-field">{props.children}</div>;
}

export function ProplistValue(props: IElement) {
  return <div className="crochet-ui-info-proplist-value">{props.children}</div>;
}
