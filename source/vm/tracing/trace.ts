import * as IR from "../../ir";
import {
  ActionChoice,
  CrochetRelation,
  CrochetValue,
  TraceSpan,
  Activation,
} from "../intrinsics";
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
}
