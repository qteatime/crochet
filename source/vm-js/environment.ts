import * as IR from "../ir/operations";
import { CrochetValue } from "./intrinsics";
import { ICrochetProcedure } from "./procedure";

export class Environment {
  private bindings = new Map<string, CrochetValue>();
  private procedures = new Map<string, ICrochetProcedure>();

  constructor(readonly parent: Environment | null) {}

  lookup_procedure(name: string): ICrochetProcedure | null {
    const value = this.procedures.get(name);
    if (value != null) {
      return value;
    } else if (this.parent != null) {
      return this.parent.lookup_procedure(name);
    } else {
      return null;
    }
  }

  define_procedure(name: string, procedure: ICrochetProcedure) {
    if (!this.procedures.has(name)) {
      this.procedures.set(name, procedure);
      return true;
    } else {
      return false;
    }
  }

  lookup(name: string): CrochetValue | null {
    const value = this.bindings.get(name);
    if (value != null) {
      return value;
    } else if (this.parent != null) {
      return this.parent.lookup(name);
    } else {
      return null;
    }
  }

  define(name: string, value: CrochetValue): boolean {
    if (!this.bindings.has(name)) {
      this.bindings.set(name, value);
      return true;
    } else {
      return false;
    }
  }
}

export class Activation {
  private current_index: number;
  private stack: CrochetValue[];

  constructor(
    readonly parent: Activation | null,
    readonly env: Environment,
    readonly block: IR.Operation[]
  ) {
    this.current_index = 0;
    this.stack = [];
  }

  get current() {
    if (this.current_index < 0 || this.current_index >= this.block.length) {
      return new IR.Halt();
    }
    return this.block[this.current_index];
  }

  next() {
    this.current_index += 1;
  }

  push(value: CrochetValue) {
    this.stack.push(value);
  }

  pop(): CrochetValue {
    if (this.stack.length === 0) {
      throw new Error(`pop() on an empty stack`);
    }
    return this.stack.pop()!;
  }

  pop_many(size: number) {
    if (this.stack.length < size) {
      throw new Error(`pop() on an empty stack`);
    }
    const result = this.stack.slice(-size);
    result.length -= size;
    return result;
  }
}
