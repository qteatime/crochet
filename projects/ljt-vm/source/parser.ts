/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Op } from "./ast";
import * as T from "./deps/object-spec";
import { Record, Schema, Union, Variant, VersionedRecord, VersionedUnion } from "./schema";
import { enumerate, unreachable } from "./util";

const top: (_: any) => Op = T.tagged_choice<Op, Op["op"]>("op", {
  bool: T.spec({ op: T.constant("bool" as const) }),
  int8: T.spec({ op: T.constant("int8" as const) }),
  int16: T.spec({ op: T.constant("int16" as const) }),
  int32: T.spec({ op: T.constant("int32" as const) }),
  int64: T.spec({ op: T.constant("int64" as const) }),
  uint8: T.spec({ op: T.constant("uint8" as const) }),
  uint16: T.spec({ op: T.constant("uint16" as const) }),
  uint32: T.spec({ op: T.constant("uint32" as const) }),
  uint64: T.spec({ op: T.constant("uint64" as const) }),
  integer: T.spec({ op: T.constant("integer" as const) }),
  float32: T.spec({ op: T.constant("float32" as const) }),
  float64: T.spec({ op: T.constant("float64" as const) }),
  text: T.spec({ op: T.constant("text" as const) }),
  bytes: T.spec({ op: T.constant("bytes" as const) }),
  constant: T.spec({
    op: T.constant("constant" as const),
    value: T.seq2(T.list_of(T.byte), (x) => new Uint8Array(x)),
  }),
  array: T.spec({
    op: T.constant("array" as const),
    items: T.lazy((x) => top(x)),
  }),
  map: T.spec({
    op: T.constant("map" as const),
    keys: T.lazy((x) => top(x)),
    values: T.lazy((x) => top(x)),
  }),
  optional: T.spec({
    op: T.constant("optional" as const),
    value: T.lazy((x) => top(x)),
  }),
  record: T.spec({
    op: T.constant("record" as const),
    id: T.int,
  }),
  union: T.spec({
    op: T.constant("union" as const),
    id: T.int,
  }),
});

const trecord_field = T.spec({
  name: T.str,
  type: top,
});

const trecord_version = T.spec({
  fields: T.list_of(trecord_field),
});

const trecord = T.spec({
  type: T.constant("record" as const),
  name: T.str,
  id: T.int,
  versions: T.list_of(trecord_version),
});

const tvariant = T.spec({
  name: T.str,
  fields: T.list_of(trecord_field),
});

const tunion_version = T.spec({
  variants: T.list_of(tvariant),
});

const tunion = T.spec({
  type: T.constant("union" as const),
  name: T.str,
  id: T.int,
  versions: T.list_of(tunion_version),
});

type Entity = ReturnType<typeof tunion> | ReturnType<typeof trecord>;

const tentity = T.tagged_choice<Entity, Entity["type"]>("type", {
  record: trecord,
  union: tunion,
});

const tschema = T.spec({
  magic: T.seq2(T.list_of(T.byte), (x) => new Uint8Array(x)),
  version: T.int,
  entities: T.list_of(tentity),
});

export function parse(json: unknown) {
  const schema0 = T.parse(tschema, json);
  const schema = new Schema(schema0.magic, schema0.version);
  for (const entity0 of schema0.entities) {
    const entity = reify_entity(entity0);
    schema.add(entity);
  }
  return schema;
}

function reify_entity(entity: Entity) {
  switch (entity.type) {
    case "record":
      return reify_record(entity);
    case "union":
      return reify_union(entity);
    default:
      throw unreachable(entity, `Entity`);
  }
}

function reify_record(record0: ReturnType<typeof trecord>) {
  const versions: VersionedRecord[] = [];
  const record = new Record(record0.id, record0.name, versions);
  for (const [version_id, version] of enumerate(record0.versions)) {
    versions.push(
      new VersionedRecord(
        record.id,
        version_id,
        record.name,
        version.fields.map((x) => [x.name, x.type])
      )
    );
  }
  return record;
}

function reify_union(union0: ReturnType<typeof tunion>) {
  const versions: VersionedUnion[] = [];
  const union = new Union(union0.id, union0.name, versions);
  for (const [version_id, version] of enumerate(union0.versions)) {
    const variants: Variant[] = [];
    versions.push(new VersionedUnion(union.id, version_id, union.name, variants));
    for (const [tag, variant] of enumerate(version.variants)) {
      variants.push(
        new Variant(
          variant.name,
          tag,
          variant.fields.map((x) => [x.name, x.type])
        )
      );
    }
  }
  return union;
}
