import { Activation } from "./environment";
import { CrochetValue } from "./intrinsics";
import { CrochetVM } from "./vm";

type Fn = (
  vm: CrochetVM,
  activation: Activation,
  ...args: CrochetValue[]
) => Promise<CrochetValue>;

export class ForeignFunction {
  constructor(readonly arity: number, readonly fn: Fn) {}
}

export class ForeignInterface {
  private bindings = new Map<string, ForeignFunction>();

  add(name: string, arity: number, fn: Fn) {
    if (this.bindings.has(name)) {
      throw new Error(`Duplicated foreign function definition ${name}`);
    }
    this.bindings.set(name, new ForeignFunction(arity, fn));
  }

  get(name: string) {
    const value = this.bindings.get(name);
    if (value == null) {
      throw new Error(`Unknown foreign function ${name}`);
    }
    return value;
  }
}
