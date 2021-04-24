import { Declaration, generated_node } from "../ir";
import { Database, Predicate, UnificationEnvironment } from "../logic";
import {
  CrochetType,
  CrochetValue,
  CrochetProcedure,
  NativeProcedure,
  Procedure,
  ProcedureBranch,
} from "../primitives";
import { CrochetModule, die, Machine, State, Thread, Tracer } from "../vm";
import { ConcreteContext, Context, ContextBag } from "../simulation";
import { ForeignInterface } from "./foreign";
import { Scene } from "./scene";
import { Bag } from "../../utils/bag";
import { Environment } from "../vm/environment";
import { XorShift } from "../../utils";
import { CrochetPackage, RestrictedCrochetPackage } from "../pkg";
import { CrochetTest } from "./test";

export class ProcedureBag {
  private map = new Map<string, Procedure>();

  add_foreign(
    name: string,
    types: CrochetType[],
    code: NativeProcedure,
    override: boolean
  ) {
    const procedure = this.map.get(name) ?? new Procedure(name, types.length);
    if (override) {
      procedure.override(types, code);
    } else {
      procedure.add(types, code);
    }
    this.map.set(name, procedure);
  }

  add_crochet(
    name: string,
    types: CrochetType[],
    code: CrochetProcedure,
    override: boolean
  ) {
    const procedure = this.map.get(name) ?? new Procedure(name, types.length);
    if (override) {
      procedure.override(types, code);
    } else {
      procedure.add(types, code);
    }
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

  *select_matching(
    type: CrochetType
  ): Generator<[Procedure, ProcedureBranch[]]> {
    for (const procedure of this.map.values()) {
      const branches = procedure.select_matching(type);
      if (branches.length !== 0) {
        yield [procedure, branches];
      }
    }
  }
}

export class World {
  private queue: Machine[] = [];
  readonly database = new Database();
  readonly procedures = new ProcedureBag();
  readonly types = new Bag<string, CrochetType>("type");
  readonly globals = new Bag<string, CrochetValue>("global");
  readonly scenes = new Bag<string, Scene>("scene");
  readonly contexts = new ContextBag();
  readonly global_context = new ConcreteContext(generated_node, "global");
  readonly ffi = new ForeignInterface();
  readonly global_random = XorShift.new_random();
  readonly tests: CrochetTest[] = [];
  readonly tracer = new Tracer();

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

  async run_init() {
    let current = this.queue.shift();
    while (current != null) {
      await Thread.for_machine(current).run_and_wait();
      current = this.queue.shift();
    }
  }

  async run(entry: string) {
    await this.run_init();
    const state = State.root(this);
    const scene = this.scenes.lookup(entry);
    return await Thread.for_machine(scene.evaluate(state)).run_and_wait();
  }

  get grouped_tests() {
    const groups = new Map<string, Map<string, CrochetTest[]>>();
    for (const test of this.tests) {
      const key = test.module.pkg.name;
      const module_key = test.module.relative_filename;
      const modules = groups.get(key) ?? new Map();
      const tests = modules.get(module_key) ?? [];
      tests.push(test);
      modules.set(module_key, tests);
      groups.set(key, modules);
    }
    return groups;
  }
}
