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
import { CrochetModule, die, Machine, State, Thread } from "../vm";
import { ConcreteContext, Context, ContextBag } from "../simulation";
import { ForeignInterface } from "./foreign";
import { Scene } from "./scene";
import { Bag } from "../../utils/bag";
import { Environment } from "../vm/environment";
import { XorShift } from "../../utils";
import { CrochetPackage, RestrictedCrochetPackage } from "../pkg";

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
      throw die(`undefined procedure: ${name}`);
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
  readonly contexts = new ContextBag();
  readonly global_context = new ConcreteContext("<intrinsic>", "global");
  readonly ffi = new ForeignInterface();
  readonly global_random = XorShift.new_random();

  schedule(machine: Machine) {
    this.queue.push(machine);
  }

  get all_contexts() {
    return [this.global_context, ...this.contexts.concrete_contexts];
  }

  async load_declarations(
    filename: string,
    xs: Declaration[],
    env: Environment,
    pkg: RestrictedCrochetPackage
  ) {
    const module = new CrochetModule(this, filename, pkg);
    const context = {
      filename,
      module,
      package: pkg,
    };
    const state = new State(
      this.global_random,
      this,
      env.clone_with_module(module),
      this.database
    );
    for (const x of xs) {
      await x.apply(context, state);
    }
  }

  async run(entry: string) {
    const state = State.root(this);
    let current = this.queue.shift();
    while (current != null) {
      await Thread.for_machine(current).run_and_wait();
      current = this.queue.shift();
    }
    const scene = this.scenes.lookup(entry);
    return await Thread.for_machine(scene.evaluate(state)).run_and_wait();
  }
}
