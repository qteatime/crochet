import { Bag } from "../../utils/bag";
import { State } from "../vm";
import { World } from "../world";
import { Database, IDatabase } from "./database";
import {
  FunctionRelation,
  FunctionRelationFn,
  MappedRelation,
  Predicate,
} from "./predicate";
import { Pattern, UnificationEnvironment } from "./unification";

export class FunctionLayer extends Bag<string, FunctionRelationFn> {
  constructor(readonly parent: FunctionLayer | null) {
    super("function");
  }

  try_lookup(name: string): FunctionRelationFn | null {
    const value = super.try_lookup(name);
    if (value != null) {
      return value;
    } else if (this.parent != null) {
      return this.parent.try_lookup(name);
    } else {
      return null;
    }
  }
}

export class DatabaseLayer implements IDatabase {
  constructor(readonly parent: IDatabase, readonly functions: FunctionLayer) {}

  add(name: string, relation: MappedRelation) {
    this.parent.add(name, relation);
  }

  update(name: string, relation: MappedRelation) {
    this.parent.update(name, relation);
  }

  try_lookup(name: string) {
    const fun = this.functions.try_lookup(name);
    if (fun != null) {
      return new FunctionRelation(name, fun);
    } else {
      return this.parent.try_lookup(name);
    }
  }

  lookup(name: string) {
    const relation = this.try_lookup(name);
    if (relation == null) {
      throw new Error(`internal: undefined relation or function: ${name}`);
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
