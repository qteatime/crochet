import { every, zip } from "../../utils/utils";
import { Expression, generated_node, SBlock, Statement } from "../ir";
import {
  cvalue,
  ErrArbitrary,
  Machine,
  State,
  _mark,
  _push,
  _push_expr,
} from "../vm";
import { Environment, World } from "../world";
import { CrochetValue, CrochetType, CrochetNothing } from "./0-core";
import { Meta } from "../ir";
import { False } from "./boolean";

export class ContractCondition {
  constructor(
    readonly meta: Meta,
    readonly tag: string,
    readonly expr: Expression
  ) {}

  *is_valid(state: State): Machine {
    const value = cvalue(yield _push_expr(this.expr, state));
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
        throw new ErrArbitrary(
          "pre-condition-failed",
          `Pre-condition violated when calling ${name}\nArguments: (${[
            ...zip(params, args),
          ]
            .map(([k, x]) => `${k} = ${x.to_debug_text()}`)
            .join(", ")})\n\n${condition.format_error()}`
        );
      }
    }
    return CrochetNothing.instance;
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
        throw new ErrArbitrary(
          "pos-condition-failed",
          `Post-condition violated from ${name}\nArguments: (${[
            ...zip(params, args),
          ]
            .map(([k, x]) => `${k} = ${x.to_debug_text()}`)
            .join(
              ", "
            )})\nReturn: ${result.to_debug_text()}\n\n${condition.format_error()}`
        );
      }
    }
    return result;
  }
}

// -- Procedures
export interface IProcedure {
  location_message: string;
  invoke(state: State, values: CrochetValue[]): Machine;
}

export class Procedure {
  private branches: ProcedureBranch[] = [];
  private versions: ProcedureBranch[][] = [];

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
    const branch = new ProcedureBranch(types, procedure);
    this.assert_no_duplicates(types, [branch, ...this.branches]);
    this.versions.push(this.branches);
    this.branches.push(branch);
    this.branches.sort((b1, b2) => b1.compare(b2));
  }

  override(types: CrochetType[], procedure: IProcedure) {
    const branch = new ProcedureBranch(types, procedure);
    const old = [...this.select_exact(types)];
    if (old.length > 0) {
      console.log(
        `Overriding ${this.name} (${types
          .map((x) => x.type_name)
          .join(", ")}), from ${old
          .map((x) => x.location_message)
          .join(", ")}, with ${this.name} ${branch.full_repr}`
      );
      this.versions.push(this.branches);
    }
    this.branches = this.branches.filter((x) => !old.includes(x));
    this.branches.push(branch);
    this.branches.sort((b1, b2) => b1.compare(b2));
  }

  rollback(version: number = this.versions.length - 1) {
    if (version < 0 || version >= this.versions.length) {
      throw new ErrArbitrary(
        "no-procedure-version",
        `No procedure version ${version} exists for ${this.name}`
      );
    }
    console.log(`Rolling back procedure ${this.name} to version ${version}`);
    this.branches = this.versions[version];
    this.versions.length = version - 1;

    const branches = this.branches.map((x) => `  - ${x.full_repr}`).join("\n");
    console.log(`${this.name} now has the following branches:\n${branches}`);
  }

  *select_exact(types: CrochetType[], branches = this.branches) {
    for (const branch of branches) {
      if (branch.types.every((t, i) => t === types[i])) {
        yield branch;
      }
    }
  }

  assert_no_duplicates(types: CrochetType[], branches = this.branches) {
    const dups = [...this.select_exact(types, branches)];
    if (dups.length > 1) {
      const branches = dups.map(
        (x) => `  - ${this.name}${x.simple_repr}, from ${x.location_message}`
      );
      throw new ErrArbitrary(
        "ambiguous-dispatch",
        `Multiple ${
          this.name
        } commands are activated by the same types, making them ambiguous:\n${branches.join(
          "\n"
        )}`
      );
    }
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

  get simple_repr() {
    return `(${this.types.map((x) => x.type_name).join(", ")})`;
  }

  get location_message() {
    return this.procedure.location_message;
  }

  get full_repr() {
    return `${this.simple_repr} from ${this.location_message}`;
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
    return `${this.name} (from ${this.location_message})`;
  }

  get location_message() {
    return `${this.env.module.qualified_name}`;
  }

  *invoke(state0: State, values: CrochetValue[]): Machine {
    state0.world.tracer.procedure_call(state0, this, values);

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

    state.world.tracer.procedure_return(state, this, result);
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
    return `${this.name} (from ${this.location_message})`;
  }

  get location_message() {
    return `${this.env.module.qualified_name}`;
  }

  *invoke(state0: State, values: CrochetValue[]) {
    state0.world.tracer.procedure_call(state0, this, values);

    const env = this.env.clone_with_receiver(values[0]);
    for (const [k, v] of zip(this.parameters, values)) {
      env.define(k, v);
    }
    const state = state0.with_env(env);
    const block = new SBlock(generated_node, this.body);
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

    state.world.tracer.procedure_return(state, this, result);
    return result;
  }
}
