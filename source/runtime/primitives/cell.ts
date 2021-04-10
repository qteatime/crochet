import { CrochetType, CrochetValue, TCrochetAny } from "./0-core";

export class TCrochetCell extends CrochetType {
  readonly type_name = "cell";
  readonly parent = TCrochetAny.type;
  static type = new TCrochetCell();
}

export class CrochetCell extends CrochetValue {
  readonly type = TCrochetCell.type;

  constructor(private value: CrochetValue) {
    super();
  }

  deref() {
    return this.value;
  }

  cas(old: CrochetValue, value: CrochetValue) {
    if (old.equals(this.value)) {
      this.value = value;
      return true;
    } else {
      return false;
    }
  }
}
