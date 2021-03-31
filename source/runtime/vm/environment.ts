import { UnificationEnvironment } from "../logic";
import { CrochetValue } from "../primitives";
import { die } from "./run";

export class Environment {
  readonly bindings = new Map<string, CrochetValue>();

  constructor(
    readonly parent: Environment | null,
    readonly raw_receiver: CrochetValue | null
  ) {}

  get receiver() {
    if (this.raw_receiver == null) {
      throw die(`requesting receiver outside of command`);
    }
    return this.raw_receiver;
  }

  has(name: string): boolean {
    return this.bindings.has(name);
  }

  try_lookup(name: string): CrochetValue | null {
    const result = this.bindings.get(name);
    if (result != null) {
      return result;
    } else if (this.parent != null) {
      return this.parent.try_lookup(name);
    } else {
      return null;
    }
  }

  lookup(name: string): CrochetValue {
    const result = this.try_lookup(name);
    if (result != null) {
      return result;
    } else {
      throw die(`undefined variable ${name}`);
    }
  }

  define(name: string, value: CrochetValue) {
    if (name === "_") {
      return;
    }

    if (this.bindings.has(name)) {
      throw die(`Duplicate binding ${name}`);
    }

    this.bindings.set(name, value);
  }

  define_all(bindings: Map<string, CrochetValue>) {
    for (const [k, v] of bindings.entries()) {
      this.define(k, v);
    }
  }

  lookup_all(names: string[]): Map<string, CrochetValue> {
    const result = new Map();
    for (const name of names) {
      const value = this.try_lookup(name);
      if (value != null) {
        result.set(name, value);
      }
    }
    return result;
  }

  extend_with_unification(env: UnificationEnvironment) {
    const newEnv = new Environment(this, this.raw_receiver);
    (newEnv as any).bindings = env.boundValues;
    return newEnv;
  }

  clone() {
    return new Environment(this, this.raw_receiver);
  }
}
