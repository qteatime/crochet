import { ErrNoProjection, ErrNoSelection } from "../vm";
import { CrochetRole, CrochetType } from "./types";

export abstract class CrochetValue {
  abstract type: CrochetType;
  abstract equals(other: CrochetValue): boolean;
  abstract to_text(transparent?: boolean): string;

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
