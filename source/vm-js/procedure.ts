import { Operation } from "../ir/operations";
import { Activation, Environment } from "./environment";
import { CrochetValue } from "./intrinsics";
import { CrochetVM, CrochetVMInterface } from "./vm";

export interface ICrochetProcedure {
  invoke(
    vm: CrochetVM,
    activation: Activation,
    args: CrochetValue[]
  ): Promise<Activation | null>;
  arity: number;
}

export class CrochetProcedure implements ICrochetProcedure {
  constructor(
    readonly env: Environment,
    readonly name: string,
    readonly parameters: string[],
    readonly body: Operation[]
  ) {}

  get arity() {
    return this.parameters.length;
  }

  async invoke(vm: CrochetVM, activation: Activation, args: CrochetValue[]) {
    const new_env = new Environment(this.env);
    this.parameters.forEach((k, i) => new_env.define(k, args[i]));

    const new_activation = new Activation(activation, new_env, this.body);
    return new_activation;
  }
}

export class CrochetForeignProcedure implements ICrochetProcedure {
  constructor(
    readonly name: string,
    readonly parameters: string[],
    readonly args: number[],
    readonly code: (
      vm: CrochetVMInterface,
      ...args: CrochetValue[]
    ) => Promise<CrochetValue> | CrochetValue
  ) {}

  get arity() {
    return this.parameters.length;
  }

  async invoke(vm: CrochetVM, activation: Activation, args: CrochetValue[]) {
    const code = this.code;
    const actual_args = this.args.map((x) => args[x]);
    const vmi = new CrochetVMInterface(vm, activation);
    const result = await code(vmi, ...actual_args);
    activation.push(result);
    return activation;
  }
}
