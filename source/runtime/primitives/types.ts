import { CrochetValue } from "./value";

export abstract class CrochetType {
  abstract type_name: string;
  abstract accepts(x: any): boolean;

  coerce(x: CrochetValue): CrochetValue | null {
    if (this.accepts(x)) {
      return x;
    } else {
      return null;
    }
  }
}

export class CrochetRole {
  constructor(readonly name: string) {}
}

export class TCrochetAny extends CrochetType {
  readonly type_name = "any";

  accepts(x: any) {
    return x instanceof CrochetValue;
  }

  coerce(x: CrochetValue): CrochetValue | null {
    return x;
  }

  static type = new TCrochetAny();
}

export class TCrochetUnion extends CrochetType {
  constructor(readonly left: CrochetType, readonly right: CrochetType) {
    super();
  }

  get type_name() {
    return `${this.left.type_name} | ${this.right.type_name}`;
  }

  accepts(x: any) {
    return this.left.accepts(x) || this.right.accepts(x);
  }

  coerce(x: CrochetValue): CrochetValue | null {
    const lvalue = this.left.coerce(x);
    if (lvalue != null) {
      return lvalue;
    } else {
      return this.right.coerce(x);
    }
  }
}

export function type_name(x: any) {
  if (x instanceof CrochetValue) {
    return x.type.type_name;
  } else if (x instanceof CrochetType) {
    return x.type_name;
  } else {
    return `<host value: ${x?.name ?? typeof x}>`;
  }
}
