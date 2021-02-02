import { Operation } from "../ir/operations";
import { Activation, Environment } from "./environment";
import { CrochetValue } from "./intrinsics";
import { CrochetVM } from "./vm";

export interface ICrochetProcedure {
  invoke(
    vm: CrochetVM,
    activation: Activation,
    args: CrochetValue[]
  ): Activation | null;
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

  invoke(vm: CrochetVM, activation: Activation, args: CrochetValue[]) {
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
      vm: CrochetVM,
      activation: Activation,
      ...args: CrochetValue[]
    ) => Activation | null
  ) {}

  get arity() {
    return this.parameters.length;
  }

  invoke(vm: CrochetVM, activation: Activation, args: CrochetValue[]) {
    const code = this.code;
    const actual_args = this.args.map((x) => args[x]);
    const result = code(vm, activation, ...actual_args);
    activation.next();
    return result;
  }
}
