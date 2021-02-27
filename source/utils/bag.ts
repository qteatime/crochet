export class Bag<K, V> {
  private map = new Map<K, V>();

  constructor(readonly name: string) {}

  add(name: K, value: V) {
    if (this.map.has(name)) {
      throw new Error(`internal: duplicated ${this.name}: ${name}`);
    }
    this.map.set(name, value);
  }

  has(name: K) {
    return this.map.has(name);
  }

  try_lookup(name: K) {
    return this.map.get(name) ?? null;
  }

  lookup(name: K) {
    const value = this.map.get(name);
    if (value != null) {
      return value;
    } else {
      throw new Error(`internal: undefined ${this.name}: ${name}`);
    }
  }
}
