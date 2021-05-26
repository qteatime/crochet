import { Transcript } from "../transcript";
import { TranscriptUI } from "./transcript";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Foldable } from "./ui/folds";
import { TabBar, Tabs } from "./ui/tabs";
import { PlaygroundUI } from "./playground";
import { CrochetForBrowser } from "../../targets/browser";
import { CrochetModule } from "../../vm";
import { Tracing } from "./tracing";
import { BootedCrochet } from "../../crochet";

export class DebugUI {
  render(crochet: CrochetForBrowser, root: HTMLElement) {
    const pkg = crochet.root;
    const cpkg = crochet.system.universe.world.packages.get(pkg.meta.name)!;
    const module = new CrochetModule(cpkg, "(playground)", null);
    const transcript = new Transcript(crochet.system.universe.trace);
    const repl = {
      system: crochet,
      module: module,
    };

    ReactDOM.render(
      <DebugUIApp transcript={transcript} repl={repl}></DebugUIApp>,
      root
    );
  }
}

type IDebugUI = {
  transcript: Transcript;
  repl: {
    system: CrochetForBrowser;
    module: CrochetModule;
  };
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
                content: <TranscriptUI transcript={this.props.transcript} />,
              },
              {
                key: "playground",
                tab: "Playground",
                content: (
                  <PlaygroundUI
                    crochet={this.props.repl.system.system}
                    module={this.props.repl.module}
                  />
                ),
              },
              {
                key: "tracing",
                tab: "Tracing",
                content: <Tracing transcript={this.props.transcript} />,
              },
            ]}
          />
        </Foldable>
      </div>
    );
  }
}
