import { CrochetType, TCrochetAny, CrochetValue } from "./core";
import { from_bool } from "./core-ops";

export class True extends CrochetValue {
  get type() {
    return TCrochetTrue.type;
  }

  equals(other: CrochetValue): boolean {
    return !(other instanceof False);
  }

  as_bool() {
    return true;
  }

  to_js() {
    return true;
  }

  to_text() {
    return "true";
  }

  static instance = new True();
}

export class False extends CrochetValue {
  get type() {
    return TCrochetFalse.type;
  }

  equals(other: CrochetValue): boolean {
    return other instanceof False;
  }

  as_bool() {
    return false;
  }

  to_js() {
    return false;
  }

  to_text() {
    return "false";
  }

  static instance = new False();
}

export class TCrochetBoolean extends CrochetType {
  readonly parent = TCrochetAny.type;
  readonly type_name = "boolean";

  coerce(x: CrochetValue): CrochetValue | null {
    return from_bool(x.as_bool());
  }

  static type = new TCrochetBoolean();
}

export class TCrochetTrue extends CrochetType {
  readonly parent = TCrochetBoolean.type;
  readonly type_name = "true";

  coerce(x: CrochetValue): CrochetValue | null {
    if (x.as_bool()) {
      return True.instance;
    } else {
      return null;
    }
  }

  static type = new TCrochetTrue();
}

export class TCrochetFalse extends CrochetType {
  readonly parent = TCrochetBoolean.type;
  readonly type_name = "false";

  coerce(x: CrochetValue): CrochetValue | null {
    if (!x.as_bool()) {
      return False.instance;
    } else {
      return null;
    }
  }

  static type = new TCrochetFalse();
}
