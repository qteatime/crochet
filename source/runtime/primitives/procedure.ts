import { every, zip } from "../../utils/utils";
import { Expression, SBlock, Statement } from "../ir";
import { cvalue, Machine, State, _mark, _push } from "../vm";
import { Environment, World } from "../world";
import { CrochetValue, CrochetType } from "./0-core";
import { Meta } from "../ir";
import { False } from "./boolean";

export class ContractCondition {
  constructor(
    readonly meta: Meta,
    readonly tag: string,
    readonly expr: Expression
  ) {}

  *is_valid(state: State): Machine {
    const value = cvalue(yield _push(this.expr.evaluate(state)));
    return value;
  }

  format_error() {
    return `${this.tag}: ${this.meta.source_slice}`;
  }
}

export class Contract {
  constructor(
    readonly pre: ContractCondition[],
    readonly post: ContractCondition[]
  ) {}

  *check_pre(
    state: State,
    name: string,
    params: string[],
    args: CrochetValue[]
  ): Machine {
    for (const condition of this.pre) {
      const valid = cvalue(yield _push(condition.is_valid(state)));
      if (!valid.as_bool()) {
        throw new Error(
          `Pre-condition violated when calling ${name}\nArguments: (${[
            ...zip(params, args),
          ]
            .map(([k, x]) => `${k} = ${x.to_text()}`)
            .join(", ")})\n\n${condition.format_error()}`
        );
      }
    }
    return False.instance;
  }

  *check_post(
    state0: State,
    name: string,
    params: string[],
    args: CrochetValue[],
    result: CrochetValue
  ): Machine {
    const env = state0.env.clone();
    env.define("contract:return", result);
    const state = state0.with_env(env);
    for (const condition of this.post) {
      const valid = cvalue(yield _push(condition.is_valid(state)));
      if (!valid.as_bool()) {
        throw new Error(
          `Post-condition violated from ${name}\nArguments: (${[
            ...zip(params, args),
          ]
            .map(([k, x]) => `${k} = ${x.to_text()}`)
            .join(
              ", "
            )})\nReturn: ${result.to_text()}\n\n${condition.format_error()}`
        );
      }
    }
    return result;
  }
}

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
    readonly env: Environment,
    readonly name: string,
    readonly parameter_names: string[],
    readonly parameters: string[],
    readonly foreign_name: string,
    readonly contract: Contract
  ) {}

  get full_name() {
    return `${this.name} (from ${this.filename})`;
  }

  *invoke(state0: State, values: CrochetValue[]): Machine {
    const env = this.env.clone_with_receiver(values[0]);
    for (const [k, v] of zip(this.parameter_names, values)) {
      env.define(k, v);
    }
    const state = state0.with_env(env);
    const args: CrochetValue[] = [];
    for (const name of this.parameters) {
      args.push(env.lookup(name));
    }
    const procedure = state.world.ffi.methods.lookup(this.foreign_name);
    yield _push(
      this.contract.check_pre(
        state,
        this.full_name,
        this.parameter_names,
        values
      )
    );
    const result = cvalue(
      yield _mark(this.full_name, procedure(state, ...args))
    );
    yield _push(
      this.contract.check_post(
        state,
        this.full_name,
        this.parameter_names,
        values,
        result
      )
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
    readonly body: Statement[],
    readonly contract: Contract
  ) {}

  get full_name() {
    return `${this.name} (from ${this.filename})`;
  }

  *invoke(state0: State, values: CrochetValue[]) {
    const env = this.env.clone_with_receiver(values[0]);
    for (const [k, v] of zip(this.parameters, values)) {
      env.define(k, v);
    }
    const state = state0.with_env(env);
    const block = new SBlock(this.body);
    yield _push(
      this.contract.check_pre(state, this.full_name, this.parameters, values)
    );
    const result = cvalue(yield _mark(this.full_name, block.evaluate(state)));
    yield _push(
      this.contract.check_post(
        state,
        this.full_name,
        this.parameters,
        values,
        result
      )
    );
    return result;
  }
}
