import { zip } from "../../utils";
import { CrochetRecord } from "./record";
import { CrochetRole, CrochetType, type_name } from "./types";
import { CrochetValue, IProjection, ISelection, Selection } from "./value";

export class CrochetInstance extends CrochetValue {
  constructor(
    readonly type: TCrochetType,
    readonly id: bigint,
    readonly data: CrochetValue[]
  ) {
    super();
  }

  has_role(role: CrochetRole): boolean {
    return this.type.roles.has(role);
  }

  equals(other: CrochetValue): boolean {
    return other === this;
  }

  to_text() {
    const fields = this.data.map((x) => x.to_text()).join(", ");
    return `<${this.type.type_name}#${this.id}(${fields})>`;
  }

  as_record() {
    const data = new Map(zip(this.type.fields, this.data));
    return new CrochetRecord(data);
  }

  get_field(name: string) {
    const value = this.data[this.type.layout.get(name) ?? -1];
    if (!value) {
      throw new Error(`Invalid field ${name}`);
    }
    return value;
  }

  readonly _projection = new InstanceProjection(this);
  readonly _selection = new InstanceSelection(this);
}

export class InstanceProjection implements IProjection {
  constructor(readonly instance: CrochetInstance) {}

  project(name: string) {
    return this.instance.get_field(name);
  }
}

export class InstanceSelection implements ISelection {
  constructor(readonly instance: CrochetInstance) {}

  select(selections: Selection[]) {
    return this.instance.as_record().selection.select(selections);
  }
}

export class TCrochetType extends CrochetType {
  private instance_count = 0n;

  constructor(
    readonly name: string,
    readonly roles: Set<CrochetRole>,
    readonly types: CrochetType[],
    readonly fields: string[],
    readonly layout: Map<string, number>
  ) {
    super();
  }

  get type_name() {
    return this.name;
  }

  validate(data: CrochetValue[]) {
    if (data.length !== this.types.length) {
      throw new Error(`Invalid data`);
    }

    for (const [v, type] of zip(data, this.types)) {
      if (!type.accepts(v)) {
        throw new Error(
          `Invalid type: expected ${type.type_name}, got ${type_name(v)}`
        );
      }
    }
  }

  instantiate(data: CrochetValue[]) {
    this.validate(data);
    return new CrochetInstance(this, ++this.instance_count, data);
  }

  accepts(x: any) {
    return x instanceof CrochetInstance && x.type === this;
  }
}
