import type { ActivationLocation, CrochetValue } from "../../vm";

export interface Metadata {
  category: string;
  location: ActivationLocation;
}

export class Entry {
  constructor(
    readonly tag: string,
    readonly message: CrochetValue | string,
    readonly metadata: Metadata
  ) {}
}

export type Subscriber = (_: Entry) => void;

export class Transcript {
  private subscribers: Subscriber[] = [];

  subscribe(x: Subscriber) {
    if (!this.subscribers.includes(x)) {
      this.subscribers.push(x);
    }
  }

  publish(tag: string, message: CrochetValue | string, meta: Metadata) {
    for (const push of this.subscribers) {
      push(new Entry(tag, message, meta));
    }
  }
}
