import type { Transcript } from "../transcript";
import { TranscriptUI } from "../transcript/ui";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Foldable } from "../ui/folds";
import { TabBar, Tabs } from "../ui/tabs";

export class DebugUI {
  readonly transcript_ui: React.ReactNode;

  constructor(readonly transcript: Transcript) {
    this.transcript_ui = <TranscriptUI transcript={transcript} />;
  }

  render(root: HTMLElement) {
    ReactDOM.render(
      <DebugUIApp transcript={this.transcript_ui}></DebugUIApp>,
      root
    );
  }
}

type IDebugUI = {
  transcript: React.ReactNode;
};

export class DebugUIApp extends React.Component<IDebugUI> {
  constructor(props: IDebugUI) {
    super(props);
  }

  render() {
    return (
      <div id="crochet-debug-ui">
        <Foldable>
          <Tabs
            style="crochet-debug-ui--main-tabs"
            selected="transcript"
            tabs={[
              {
                key: "transcript",
                tab: "Transcript",
                content: this.props.transcript,
              },
            ]}
          />
        </Foldable>
      </div>
    );
  }
}
