import { CrochetValue } from "./value";

export class CrochetText extends CrochetValue {
  constructor(readonly value: string) {
    super();
  }
}