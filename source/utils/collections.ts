class Pair<K, V> {
  constructor(readonly key: K, public value: V) {}
}

interface IEquality {
  equals(other: any): boolean;
}

export class BagMap<K extends IEquality, V> {
  private pairs: Pair<K, V>[] = [];

  set(key: K, value: V) {
    for (const pair of this.pairs) {
      if (pair.key.equals(key)) {
        pair.value = value;
        return;
      }
    }
    this.pairs.push(new Pair(key, value));
  }

  has(key: K) {
    for (const pair of this.pairs) {
      if (pair.key.equals(key)) {
        return true;
      }
    }
    return false;
  }

  get(key: K) {
    for (const pair of this.pairs) {
      if (pair.key.equals(key)) {
        return pair.value;
      }
    }
  }

  *entries() {
    for (const pair of this.pairs) {
      yield [pair.key, pair.value] as [K, V];
    }
  }
}
