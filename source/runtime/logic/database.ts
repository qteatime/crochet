import { World } from "../world";
import { MappedRelation, Predicate } from "./predicate";
import { UnificationEnvironment } from "./unification";

export class Database {
  private relations = new Map<string, MappedRelation>();

  add(name: string, relation: MappedRelation) {
    if (this.relations.has(name)) {
      throw new Error(`internal: duplicated database predicate: ${name}`);
    }

    this.relations.set(name, relation);
  }

  update(name: string, relation: MappedRelation) {
    this.relations.set(name, relation);
  }

  try_lookup(name: string): MappedRelation | null {
    return this.relations.get(name) ?? null;
  }

  lookup(name: string) {
    const relation = this.try_lookup(name);
    if (relation == null) {
      throw new Error(`internal: undefined relation: ${name}`);
    }
    return relation;
  }

  search(world: World, predicate: Predicate) {
    return predicate.search(world, UnificationEnvironment.empty(), this);
  }
}
