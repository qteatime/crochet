export type Subscriber<A> = (_: A) => void;

export class Stream<A> {
  private subscribers: Subscriber<A>[] = [];

  subscribe(x: Subscriber<A>) {
    this.unsubscribe(x);
    this.subscribers.push(x);
  }

  unsubscribe(x: Subscriber<A>) {
    this.subscribers = this.subscribers.filter(y => x !== y);
  }

  publish(value: A) {
    for (const subscriber of this.subscribers) {
      subscriber(value);
    }
  }
}