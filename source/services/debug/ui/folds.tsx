import { IElement } from "./basic";
import * as React from "react";
import { classes } from "./helpers";

type IFoldable = IElement & {
  folded?: boolean;
  closeButton?: React.ReactNode;
  openButton?: React.ReactNode;
};

export class Foldable extends React.Component<IFoldable, { folded: boolean }> {
  constructor(props: IFoldable) {
    super(props);
    this.state = { folded: props.folded ?? true };
  }

  toggleFold = () => {
    this.setState({ folded: !this.state.folded });
  };

  render() {
    return (
      <div
        className={classes("crochet-ui--foldable", this.props.style)}
        data-folded={String(this.state.folded)}
      >
        {this.props.children}
        <div
          className={classes("crochet-ui--foldable-button")}
          onClick={this.toggleFold}
        >
          {this.state.folded ? this.props.openButton : this.props.openButton}
        </div>
      </div>
    );
  }
}

export function MaybeFoldable(props: IElement & { foldWhen: boolean }) {
  if (props.foldWhen) {
    return <Foldable>{props.children}</Foldable>;
  } else {
    return <React.Fragment>{props.children}</React.Fragment>;
  }
}
