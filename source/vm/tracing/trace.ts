import * as IR from "../../ir";
import {
  ActionChoice,
  CrochetRelation,
  CrochetValue,
  TraceSpan,
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
    location: TraceSpan | null,
    relation: CrochetRelation,
    values: CrochetValue[]
  ) {
    this.publish(new TEFact(location, relation as any, values));
  }

  publish_forget(
    location: TraceSpan | null,
    relation: CrochetRelation,
    values: CrochetValue[]
  ) {
    this.publish(new TEForget(location, relation as any, values));
  }

  publish_turn(location: TraceSpan | null, turn: CrochetValue) {
    this.publish(new TETurn(location, turn));
  }

  publish_action(location: TraceSpan | null, choice: ActionChoice) {
    this.publish(new TEAction(location, choice));
  }

  publish_event(location: TraceSpan | null, event: EventChoice) {
    this.publish(new TEEvent(location, event));
  }

  publish_goal_reached(location: TraceSpan | null, goal: IR.SimulationGoal) {
    this.publish(new TEGoalReached(location, goal));
  }

  publish_action_choice(
    location: TraceSpan | null,
    turn: CrochetValue,
    choices: ActionChoice[]
  ) {
    this.publish(new TEActionChoice(location, turn, choices));
  }
}
