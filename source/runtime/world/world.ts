import { Declaration } from "../ir";
import { Database, Predicate, UnificationEnvironment } from "../logic";
import {
  CrochetRole,
  CrochetType,
  CrochetValue,
  CrochetProcedure,
  NativeProcedure,
  Procedure,
} from "../primitives";
import { Machine, run, State } from "../vm";
import { Context } from "../simulation";
import { ForeignInterface } from "./foreign";
import { Scene } from "./scene";
import { Bag } from "../../utils/bag";
import { Environment } from "../vm/environment";

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
  readonly contexts = new Bag<string, Context>("context");
  readonly global_context = new Context();
  readonly ffi = new ForeignInterface();

  schedule(machine: Machine) {
    this.queue.push(machine);
  }

  async load_declarations(xs: Declaration[], env: Environment) {
    const state = new State(this, env, this.database);
    for (const x of xs) {
      await x.apply(state);
    }
  }

  async run(entry: string) {
    const state = State.root(this);
    let current = this.queue.shift();
    while (current != null) {
      await run(current);
      current = this.queue.shift();
    }
    const scene = this.scenes.lookup(entry);
    return await run(scene.evaluate(state));
  }
}
