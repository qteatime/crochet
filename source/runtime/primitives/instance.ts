import { zip } from "../../utils/utils";
import { generated_node, Metadata } from "../ir";
import { CrochetModule, die, ErrArbitrary } from "../vm";
import {
  CrochetType,
  TCrochetAny,
  CrochetValue,
  IProjection,
  ISelection,
  Selection,
  type_name,
} from "./0-core";
import { CrochetRecord } from "./record";

export class CrochetInstance extends CrochetValue {
  constructor(
    readonly type: TCrochetType,
    readonly id: bigint,
    readonly data: CrochetValue[]
  ) {
    super();
  }

  equals(other: CrochetValue): boolean {
    return other === this;
  }

  to_text() {
    return `<${this.type.type_name}>`;
  }

  to_debug_text(transparent?: boolean) {
    const fields = this.data
      .map((x) => x.to_debug_text(transparent))
      .join(", ");
    return `<${this.type.type_name}(${fields})>`;
  }

  as_record() {
    const data = new Map(zip(this.type.fields, this.data));
    return new CrochetRecord(data);
  }

  get_field(name: string) {
    const value = this.data[this.type.layout.get(name) ?? -1];
    if (!value) {
      throw die(`The field ${name} does not exist in ${type_name(this.type)}`);
    }
    return value;
  }

  readonly _projection = new InstanceProjection(this);
  readonly _selection = new InstanceSelection(this);
}

export class InstanceProjection implements IProjection {
  constructor(readonly instance: CrochetInstance) {}

  project(name: string, requestee_module: CrochetModule | null) {
    if (
      requestee_module === null ||
      requestee_module.pkg.name !== this.instance.type.module?.pkg.name
    ) {
      throw new ErrArbitrary(
        "no-projection-capability",
        `Cannot directly project ${name} from ${
          this.instance.type.type_name
        } outside of its declaring package ${
          this.instance.type.module?.pkg.name ?? "no package"
        }`
      );
    }
    return this.instance.get_field(name);
  }
}

export class InstanceSelection implements ISelection {
  constructor(readonly instance: CrochetInstance) {}

  select(selections: Selection[], requestee_module: CrochetModule | null) {
    if (
      requestee_module === null ||
      requestee_module.pkg.name !== this.instance.type.module?.pkg.name
    ) {
      throw new ErrArbitrary(
        "no-projection-capability",
        `Cannot directly project ${name} from ${
          this.instance.type.type_name
        } outside of its declaring package ${
          this.instance.type.module?.pkg.name ?? "no package"
        }`
      );
    }
    return this.instance
      .as_record()
      .selection.select(selections, requestee_module);
  }
}

export class TCrochetType extends CrochetType {
  private instance_count = 0n;
  private subtypes = new Set<TCrochetType>();
  private instances = new Set<CrochetInstance>();
  private sealed = false;

  constructor(
    readonly module: CrochetModule | null,
    readonly meta: Metadata,
    readonly parent: CrochetType,
    readonly name: string,
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
      throw die(
        `${this.type_name} expects ${this.types.length} arguments, but got ${data.length}`
      );
    }

    for (const [v, type] of zip(data, this.types)) {
      if (!type.accepts(v)) {
        throw die(
          `Invalid type: expected ${type.type_name}, got ${type_name(v)}`
        );
      }
    }
  }

  instantiate(data: CrochetValue[]) {
    if (this.sealed) {
      throw die(`attempting to construct a sealed type: ${this.name}`);
    }

    this.validate(data);
    return new CrochetInstance(this, ++this.instance_count, data);
  }

  register_subtype(type: TCrochetType) {
    this.subtypes.add(type);
  }

  register_instance(value: CrochetInstance) {
    if (!this.accepts(value)) {
      throw die(
        `invalid value ${type_name(value)} for type ${type_name(this)}`
      );
    }
    this.instances.add(value);
  }

  get registered_instances(): CrochetInstance[] {
    const sub_instances = [...this.subtypes].flatMap(
      (x) => x.registered_instances
    );
    return [...this.instances, ...sub_instances];
  }

  seal() {
    this.sealed = true;
  }

  get documentation() {
    return this.meta.doc;
  }
}

export const baseEnum = new TCrochetType(
  null,
  generated_node,
  TCrochetAny.type,
  "enum",
  [],
  [],
  new Map()
);

baseEnum.seal();
