import { NativeProcedureFn } from "../primitives/procedure";

export class ForeignInterface {
  private methods = new Map<string, NativeProcedureFn>();

  add(name: string, procedure: NativeProcedureFn) {
    if (this.has(name)) {
      throw new Error(`internal: duplicated foreign function: ${name}`);
    }
    this.methods.set(name, procedure);
  }

  has(name: string): boolean {
    return this.methods.has(name);
  }

  try_lookup(name: string): NativeProcedureFn | null {
    const procedure = this.methods.get(name);
    return procedure ?? null;
  }

  lookup(name: string) {
    const procedure = this.try_lookup(name);
    if (procedure != null) {
      return procedure;
    } else {
      throw new Error(`internal: undefined foreign function: ${name}`);
    }
  }
}
