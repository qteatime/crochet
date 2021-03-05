import { CrochetValue } from "./value";

export abstract class CrochetType {
  abstract type_name: string;
  abstract parent: CrochetType | null;

  accepts(x: CrochetValue): boolean {
    return x.type.is_subtype(this);
  }

  is_subtype(type: CrochetType): boolean {
    if (this === type) {
      return true;
    } else if (this.parent != null) {
      return this.parent.is_subtype(type);
    } else {
      return false;
    }
  }

  distance(): number {
    if (this.parent == null) {
      return 0;
    } else {
      return -1 + this.parent.distance();
    }
  }

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
  readonly parent = null;

  coerce(x: CrochetValue): CrochetValue | null {
    return x;
  }

  static type = new TCrochetAny();
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
