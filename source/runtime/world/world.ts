import { Declaration } from "../ir";
import {
  ConcreteRelation,
  Database,
  Predicate,
  PredicateProcedure,
  TreeType,
} from "../logic";
import { Procedure } from "../primitives/procedure";
import { Machine, run } from "../run";

export class World {
  private database = new Database();
  private procedures = new Map<string, Procedure>();
  private queue: Machine[] = [];

  add_relation(name: string, type: TreeType) {
    this.database.add(name, new ConcreteRelation(name, type.realise()));
  }

  add_predicate(name: string, predicate: PredicateProcedure) {
    this.database.add(name, predicate);
  }

  get_relation(name: string) {
    const relation = this.database.lookup(name);
    if (relation instanceof ConcreteRelation) {
      return relation.tree;
    } else {
      throw new Error(`Undefined relation ${name}`);
    }
  }

  get_procedure(name: string) {
    const procedure = this.procedures.get(name);
    if (procedure == null) {
      throw new Error(`Undefined procedure ${name}`);
    } else {
      return procedure;
    }
  }

  search(predicate: Predicate) {
    return this.database.search(predicate);
  }

  schedule(machine: Machine) {
    this.queue.push(machine);
  }

  load_declarations(xs: Declaration[]) {
    for (const x of xs) {
      x.apply(this);
    }
  }

  async run() {
    let current = this.queue.shift();
    let result = null;
    while (current != null) {
      result = await run(current);
      current = this.queue.shift();
    }
    return result;
  }
}
