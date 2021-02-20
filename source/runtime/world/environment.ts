import { CrochetValue } from "../primitives";
import { World } from "./world";

export class Environment {
  readonly bindings = new Map<string, CrochetValue>();

  constructor(readonly parent: Environment | null, readonly world: World) {
    
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
    if (this.bindings.has(name)) {
      throw new Error(`Duplicate binding ${name}`);
    }
    
    this.bindings.set(name, value);
  }
}