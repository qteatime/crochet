import { State } from "../vm";
import { World } from "../world";
import { MappedRelation, Predicate } from "./predicate";
import { UnificationEnvironment } from "./unification";

export class Database implements IDatabase {
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

  search(
    state: State,
    predicate: Predicate,
    initial_environment: UnificationEnvironment
  ): UnificationEnvironment[] {
    return predicate.search(state.with_database(this), initial_environment);
  }
}

export interface IDatabase {
  add(name: string, relation: MappedRelation): void;
  update(name: string, relation: MappedRelation): void;
  lookup(name: string): MappedRelation;
  try_lookup(name: string): MappedRelation | null;
  search(
    state: State,
    predicate: Predicate,
    initial_environment: UnificationEnvironment
  ): UnificationEnvironment[];
}
