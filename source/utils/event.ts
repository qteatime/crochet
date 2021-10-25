export type Subscriber<A> = (value: A) => void;

export class EventStream<A> {
  private subscribers: Subscriber<A>[] = [];

  subscribe(handler: Subscriber<A>) {
    this.subscribers.push(handler);
    return handler;
  }

  unsubscribe(handler: Subscriber<A>) {
    this.subscribers = this.subscribers.filter((x) => x !== handler);
  }

  publish(value: A) {
    for (const handler of this.subscribers) {
      handler(value);
    }
  }
}
