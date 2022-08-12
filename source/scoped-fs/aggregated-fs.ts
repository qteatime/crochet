import { ScopedFS } from "./api";

export class AggregatedFS {
  private scopes = new Map<string, ScopedFS>();

  async add_scope(id: string, scope: ScopedFS) {
    if (this.scopes.has(id)) {
      if (this.scopes.get(id)!.equals(scope)) {
        return this;
      }
      throw new Error(`Duplicated scope ${id}`);
    }
    this.scopes.set(id, scope);
    return this;
  }

  get_scope(id: string) {
    const scope = this.scopes.get(id);
    if (scope == null) {
      throw new Error(`Unknown scope ${id}`);
    }
    return scope;
  }

  has_scope(id: string) {
    return this.scopes.has(id);
  }

  *all_scopes() {
    for (const [k, v] of this.scopes.entries()) {
      yield { name: k, scope: v };
    }
  }
}
