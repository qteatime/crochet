import { CrochetModule, CrochetValue } from "../../vm";

export interface Metadata {
  category: string;
  module: CrochetModule;
  meta_id: number;
}

export class Entry {
  constructor(
    readonly tag: string,
    readonly message: CrochetValue,
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

  publish(entry: Entry) {
    for (const push of this.subscribers) {
      push(entry);
    }
  }
}
