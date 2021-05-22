import { CrochetValue } from "../../vm";
import { unreachable } from "../../utils/utils";
import { Repr, ReprTag } from "./ast";
import { value_to_repr } from "./value";
import * as React from "react";
import { Column, Grid, GridColumn, GridRow, Style } from "../ui/basic";
import { Foldable, MaybeFoldable } from "../ui/folds";

export class HTMLRenderer {
  render(x: Repr): React.ReactNode {
    switch (x.tag) {
      case ReprTag.TEXT:
        return <Style theme="repr-text">{x.value}</Style>;

      case ReprTag.NUMBER:
        return <Style theme="repr-number">{x.value.toLocaleString()}</Style>;

      case ReprTag.KEYWORD:
        return <Style theme="repr-keyword">{x.name}</Style>;

      case ReprTag.LIST:
        return (
          <Style theme="repr-list">
            <MaybeFoldable foldWhen={x.items.length > 5}>
              <Column>{x.items.map((a) => this.render(a))}</Column>
            </MaybeFoldable>
          </Style>
        );

      case ReprTag.MAP:
        return (
          <Style theme="repr-map">
            <MaybeFoldable foldWhen={x.items.length > 5}>
              <Grid style="crochet-ui-repr--map">
                {x.items.map(([k, v]) => {
                  return (
                    <GridRow>
                      <GridColumn>{this.render(k)}</GridColumn>
                      <GridColumn>{this.render(v)}</GridColumn>
                    </GridRow>
                  );
                })}
              </Grid>
            </MaybeFoldable>
          </Style>
        );

      case ReprTag.INTERPOLATION:
        return (
          <Style theme="repr-interpolation">
            {x.parts.map((a) => this.render(a))}
          </Style>
        );

      case ReprTag.STATIC_TEXT:
        return <Style theme="repr-static-text">{x.text}</Style>;

      case ReprTag.FLOW:
        return (
          <Style theme="repr-flow">{x.items.map((a) => this.render(a))}</Style>
        );

      case ReprTag.BLOCK:
        return <Style theme="repr-block">{this.render(x.child)}</Style>;

      case ReprTag.STACK:
        return (
          <Style theme="repr-stack">{x.items.map((a) => this.render(a))}</Style>
        );

      case ReprTag.CIRCULAR:
        // FIXME: allow clicking to expand
        return <Style theme="repr-circular">(circular)</Style>;

      case ReprTag.TYPED:
        return (
          <Style theme="repr-typed">
            <Style theme="repr-typed-tag">{this.render(x.type)}</Style>
            <Style theme="repr-typed-value">{this.render(x.value)}</Style>
          </Style>
        );

      case ReprTag.TAGGED:
        return (
          <Style theme="repr-tagged">
            <Style theme="repr-tagged-tag">{x.tag_name}</Style>
            <Style theme="repr-tagged-value">{this.render(x.value)}</Style>
          </Style>
        );

      case ReprTag.SPACE:
        return " ";

      case ReprTag.SECRET:
        return (
          <Style theme="repr-secret">
            <Foldable>{this.render(x.value)}</Foldable>
          </Style>
        );

      default:
        throw unreachable(x, "Value");
    }
  }

  render_value(x: CrochetValue) {
    return this.render(value_to_repr(x, new Set()));
  }
}

export const html = new HTMLRenderer();
