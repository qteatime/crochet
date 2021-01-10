import { CrochetValue } from "./value";

export class CrochetBoolean extends CrochetValue {
  constructor(readonly value: boolean) {
    super();
  }
}