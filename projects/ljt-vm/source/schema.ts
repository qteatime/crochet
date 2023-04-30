import { Op } from "./ast";

export class Schema {
  readonly entities = new Map<number, Record>();

  constructor(readonly magic: Uint8Array, readonly version: number) {}

  add(entity: Record) {
    if (this.entities.has(entity.id)) {
      throw new Error(`Duplicated entity ${entity.id}`);
    }
    this.entities.set(entity.id, entity);
  }

  resolve(id: number) {
    const entity = this.entities.get(id);
    if (entity == null) {
      throw new Error(`Undefined entity ${id}`);
    }
    return entity;
  }
}

export class Record {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly versions: VersionedRecord[]
  ) {}

  version(v: number) {
    if (v < 0 || v >= this.versions.length) {
      throw new Error(`Invalid version for ${this.name}(${this.id}): ${v}`);
    }
    return this.versions[v];
  }

  find_version(data: { [key: string]: unknown }) {
    for (let i = this.versions.length - 1; i >= 0; --i) {
      const version = this.versions[i];
      if (version.accepts(data)) {
        return version;
      }
    }
    throw new Error(`No version of ${this.name}(${this.id}) matched`);
  }
}

export class VersionedRecord {
  constructor(
    readonly id: number,
    readonly version: number,
    readonly name: string,
    readonly fields: [string, Op][]
  ) {}

  reify(value: { [key: string]: unknown }) {
    value["@id"] = this.id;
    value["@version"] = this.version;
    value["@name"] = this.name;
    return value;
  }

  accepts(data: { [key: string]: unknown }) {
    for (const [field, _] of this.fields) {
      if (!(field in data)) {
        return false;
      }
    }
    return true;
  }
}
