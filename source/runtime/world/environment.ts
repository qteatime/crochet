import { CrochetValue } from "../primitives";

export class Environment {
  readonly bindings = new Map<string, CrochetValue>();

  constructor(
    readonly parent: Environment | null,
    readonly raw_receiver: CrochetValue | null
  ) {}

  get receiver() {
    if (this.raw_receiver == null) {
      throw new Error(`internal: requesting receiver outside of command`);
    }
    return this.raw_receiver;
  }

  has(name: string): boolean {
    return this.bindings.has(name);
  }

  lookup(name: string): CrochetValue | null {
    const result = this.bindings.get(name);
    if (result != null) {
      return result;
    } else if (this.parent != null) {
      return this.parent.lookup(name);
    } else {
      return null;
    }
  }

  define(name: string, value: CrochetValue) {
    if (name === "_") {
      return;
    }

    if (this.bindings.has(name)) {
      throw new Error(`Duplicate binding ${name}`);
    }

    this.bindings.set(name, value);
  }

  define_all(bindings: Map<string, CrochetValue>) {
    for (const [k, v] of bindings.entries()) {
      this.define(k, v);
    }
  }
}
