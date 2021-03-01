export function iter<T>(x: Iterable<T>) {
  return new BetterIterable(x);
}

export class BetterIterable<T> {
  constructor(readonly values: Iterable<T>) {}

  map<U>(f: (_: T) => U) {
    const values = this.values;
    return new BetterIterable(
      (function* () {
        for (const value of values) {
          yield f(value);
        }
      })()
    );
  }

  flatMap<U>(f: (_: T) => Iterable<U>) {
    const values = this.values;
    return new BetterIterable(
      (function* () {
        for (const value of values) {
          yield* f(value);
        }
      })()
    );
  }

  zip<U>(gen: Generator<U>): BetterIterable<[T, U]> {
    const values = this.values;
    return new BetterIterable(
      (function* () {
        for (const value of values) {
          const { value: other } = gen.next(null);
          yield [value, other] as [T, U];
        }
      })()
    );
  }

  to_array() {
    return [...this.values];
  }
}
