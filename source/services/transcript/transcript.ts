import {
  ActivationLocation,
  CrochetTrace,
  CrochetValue,
  TraceEvent,
  TraceTag,
} from "../../vm";

type Subscriber = (_: TraceEvent) => void;

type Filter = Record<TraceTag, boolean>;

export class Transcript {
  private subscribers: Subscriber[] = [];
  private filter: Filter = {
    [TraceTag.LOG]: true,
    [TraceTag.FACT]: false,
    [TraceTag.FORGET]: false,
    [TraceTag.SIMULATION_ACTION]: false,
    [TraceTag.SIMULATION_ACTION_CHOICE]: false,
    [TraceTag.SIMULATION_EVENT]: false,
  };

  constructor(readonly trace: CrochetTrace) {
    trace.subscribe(this.on_event);
  }

  on_event = (event: TraceEvent) => {
    if (this.filter[event.tag]) {
      for (const f of this.subscribers) {
        f(event);
      }
    }
  };

  set_filter(filter: Partial<Filter>) {
    for (const [k, v] of Object.entries(filter)) {
      this.filter[k as any as TraceTag] = Boolean(v);
    }
  }

  subscribe(x: Subscriber) {
    this.subscribers.push(x);
  }
}
