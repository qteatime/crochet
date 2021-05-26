import {
  ActivationLocation,
  CrochetValue,
  StackTrace,
  TEFact,
  TEForget,
  TELog,
  TraceEvent,
  TraceTag,
} from "../../vm";
import { Repr, TerminalRenderer, value_to_repr } from "./representation";
import { html } from "./representation/html-renderer";
import { Transcript } from "../transcript/transcript";
import * as React from "react";
import { Log } from "./ui/log";
import { Column, IElement, Row, Style } from "./ui/basic";
import { Tabs } from "./ui/tabs";
import { Value } from "./ui/value";
import { unreachable } from "../../utils/utils";
import { List } from "./ui/info";

type ITranscriptUI = {
  transcript: Transcript;
};

type ITranscriptState = {};

export class TranscriptUI extends React.Component<
  ITranscriptUI,
  ITranscriptState
> {
  readonly log = React.createRef<Log>();
  readonly text_renderer = new TerminalRenderer(true);

  constructor(props: ITranscriptUI) {
    super(props);
    props.transcript.subscribe(this.on_message);
  }

  on_message = (entry: TraceEvent) => {
    this.push_render_entry(entry);
  };

  push_render_entry(entry: TraceEvent) {
    this.log.current?.append(this.render_entry(entry));
  }

  render() {
    return (
      <Column style="crochet-debug--transcript">
        <Log items={[]} ref={this.log}></Log>
      </Column>
    );
  }

  render_entry(x: TraceEvent) {
    return <Entry type={x.tag}>{this.render_entry_inner(x)}</Entry>;
  }

  render_entry_inner(x: TraceEvent) {
    if (x instanceof TELog) {
      return (
        <React.Fragment>
          <Meta>
            <Category tag={x.log_tag} category={x.category} />
            <Location location={x.location} />
          </Meta>
          <Message>{this.render_message(x.value)}</Message>
        </React.Fragment>
      );
    } else if (x instanceof TEFact) {
      return (
        <React.Fragment>
          <Meta>
            <Category tag={"Fact"} />
            <Location location={x.location} />
          </Meta>
          <Message>
            <Style theme="relation">
              {x.relation.name} (from {x.relation.payload.module.pkg.name})
            </Style>
            <List values={x.values.map((a) => html.render_value(a))} />
          </Message>
        </React.Fragment>
      );
    } else if (x instanceof TEForget) {
      return (
        <React.Fragment>
          <Meta>
            <Category tag={"Forget"} />
            <Location location={x.location} />
          </Meta>
          <Message>
            <Style theme="relation">
              {x.relation.name} (from {x.relation.payload.module.pkg.name})
            </Style>
            <List values={x.values.map((a) => html.render_value(a))} />
          </Message>
        </React.Fragment>
      );
    } else {
      throw unreachable(x, "Trace Event");
    }
  }

  render_message(x: string | CrochetValue) {
    if (typeof x === "string") {
      return (
        <div className="crochet-debug--transcript-message-plain-text">{x}</div>
      );
    } else {
      return <Value value={x} />;
    }
  }
}

function Entry(props: IElement & { type: TraceTag }) {
  return (
    <Column
      style="crochet-debug--transcript-entry"
      data-event-type={TraceTag[props.type]}
    >
      {props.children}
    </Column>
  );
}

function Location(props: { location: ActivationLocation }) {
  return (
    <div className="crochet-debug--transcript-location">
      {StackTrace.format_location(props.location)}
    </div>
  );
}

function Meta(props: IElement) {
  return (
    <Column style="crochet-debug--transcript-meta">{props.children}</Column>
  );
}

function Category(props: { tag: string; category?: string }) {
  return (
    <Row>
      <div className="crochet-debug--transcript-tag">{props.tag}</div>
      <div className="crochet-debug--transcript-category">{props.category}</div>
    </Row>
  );
}

function Message(props: IElement) {
  return (
    <div className="crochet-debug--transcript-message">{props.children}</div>
  );
}
