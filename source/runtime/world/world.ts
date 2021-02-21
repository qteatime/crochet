import { Declaration } from "../ir";
import {
  ConcreteRelation,
  Database,
  Predicate,
  PredicateProcedure,
  TreeType,
} from "../logic";
import {
  CrochetProcedure,
  DispatchType,
  NativeProcedure,
  Procedure,
} from "../primitives/procedure";
import { Machine, run } from "../run";
import { ForeignInterface } from "./foreign";

export class World {
  private database = new Database();
  private procedures = new Map<string, Procedure>();
  private queue: Machine[] = [];

  constructor(readonly ffi: ForeignInterface) {}

  // -- Logic and relations
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

  // -- Commands
  add_foreign_procedure(
    name: string,
    types: DispatchType[],
    native: NativeProcedure
  ) {
    const procedure =
      this.procedures.get(name) ?? new Procedure(name, types.length);
    procedure.add(types, native);
    this.procedures.set(name, procedure);
  }

  add_crochet_procedure(
    name: string,
    types: DispatchType[],
    code: CrochetProcedure
  ) {
    const procedure =
      this.procedures.get(name) ?? new Procedure(name, types.length);
    procedure.add(types, code);
    this.procedures.set(name, procedure);
  }

  get_procedure(name: string) {
    const procedure = this.procedures.get(name);
    if (procedure == null) {
      throw new Error(`Undefined procedure ${name}`);
    } else {
      return procedure;
    }
  }

  get_native_procedure(name: string) {
    const procedure = this.ffi.lookup(name);
    if (procedure == null) {
      throw new Error(`Undefined native procedure ${name}`);
    } else {
      return procedure;
    }
  }

  // -- Execution
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
