import type {
  ActivationLocation,
  CrochetTrace,
  CrochetValue,
  TraceEvent,
} from "../../vm";

type Subscriber = (_: TraceEvent) => void;

export class Transcript {
  private subscribers: Subscriber[] = [];

  constructor(readonly trace: CrochetTrace) {
    trace.subscribe(this.on_event);
  }

  on_event = (event: TraceEvent) => {
    for (const f of this.subscribers) {
      f(event);
    }
  };

  subscribe(x: Subscriber) {
    this.subscribers.push(x);
  }
}
