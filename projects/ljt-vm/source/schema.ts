/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Op } from "./ast";
import { unreachable } from "./util";

export class Schema {
  readonly entities = new Map<number, Entity>();

  constructor(readonly magic: Uint8Array, readonly version: number) {}

  add(entity: Entity) {
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

  max_size_of(id: number) {
    const entity = this.resolve(id);
    if (entity instanceof Union) {
      return size_of_operation(this, { op: "union", id });
    } else if (entity instanceof Record) {
      return size_of_operation(this, { op: "record", id });
    } else {
      throw new Error(`Invalid entity id ${id}`);
    }
  }
}

export abstract class Entity {
  abstract id: number;
  abstract name: string;
  abstract find_version(data: unknown): unknown | null;
  abstract max_byte_size(schema: Schema): number | null;
}

export class Union extends Entity {
  constructor(readonly id: number, readonly name: string, readonly versions: VersionedUnion[]) {
    super();
  }

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

  max_byte_size(schema: Schema) {
    return this.versions.map((x) => x.max_byte_size(schema)).reduce(max_size, 0);
  }
}

export class VersionedUnion {
  constructor(
    readonly id: number,
    readonly version: number,
    readonly name: string,
    readonly variants: Variant[]
  ) {}

  variant(v: number) {
    if (v < 0 || v >= this.variants.length) {
      throw new Error(`Invalid variant for ${this.name}(${this.id}): ${v}`);
    }
    return this.variants[v];
  }

  reify(value: { [key: string]: unknown }) {
    value["@id"] = this.id;
    value["@version"] = this.version;
    value["@name"] = this.name;
    return value;
  }

  accepts(data: { [key: string]: unknown }) {
    const tag = data["@variant"];
    if (typeof tag !== "number" || tag < 0 || tag >= this.variants.length) {
      return false;
    }
    const variant = this.variants[tag];
    return variant.accepts(data);
  }

  max_byte_size(schema: Schema) {
    return this.variants.map((x) => x.byte_size(schema)).reduce(max_size, 0);
  }
}

export class Variant {
  constructor(readonly name: string, readonly tag: number, readonly fields: [string, Op][]) {}

  reify(value: { [key: string]: unknown }) {
    value["@variant"] = this.tag;
    value["@variant-name"] = this.name;
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

  byte_size(schema: Schema) {
    return this.fields.map(([_, op]) => size_of_operation(schema, op)).reduce(add_size, 0);
  }
}

export class Record extends Entity {
  constructor(readonly id: number, readonly name: string, readonly versions: VersionedRecord[]) {
    super();
  }

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

  max_byte_size(schema: Schema): number | null {
    return this.versions.map((x) => x.byte_size(schema)).reduce(max_size, 0);
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

  byte_size(schema: Schema) {
    return this.fields.map(([_, op]) => size_of_operation(schema, op)).reduce(add_size, 0);
  }
}

function size_of_operation(schema: Schema, op: Op): number | null {
  switch (op.op) {
    case "bool":
      return 1;
    case "int8":
      return 1;
    case "int16":
      return 2;
    case "int32":
      return 4;
    case "int64":
      return 8;
    case "uint8":
      return 1;
    case "uint16":
      return 2;
    case "uint32":
      return 4;
    case "uint64":
      return 8;
    case "integer":
      return null;
    case "float32":
      return 4;
    case "float64":
      return 4;
    case "text":
      return null;
    case "bytes":
      return null;
    case "constant":
      return op.value.byteLength;
    case "array":
      return null;
    case "map":
      return null;
    case "optional":
      return add_size(1, size_of_operation(schema, op.value));
    case "record":
      // tag + version + packed fields
      return add_size(4 + 4, schema.resolve(op.id).max_byte_size(schema));
    case "union":
      // tag + version + variant + packed variant fields
      return add_size(4 + 4 + 4, schema.resolve(op.id).max_byte_size(schema));
    default:
      throw unreachable(op, "invalid operation");
  }
}

function add_size(x: number | null, y: number | null) {
  if (x == null || y == null) {
    return null;
  } else {
    return x + y;
  }
}

function max_size(x: number | null, y: number | null) {
  if (x == null || y == null) {
    return null;
  } else {
    return Math.max(x, y);
  }
}
