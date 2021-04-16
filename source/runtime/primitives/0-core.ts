import { ErrArbitrary, ErrNoProjection, ErrNoSelection } from "../vm";

export abstract class CrochetValue {
  abstract type: CrochetType;

  readonly _projection: IProjection | null = null;
  readonly _selection: ISelection | null = null;

  as_bool(): boolean {
    return true;
  }

  to_js(): any {
    return this;
  }

  equals(other: CrochetValue): boolean {
    return other === this;
  }

  not_equals(other: CrochetValue): boolean {
    return !this.equals(other);
  }

  to_text(transparent?: boolean): string {
    return `<${type_name(this.type)}>`;
  }

  to_debug_text(transparent?: boolean): string {
    return this.to_text(transparent);
  }

  to_json(): any {
    throw new ErrArbitrary(
      "unsupported",
      `Unsupported by ${type_name(this.type)}`
    );
  }

  get projection(): IProjection {
    const projection = this._projection;
    if (!projection) {
      throw new ErrNoProjection(this);
    } else {
      return projection;
    }
  }

  get selection(): ISelection {
    const selection = this._selection;
    if (!selection) {
      throw new ErrNoSelection(this);
    } else {
      return selection;
    }
  }
}

export interface IProjection {
  project(name: string): CrochetValue;
}

export interface ISelection {
  select(selections: Selection[]): CrochetValue;
}

export type Selection = {
  key: string;
  alias: string;
};

export abstract class CrochetType {
  abstract type_name: string;
  abstract parent: CrochetType | null;
  private _static_type: CrochetTypeInstance | null = null;

  get static_type(): CrochetTypeInstance {
    if (this._static_type == null) {
      const type = new CrochetTypeInstance(this);
      this._static_type = type;
      return type;
    } else {
      return this._static_type;
    }
  }

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

export class TCrochetTypeInstance extends CrochetType {
  get type_name() {
    return `#${this.type}`;
  }

  get parent() {
    return TCrochetAny.type;
  }

  constructor(readonly type: string) {
    super();
  }
}

export class CrochetTypeInstance extends CrochetValue {
  readonly type: CrochetType;

  constructor(readonly type_wrapped: CrochetType) {
    super();
    this.type = new TCrochetTypeInstance(this.type_wrapped.type_name);
  }
}

export class TCrochetAny extends CrochetType {
  readonly type_name = "any";
  readonly parent = null;

  coerce(x: CrochetValue): CrochetValue | null {
    return x;
  }

  static type = new TCrochetAny();
}

export class TCrochetNothing extends CrochetType {
  readonly type_name = "nothing";
  readonly parent = TCrochetAny.type;
  static type = new TCrochetNothing();
}

export class CrochetNothing extends CrochetValue {
  get type() {
    return TCrochetNothing.type;
  }

  as_bool() {
    return false;
  }

  to_text() {
    return "nothing";
  }

  to_json() {
    return null;
  }

  static instance = new CrochetNothing();
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
