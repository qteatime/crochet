import { ErrNoProjection, ErrNoSelection } from "../vm";
import { CrochetRole, CrochetType, type_name } from "./types";

export abstract class CrochetValue {
  abstract type: CrochetType;

  readonly _projection: IProjection | null = null;
  readonly _selection: ISelection | null = null;

  has_role(role: CrochetRole): boolean {
    return false;
  }

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
