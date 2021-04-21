import { every, zip } from "../../utils/utils";
import { CrochetModule } from "../vm";
import {
  CrochetType,
  TCrochetAny,
  CrochetValue,
  IProjection,
  ISelection,
  Selection,
} from "./0-core";
import { False } from "./boolean";

export class CrochetTuple extends CrochetValue {
  get type() {
    return TCrochetTuple.type;
  }

  constructor(readonly values: CrochetValue[]) {
    super();
  }

  equals(other: CrochetValue): boolean {
    return (
      other instanceof CrochetTuple &&
      other.values.length === this.values.length &&
      every(zip(other.values, this.values), ([a, b]) => a.equals(b))
    );
  }

  as_bool() {
    return this.values.length > 0;
  }

  to_js() {
    return this.values.map((x) => x.to_js());
  }

  to_text() {
    return `[${this.values.map((x) => x.to_text()).join(", ")}]`;
  }

  to_json() {
    return this.values.map((x) => x.to_json());
  }

  _projection = new TupleProjection(this);
  _selection = new TupleSelection(this);
}

export class TupleProjection implements IProjection {
  constructor(readonly stream: CrochetTuple) {}

  project(name: string, requestee: CrochetModule | null): CrochetValue {
    const result = [];
    for (const value of this.stream.values) {
      result.push(value.projection.project(name, requestee));
    }
    return new CrochetTuple(result);
  }
}

export class TupleSelection implements ISelection {
  constructor(readonly stream: CrochetTuple) {}

  select(selections: Selection[], requestee: CrochetModule | null) {
    const result = [];
    for (const value of this.stream.values) {
      result.push(value.selection.select(selections, requestee));
    }
    return new CrochetTuple(result);
  }
}

export class TCrochetTuple extends CrochetType {
  readonly parent = TCrochetAny.type;
  readonly type_name = "tuple";

  coerce(x: CrochetValue): CrochetValue | null {
    if (x instanceof CrochetTuple) {
      return x;
    } else if (x instanceof False) {
      return null;
    } else {
      return new CrochetTuple([x]);
    }
  }

  static type = new TCrochetTuple();
}
