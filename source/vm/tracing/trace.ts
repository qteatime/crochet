import * as IR from "../../ir";
import {
  ActionChoice,
  ActivationLocation,
  CrochetActivation,
  CrochetRelation,
  CrochetValue,
  RelationTag,
} from "../intrinsics";
import { EventChoice } from "../simulation/contexts";
import {
  TEAction,
  TEActionChoice,
  TEEvent,
  TEFact,
  TEForget,
  TEGoalReached,
  TETurn,
  TraceEvent,
  TraceTag,
} from "./events";

type Subscriber = (event: TraceEvent) => void;

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
    location: ActivationLocation,
    relation: CrochetRelation,
    values: CrochetValue[]
  ) {
    this.publish(new TEFact(location, relation as any, values));
  }

  publish_forget(
    location: ActivationLocation,
    relation: CrochetRelation,
    values: CrochetValue[]
  ) {
    this.publish(new TEForget(location, relation as any, values));
  }

  publish_turn(location: ActivationLocation, turn: CrochetValue) {
    this.publish(new TETurn(location, turn));
  }

  publish_action(location: ActivationLocation, choice: ActionChoice) {
    this.publish(new TEAction(location, choice));
  }

  publish_event(location: ActivationLocation, event: EventChoice) {
    this.publish(new TEEvent(location, event));
  }

  publish_goal_reached(location: ActivationLocation, goal: IR.SimulationGoal) {
    this.publish(new TEGoalReached(location, goal));
  }

  publish_action_choice(
    location: ActivationLocation,
    turn: CrochetValue,
    choices: ActionChoice[]
  ) {
    this.publish(new TEActionChoice(location, turn, choices));
  }
}
