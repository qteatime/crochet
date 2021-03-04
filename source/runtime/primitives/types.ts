import {
  bfalse,
  btrue,
  CrochetInstance,
  CrochetInteger,
  CrochetPartial,
  CrochetRecord,
  CrochetStream,
  CrochetText,
  CrochetUnknown,
  CrochetValue,
  CrochetVariant,
  False,
  True,
} from "./value";

export abstract class CrochetType {
  abstract type_name: string;
  abstract accepts(x: any): boolean;
  abstract coerce(x: CrochetValue): CrochetValue | null;
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
}

export class TCrochetInteger extends CrochetType {
  readonly type_name = "integer";

  accepts(x: any) {
    return x instanceof CrochetInteger;
  }

  coerce(x: CrochetValue): CrochetValue | null {
    if (x instanceof CrochetInteger) {
      return x;
    } else {
      return null;
    }
  }
}

export class TCrochetText extends CrochetType {
  readonly type_name = "text";

  accepts(x: any) {
    return x instanceof CrochetText;
  }

  coerce(x: CrochetValue): CrochetValue | null {
    if (x instanceof CrochetText) {
      return x;
    } else {
      return null;
    }
  }
}

export class TCrochetTrue extends CrochetType {
  readonly type_name = "true";

  accepts(x: any) {
    return x instanceof True;
  }

  coerce(x: CrochetValue): CrochetValue | null {
    if (x.as_bool()) {
      return btrue;
    } else {
      return null;
    }
  }
}

export class TCrochetFalse extends CrochetType {
  readonly type_name = "false";

  accepts(x: any) {
    return x instanceof False;
  }

  coerce(x: CrochetValue): CrochetValue | null {
    if (!x.as_bool()) {
      return bfalse;
    } else {
      return null;
    }
  }
}

export class TCrochetStream extends CrochetType {
  readonly type_name = "stream";

  accepts(x: any) {
    return x instanceof CrochetStream;
  }

  coerce(x: CrochetValue): CrochetValue | null {
    if (x instanceof CrochetStream) {
      return x;
    } else if (x instanceof False) {
      return null;
    } else {
      return new CrochetStream([x]);
    }
  }
}

export class TCrochetRecord extends CrochetType {
  readonly type_name = "record";

  accepts(x: any) {
    return x instanceof CrochetRecord;
  }

  coerce(x: CrochetValue): CrochetValue | null {
    if (x instanceof CrochetRecord) {
      return x;
    } else {
      return null;
    }
  }
}

export class TCrochetUnknown extends CrochetType {
  readonly type_name = "unknown";

  accepts(x: any) {
    return x instanceof CrochetUnknown;
  }

  coerce(x: CrochetValue): CrochetValue | null {
    if (x instanceof CrochetUnknown) {
      return x;
    } else {
      return new CrochetUnknown(x);
    }
  }
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

export class TCrochetType extends CrochetType {
  private instance_count = 0n;

  constructor(readonly name: string, readonly roles: Set<CrochetRole>) {
    super();
  }

  get type_name() {
    return this.name;
  }

  instantiate() {
    return new CrochetInstance(this, ++this.instance_count);
  }

  accepts(x: any) {
    return x instanceof CrochetInstance && x.type === this;
  }

  coerce(x: CrochetValue): CrochetValue | null {
    if (this.accepts(x)) {
      return x;
    } else {
      return null;
    }
  }
}

export class TCrochetEnum extends CrochetType {
  private variants: { [key: string]: CrochetVariant } = {};

  constructor(readonly name: string) {
    super();
  }

  add_variant(name: string, roles: CrochetRole[]) {
    if (name in this.variants) {
      throw new Error(`internal: duplicate variant ${name} in ${this.name}`);
    }
    const variant = new CrochetVariant(this, name, new Set(roles));
    this.variants[name] = variant;
  }

  get_variant(name: string): CrochetVariant {
    const variant = this.variants[name];
    if (variant == null) {
      throw new Error(`internal: unknown variant ${name} for ${this.name}`);
    }
    return variant;
  }

  get type_name() {
    return this.name;
  }

  accepts(x: any) {
    return x instanceof CrochetVariant && x.type === this;
  }

  coerce(x: CrochetValue): CrochetValue | null {
    if (this.accepts(x)) {
      return x;
    } else {
      return null;
    }
  }
}

export class TCrochetPartial extends CrochetType {
  constructor(readonly name: string) {
    super();
  }

  get type_name() {
    return `<partial ${this.name}>`;
  }

  accepts(x: any) {
    return x instanceof CrochetPartial && this.name === x.name;
  }

  coerce(x: CrochetValue): CrochetValue | null {
    if (this.accepts(x)) {
      return x;
    } else {
      return null;
    }
  }
}

export class TAnyCrochetPartial extends CrochetType {
  get type_name() {
    return "<partial>";
  }

  accepts(x: any) {
    return x instanceof CrochetPartial;
  }

  coerce(x: CrochetValue): CrochetValue | null {
    if (this.accepts(x)) {
      return x;
    } else {
      return null;
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

export const tAny = new TCrochetAny();
export const tInteger = new TCrochetInteger();
export const tText = new TCrochetText();
export const tTrue = new TCrochetTrue();
export const tFalse = new TCrochetFalse();
export const tStream = new TCrochetStream();
export const tRecord = new TCrochetRecord();
export const tUnknown = new TCrochetUnknown();
export const tAnyPartial = new TAnyCrochetPartial();
