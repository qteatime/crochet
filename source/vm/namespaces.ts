export class Namespace<V> {
  private _bindings = new Map<string, V>();
  readonly allowed_prefixes: Set<string>;

  constructor(
    readonly parent: Namespace<V> | null,
    readonly prefix: string | null,
    allowed_prefixes?: Set<string> | null
  ) {
    this.allowed_prefixes = allowed_prefixes || new Set<string>();
  }

  get own_bindings(): Map<string, V> {
    return this._bindings;
  }

  get bindings(): Map<string, V> {
    const result = new Map<string, V>();

    const parent = this.parent;
    if (parent != null) {
      for (const [k, v] of parent.bindings) {
        result.set(k, v);
      }
    }

    for (const [k, v] of this._bindings) {
      result.set(k, v);
    }

    return result;
  }

  prefixed(name: string): string {
    return this.make_namespace(this.prefix, name);
  }

  make_namespace(namespace: string | null, name: string) {
    if (namespace == null) {
      return name;
    } else {
      return `${namespace}/${name}`;
    }
  }

  remove(name: string): boolean {
    if (this.has_own(name)) {
      this._bindings.delete(name);
      return true;
    } else {
      return false;
    }
  }

  define(name: string, value: V): boolean {
    if (this.has_own(name)) {
      return false;
    }
    this._bindings.set(this.prefixed(name), value);
    return true;
  }

  overwrite(name: string, value: V) {
    this._bindings.set(this.prefixed(name), value);
  }

  has_own(name: string) {
    return this._bindings.has(this.prefixed(name));
  }

  has(name: string) {
    return this.try_lookup(name) != null;
  }

  try_lookup_local(name: string) {
    return this._bindings.get(this.make_namespace(this.prefix, name)) ?? null;
  }

  try_lookup(name: string) {
    const value = this.try_lookup_namespaced(this.prefix, name);
    if (value != null) {
      return value;
    } else {
      for (const prefix of this.allowed_prefixes) {
        const value = this.try_lookup_namespaced(prefix, name);
        if (value != null) {
          return value;
        }
      }
      return null;
    }
  }

  try_lookup_namespaced(namespace: string | null, name: string): V | null {
    const value = this._bindings.get(this.make_namespace(namespace, name));
    if (value != null) {
      return value;
    } else if (this.parent != null) {
      return this.parent.try_lookup_namespaced(namespace, name);
    } else {
      return null;
    }
  }
}

export class PassthroughNamespace<V> extends Namespace<V> {
  constructor(
    readonly parent: Namespace<V> | null,
    readonly prefix: string | null
  ) {
    super(parent, prefix);
  }

  define(name: string, value: V): boolean {
    return this.parent?.define(this.prefixed(name), value) ?? false;
  }
}
