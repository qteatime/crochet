import { CrochetValue } from "./value";
import { CrochetType, CrochetRole, TCrochetAny } from "./types";

export class TCrochetEnum extends CrochetType {
  readonly parent = TCrochetAny.type;
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
}

export class CrochetVariant extends CrochetValue {
  constructor(
    readonly type: TCrochetEnum,
    readonly tag: string,
    readonly roles: Set<CrochetRole>
  ) {
    super();
  }

  has_role(role: CrochetRole): boolean {
    return this.roles.has(role);
  }

  equals(other: CrochetValue): boolean {
    return (
      other instanceof CrochetVariant &&
      other.type === this.type &&
      other.tag === this.tag
    );
  }

  to_text() {
    return `${this.type.type_name}.${this.tag}`;
  }
}
