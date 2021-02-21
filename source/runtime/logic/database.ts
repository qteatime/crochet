import { World } from "../world";
import { MappedRelation, Predicate } from "./predicate";
import { UnificationEnvironment } from "./unification";

export class Database {
  private relations = new Map<string, MappedRelation>();

  add(name: string, relation: MappedRelation) {
    if (this.relations.has(name)) {
      throw new Error(`Duplicated database predicate ${name}`);
    }

    this.relations.set(name, relation);
  }

  lookup(name: string): MappedRelation | null {
    return this.relations.get(name) ?? null;
  }

  search(world: World, predicate: Predicate) {
    return predicate.search(world, UnificationEnvironment.empty(), this);
  }
}
