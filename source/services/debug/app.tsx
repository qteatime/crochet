import type { Transcript } from "../transcript";
import { TranscriptUI } from "../transcript/ui";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Foldable } from "../ui/folds";
import { TabBar, Tabs } from "../ui/tabs";
import { PlaygroundUI } from "../playground/ui";
import { CrochetForBrowser } from "../../targets/browser";
import { CrochetModule } from "../../vm";

export class DebugUI {
  render(crochet: CrochetForBrowser, root: HTMLElement) {
    const pkg = crochet.root;
    const cpkg = crochet.system.universe.world.packages.get(pkg.meta.name)!;
    const module = new CrochetModule(cpkg, "(playground)", null);

    ReactDOM.render(
      <DebugUIApp
        transcript={<TranscriptUI transcript={crochet.transcript} />}
        playground={<PlaygroundUI crochet={crochet.system} module={module} />}
      ></DebugUIApp>,
      root
    );
  }
}

type IDebugUI = {
  transcript: React.ReactNode;
  playground: React.ReactNode;
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
              {
                key: "playground",
                tab: "Playground",
                content: this.props.playground,
              },
            ]}
          />
        </Foldable>
      </div>
    );
  }
}
