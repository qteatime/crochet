export class Bag<K, V> {
  readonly map = new Map<K, V>();

  constructor(readonly name: string) {}

  add(name: K, value: V) {
    if (this.map.has(name)) {
      throw new Error(`internal: duplicated ${this.name}: ${name}`);
    }
    this.map.set(name, value);
  }

  has_own(name: K) {
    return this.map.has(name);
  }

  has(name: K) {
    return this.try_lookup(name) != null;
  }

  try_lookup(name: K) {
    return this.map.get(name) ?? null;
  }

  lookup(name: K) {
    const value = this.try_lookup(name);
    if (value != null) {
      return value;
    } else {
      throw new Error(`internal: undefined ${this.name}: ${name}`);
    }
  }
}
