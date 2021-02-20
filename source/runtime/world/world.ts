import { ConcreteRelation, Database, Predicate, PredicateProcedure, TreeType } from "../logic";

export class World {
  private database = new Database();

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

  search(predicate: Predicate) {
    return this.database.search(predicate);
  }
}