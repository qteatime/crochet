import { CrochetValue } from "../runtime/intrinsics/value";

type Procedure = (...args: CrochetValue[]) => CrochetValue;

export class Environment {
  private procedures = new Map<string, Procedure>();
  private bindings = new Map<string, CrochetValue>();

  lookup_procedure(name: string): Procedure | null {
    return this.procedures.get(name) ?? null;
  }

  lookup(name: string): CrochetValue | null {
    return this.bindings.get(name) ?? null;
  }

  define(name: string, value: CrochetValue) {
    this.bindings.set(name, value);
  }

  define_procedure(name: string, value: Procedure) {
    this.procedures.set(name, value);
  }
}