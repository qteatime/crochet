import { CrochetValue } from "./value";

export class CrochetRecord extends CrochetValue {
  constructor(private value: Map<string, CrochetValue>) {
    super();
  }

  project(name: string): CrochetValue | null {
    return this.value.get(name) ?? null;
  }
}