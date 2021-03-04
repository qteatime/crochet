import { CrochetType, TCrochetUnion } from "./types";
import { CrochetValue } from "./value";

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

export class TCrochetTrue extends CrochetType {
  readonly type_name = "true";

  accepts(x: any) {
    return x instanceof True;
  }

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
  readonly type_name = "false";

  accepts(x: any) {
    return x instanceof False;
  }

  coerce(x: CrochetValue): CrochetValue | null {
    if (!x.as_bool()) {
      return False.instance;
    } else {
      return null;
    }
  }

  static type = new TCrochetFalse();
}

export const boolean = new TCrochetUnion(TCrochetFalse.type, TCrochetTrue.type);
