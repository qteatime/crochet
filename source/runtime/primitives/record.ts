import { ErrNoRecordKey } from "../vm";
import {
  CrochetType,
  TCrochetAny,
  CrochetValue,
  IProjection,
  ISelection,
  Selection,
} from "./0-core";

export class CrochetRecord extends CrochetValue {
  get type() {
    return TCrochetRecord.type;
  }

  constructor(readonly values: Map<string, CrochetValue>) {
    super();
  }

  equals(other: CrochetValue) {
    if (!(other instanceof CrochetRecord)) {
      return false;
    }
    const keys = new Set(this.values.keys());
    const other_keys = [...other.values.keys()];
    if (keys.size !== other_keys.length) {
      return false;
    }
    for (const key of other_keys) {
      if (!keys.has(key)) {
        return false;
      }
      if (!this.values.get(key)?.equals(other.values.get(key)!)) {
        return false;
      }
    }
    return true;
  }

  to_js() {
    const result = new Map();
    for (const [k, v] of this.values) {
      result.set(k, v.to_js());
    }
    return result;
  }

  to_json() {
    const result = Object.create(null);
    for (const [k, v] of this.values) {
      result[k] = v.to_json();
    }
    return result;
  }

  as_bool() {
    return true;
  }

  to_text() {
    return `[${[...this.values.entries()]
      .map(([k, v]) => `${k} -> ${v.to_text()}`)
      .join(", ")}]`;
  }

  get(key: string) {
    return this.values.get(key) ?? null;
  }

  _projection = new RecordProjection(this);
  _selection = new RecordSelection(this);
}

export class RecordProjection implements IProjection {
  constructor(readonly record: CrochetRecord) {}

  project(name: string): CrochetValue {
    const value = this.record.get(name);
    if (value == null) {
      throw new ErrNoRecordKey(this.record, name);
    }

    return value;
  }
}

export class RecordSelection implements ISelection {
  constructor(readonly record: CrochetRecord) {}

  select(selection: Selection[]): CrochetValue {
    const projection = this.record.projection;
    const result = new Map<string, CrochetValue>();
    for (const sel of selection) {
      result.set(sel.alias, projection.project(sel.key));
    }
    return new CrochetRecord(result);
  }
}

export class TCrochetRecord extends CrochetType {
  readonly parent = TCrochetAny.type;
  readonly type_name = "record";

  static type = new TCrochetRecord();
}
