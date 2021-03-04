import { every, zip } from "../../utils/utils";
import { False } from "./boolean";
import { CrochetType } from "./types";
import { CrochetValue, IProjection, ISelection, Selection } from "./value";

export class CrochetStream extends CrochetValue {
  get type() {
    return TCrochetStream.type;
  }

  constructor(readonly values: CrochetValue[]) {
    super();
  }

  equals(other: CrochetValue): boolean {
    return (
      other instanceof CrochetStream &&
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

  _projection = new StreamProjection(this);
  _selection = new StreamSelection(this);
}

export class StreamProjection implements IProjection {
  constructor(readonly stream: CrochetStream) {}

  project(name: string): CrochetValue {
    const result = [];
    for (const value of this.stream.values) {
      result.push(value.projection.project(name));
    }
    return new CrochetStream(result);
  }
}

export class StreamSelection implements ISelection {
  constructor(readonly stream: CrochetStream) {}

  select(selections: Selection[]) {
    const result = [];
    for (const value of this.stream.values) {
      result.push(value.selection.select(selections));
    }
    return new CrochetStream(result);
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

  static type = new TCrochetStream();
}
