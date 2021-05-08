export class Namespace<V> {
  private bindings = new Map<string, V>();
  readonly allowed_prefixes: Set<string>;

  constructor(
    readonly parent: Namespace<V> | null,
    readonly prefix: string | null,
    allowed_prefixes?: Set<string> | null
  ) {
    this.allowed_prefixes = allowed_prefixes || new Set<string>();
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

  define(name: string, value: V): boolean {
    if (this.has_own(name)) {
      return false;
    }
    this.bindings.set(this.prefixed(name), value);
    return true;
  }

  has_own(name: string) {
    return this.bindings.has(this.prefixed(name));
  }

  has(name: string) {
    return this.try_lookup(name) != null;
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
    const value = this.bindings.get(this.make_namespace(namespace, name));
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
