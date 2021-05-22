import { CrochetValue, Location, StackTrace } from "../../vm";
import { Repr, TerminalRenderer, value_to_repr } from "../representation";
import { html } from "../representation/html-renderer";
import { Entry, Transcript } from "./transcript";
import * as React from "react";
import { Log } from "../ui/log";
import { Column, Row } from "../ui/basic";
import { Tabs } from "../ui/tabs";

type ITranscriptUI = {
  transcript: Transcript;
};

type ITranscriptState = {};

export class TranscriptUI extends React.Component<
  ITranscriptUI,
  ITranscriptState
> {
  readonly entries: Entry[] = [];
  readonly log = React.createRef<Log>();
  readonly text_renderer = new TerminalRenderer(true);

  constructor(props: ITranscriptUI) {
    super(props);
    props.transcript.subscribe(this.on_message);
  }

  on_message = (entry: Entry) => {
    this.entries.push(entry);
    this.push_render_entry(entry);
  };

  push_render_entry(entry: Entry) {
    this.log.current?.append(this.render_entry(entry));
  }

  render() {
    return (
      <Column style="crochet-debug--transcript">
        <Log items={[]} ref={this.log}></Log>
      </Column>
    );
  }

  render_entry(x: Entry) {
    return (
      <Column style="crochet-debug--transcript-entry">
        <Column style="crochet-debug--transcript-meta">
          <Row>
            <div className="crochet-debug--transcript-tag">{x.tag}</div>
            <div className="crochet-debug--transcript-category">
              {x.metadata.category}
            </div>
          </Row>
          <div className="crochet-debug--transcript-location">
            {StackTrace.format_location(x.metadata.location)}
          </div>
        </Column>

        <div className="crochet-debug--transcript-message">
          {this.render_message(x.message)}
        </div>
      </Column>
    );
  }

  render_message(x: string | CrochetValue) {
    if (typeof x === "string") {
      return (
        <div className="crochet-debug--transcript-message-plain-text">{x}</div>
      );
    } else {
      return (
        <Tabs
          tabs={[
            {
              key: "structure",
              tab: "Structure",
              content: (
                <div className="crochet-debug--transcript-message-value">
                  {html.render_value(x)}
                </div>
              ),
            },
            {
              key: "plain-text",
              tab: "Plain Text",
              content: (
                <div className="crochet-debug--transcript-message-text">
                  {this.text_renderer.render_value(x)}
                </div>
              ),
            },
          ]}
        />
      );
    }
  }
}
