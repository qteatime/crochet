import {
  CrochetInstance,
  CrochetInteger,
  CrochetRecord,
  CrochetStream,
  CrochetText,
  CrochetValue,
  CrochetVariant,
  False,
  True,
} from "./value";

export abstract class CrochetType {
  abstract type_name: string;
  abstract accepts(x: any): boolean;
}

export class CrochetRole {
  constructor(readonly name: string) {}
}

export const tAny = new (class TCrochetAny extends CrochetType {
  readonly type_name = "any";
  accepts(x: any) {
    return x instanceof CrochetValue;
  }
})();

export const tInteger = new (class TCrochetInteger extends CrochetType {
  readonly type_name = "integer";
  accepts(x: any) {
    return x instanceof CrochetInteger;
  }
})();

export const tText = new (class TCrochetText extends CrochetType {
  readonly type_name = "text";
  accepts(x: any) {
    return x instanceof CrochetText;
  }
})();

export const tTrue = new (class TCrochetTrue extends CrochetType {
  readonly type_name = "true";
  accepts(x: any) {
    return x instanceof True;
  }
})();

export const tFalse = new (class TCrochetFalse extends CrochetType {
  readonly type_name = "false";
  accepts(x: any) {
    return x instanceof False;
  }
})();

export const tStream = new (class TCrochetStream extends CrochetType {
  readonly type_name = "stream";
  accepts(x: any) {
    return x instanceof CrochetStream;
  }
})();

export const tRecord = new (class TCrochetRecord extends CrochetType {
  readonly type_name = "record";
  accepts(x: any) {
    return x instanceof CrochetRecord;
  }
})();

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
}

export class TCrochetType extends CrochetType {
  constructor(readonly name: string, readonly roles: CrochetRole[]) {
    super();
  }

  get type_name() {
    return this.name;
  }

  accepts(x: any) {
    return x instanceof CrochetInstance && x.type === this;
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
    const variant = new CrochetVariant(this, name, roles);
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
}
