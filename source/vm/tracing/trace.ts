import { TEApplyLambda } from ".";
import { CrochetLambda, CrochetNativeLambda, CrochetPartial } from "..";
import * as IR from "../../ir";
import {
  ActionChoice,
  CrochetRelation,
  CrochetValue,
  TraceSpan,
  Activation,
  CrochetCommandBranch,
  CrochetType,
  CrochetActivation,
} from "../intrinsics";
import { find_good_transcript_write_location } from "../primitives/location";
import { EventChoice } from "../simulation/contexts";
import { TraceConstraint } from "./constraint";
import {
  TEAction,
  TEActionChoice,
  TEEvent,
  TEFact,
  TEForget,
  TEGoalReached,
  TETurn,
  TraceEvent,
  EventLocation,
  TEInvoke,
  TENew,
  TELog,
  TEReturn,
} from "./events";

type Subscriber = (event: TraceEvent) => void;

export class TraceRecorder {
  private _events: TraceEvent[] = [];

  constructor(
    readonly trace: CrochetTrace,
    readonly constraint: TraceConstraint
  ) {}

  get events() {
    return this._events;
  }

  start() {
    this._events = [];
    this.trace.subscribe(this.receive);
  }

  stop() {
    this.trace.unsubscribe(this.receive);
  }

  receive = (event: TraceEvent) => {
    if (this.constraint.accepts(event)) {
      this._events.push(event);
    }
  };
}

export class CrochetTrace {
  private subscribers: Subscriber[] = [];

  subscribe(action: Subscriber) {
    this.subscribers.push(action);
  }

  unsubscribe(subscriber: Subscriber) {
    this.subscribers = this.subscribers.filter((x) => x !== subscriber);
  }

  publish(event: TraceEvent) {
    for (const f of this.subscribers) {
      f(event);
    }
  }

  publish_fact(
    activation: Activation,
    relation: CrochetRelation,
    values: CrochetValue[]
  ) {
    this.publish(
      new TEFact(
        EventLocation.from_activation(activation, null),
        relation as any,
        values
      )
    );
  }

  publish_forget(
    activation: Activation,
    relation: CrochetRelation,
    values: CrochetValue[]
  ) {
    this.publish(
      new TEForget(
        EventLocation.from_activation(activation, null),
        relation as any,
        values
      )
    );
  }

  publish_turn(activation: Activation, turn: CrochetValue) {
    this.publish(
      new TETurn(EventLocation.from_activation(activation, null), turn)
    );
  }

  publish_action(activation: Activation, choice: ActionChoice) {
    this.publish(
      new TEAction(EventLocation.from_activation(activation, null), choice)
    );
  }

  publish_event(activation: Activation, event: EventChoice) {
    this.publish(
      new TEEvent(EventLocation.from_activation(activation, null), event)
    );
  }

  publish_goal_reached(activation: Activation, goal: IR.SimulationGoal) {
    this.publish(
      new TEGoalReached(EventLocation.from_activation(activation, null), goal)
    );
  }

  publish_action_choice(
    activation: Activation,
    turn: CrochetValue,
    choices: ActionChoice[]
  ) {
    this.publish(
      new TEActionChoice(
        EventLocation.from_activation(activation, null),
        turn,
        choices
      )
    );
  }

  publish_instantiation(
    activation: Activation,
    type: CrochetType,
    args: CrochetValue[]
  ) {
    this.publish(
      new TENew(EventLocation.from_activation(activation, null), type, args)
    );
  }

  publish_invoke(
    call_site: Activation,
    branch: CrochetCommandBranch,
    activation: CrochetActivation,
    args: CrochetValue[]
  ) {
    this.publish(
      new TEInvoke(
        EventLocation.from_activation(call_site, null),
        branch,
        activation,
        args
      )
    );
  }

  publish_log(
    activation: Activation,
    category: string,
    tag: CrochetValue,
    message: string | CrochetValue
  ) {
    this.publish(
      new TELog(
        EventLocation.from_activation(
          activation,
          find_good_transcript_write_location(activation)
        ),
        category,
        tag,
        message
      )
    );
  }

  publish_return(activation: Activation, value: CrochetValue) {
    this.publish(
      new TEReturn(EventLocation.from_activation(activation, null), value)
    );
  }

  publish_lambda_apply(
    parent_activation: Activation,
    activation: Activation,
    lambda: CrochetValue,
    args: CrochetValue[]
  ) {
    this.publish(
      new TEApplyLambda(
        EventLocation.from_activation(parent_activation, null),
        activation,
        lambda,
        args
      )
    );
  }
}
