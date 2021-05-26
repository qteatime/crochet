import {
  ActivationLocation,
  CrochetActivation,
  CrochetRelation,
  CrochetValue,
  RelationTag,
} from "../intrinsics";
import { TEFact, TEForget, TraceEvent, TraceTag } from "./events";

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
}
