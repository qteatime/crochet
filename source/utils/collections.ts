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

export function difference<A>(s1: Set<A>, s2: Set<A>) {
  const result = new Set<A>();
  for (const x of s2.values()) {
    if (!s1.has(x)) {
      result.add(x);
    }
  }
  return result;
}

export function union<A>(s1: Set<A>, s2: Set<A>) {
  const result = new Set<A>();
  for (const x of s1.values()) result.add(x);
  for (const x of s2.values()) result.add(x);
  return result;
}

export function intersect<A>(s1: Set<A>, s2: Set<A>) {
  const result = new Set<A>();
  for (const x of s1.values()) {
    if (s2.has(x)) {
      result.add(x);
    }
  }
  return result;
}
