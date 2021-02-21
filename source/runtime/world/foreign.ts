import { NativeProcedureFn } from "../primitives/procedure";

export class ForeignInterface {
  private methods = new Map<string, NativeProcedureFn>();

  add(name: string, procedure: NativeProcedureFn) {
    if (this.has(name)) {
      throw new Error(`Duplicated foreign function ${name}`);
    }
    this.methods.set(name, procedure);
  }

  has(name: string): boolean {
    return this.methods.has(name);
  }

  lookup(name: string): NativeProcedureFn | null {
    const procedure = this.methods.get(name);
    return procedure ?? null;
  }
}
