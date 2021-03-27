import { every, zip } from "../../utils/utils";
import { SBlock, Statement } from "../ir";
import { cvalue, Machine, State, _mark } from "../vm";
import { Environment, World } from "../world";
import { CrochetValue } from "./value";
import { CrochetType } from "./types";
import { Comparison } from "../../utils/comparison";

// -- Procedures
export interface IProcedure {
  invoke(state: State, values: CrochetValue[]): Machine;
}

export class Procedure {
  private branches: ProcedureBranch[] = [];

  constructor(readonly name: string, readonly arity: number) {}

  select(values: CrochetValue[]): ProcedureBranch | null {
    for (const branch of this.branches) {
      if (branch.accepts(values)) {
        return branch;
      }
    }

    return null;
  }

  add(types: CrochetType[], procedure: IProcedure) {
    this.branches.push(new ProcedureBranch(types, procedure));
    this.branches.sort((b1, b2) => b1.compare(b2));
  }
}

export class ProcedureBranch {
  constructor(readonly types: CrochetType[], readonly procedure: IProcedure) {}

  compare(branch: ProcedureBranch) {
    for (const [t1, t2] of zip(this.types, branch.types)) {
      const d = t1.distance() - t2.distance();
      if (d !== 0) {
        return d;
      }
    }
    return 0;
  }

  accepts(values: CrochetValue[]) {
    return (
      values.length === this.types.length &&
      every(zip(this.types, values), ([t, v]) => t.accepts(v))
    );
  }
}

export type NativeProcedureFn = (
  state: State,
  ...args: CrochetValue[]
) => Machine;

export class NativeProcedure implements IProcedure {
  constructor(
    readonly filename: string,
    readonly name: string,
    readonly parameters: number[],
    readonly foreign_name: string
  ) {}

  get full_name() {
    return `${this.name} (from ${this.filename})`;
  }

  *invoke(state: State, values: CrochetValue[]): Machine {
    const args: CrochetValue[] = [];
    for (const idx of this.parameters) {
      args.push(values[idx]);
    }
    const procedure = state.world.ffi.methods.lookup(this.foreign_name);
    const result = cvalue(
      yield _mark(this.full_name, procedure(state, ...args))
    );
    return result;
  }
}

export class CrochetProcedure implements IProcedure {
  constructor(
    readonly filename: string,
    readonly env: Environment,
    readonly world: World,
    readonly name: string,
    readonly parameters: string[],
    readonly body: Statement[]
  ) {}

  get full_name() {
    return `${this.name} (from ${this.filename})`;
  }

  *invoke(state: State, values: CrochetValue[]) {
    const env = new Environment(this.env, values[0]);
    for (const [k, v] of zip(this.parameters, values)) {
      env.define(k, v);
    }
    const block = new SBlock(this.body);
    const result = cvalue(
      yield _mark(this.full_name, block.evaluate(state.with_env(env)))
    );
    return result;
  }
}
