import { Declaration } from "../ir";
import {
  ConcreteRelation,
  Database,
  Predicate,
  PredicateProcedure,
  TreeType,
} from "../logic";
import {
  CrochetRole,
  CrochetType,
  CrochetValue,
  CrochetProcedure,
  NativeProcedure,
  Procedure,
} from "../primitives";
import { Machine, run } from "../run";
import { Context } from "./events";
import { ForeignInterface } from "./foreign";
import { Scene } from "./scene";

export class Bag<K, V> {
  private map = new Map<K, V>();

  constructor(readonly name: string) {}

  add(name: K, value: V) {
    if (this.map.has(name)) {
      throw new Error(`internal: duplicated ${this.name}: ${name}`);
    }
    this.map.set(name, value);
  }

  has(name: K) {
    return this.map.has(name);
  }

  try_lookup(name: K) {
    return this.map.get(name) ?? null;
  }

  lookup(name: K) {
    const value = this.map.get(name);
    if (value != null) {
      return value;
    } else {
      throw new Error(`internal: undefined ${this.name}: ${name}`);
    }
  }
}

export class ProcedureBag {
  private map = new Map<string, Procedure>();

  add_foreign(name: string, types: CrochetType[], code: NativeProcedure) {
    const procedure = this.map.get(name) ?? new Procedure(name, types.length);
    procedure.add(types, code);
    this.map.set(name, procedure);
  }

  add_crochet(name: string, types: CrochetType[], code: CrochetProcedure) {
    const procedure = this.map.get(name) ?? new Procedure(name, types.length);
    procedure.add(types, code);
    this.map.set(name, procedure);
  }

  has(name: string) {
    return this.map.has(name);
  }

  try_lookup(name: string) {
    return this.map.get(name) ?? null;
  }

  lookup(name: string) {
    const value = this.map.get(name);
    if (value != null) {
      return value;
    } else {
      throw new Error(`internal: undefined procedure: ${name}`);
    }
  }
}

export class World {
  private queue: Machine[] = [];
  readonly database = new Database();
  readonly procedures = new ProcedureBag();
  readonly types = new Bag<string, CrochetType>("type");
  readonly roles = new Bag<string, CrochetRole>("role");
  readonly globals = new Bag<string, CrochetValue>("global");
  readonly scenes = new Bag<string, Scene>("scene");
  readonly global_context = new Context();
  readonly ffi = new ForeignInterface();

  search(predicate: Predicate) {
    return this.database.search(this, predicate);
  }

  schedule(machine: Machine) {
    this.queue.push(machine);
  }

  async load_declarations(xs: Declaration[]) {
    for (const x of xs) {
      await x.apply(this);
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
