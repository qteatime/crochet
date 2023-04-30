import { Op } from "./ast";
import * as T from "./ext/object-spec";
import { Record, Schema, VersionedRecord } from "./schema";

const top: (_: any) => Op = T.tagged_choice<Op, Op["op"]>("op", {
  bool: T.spec({ op: T.constant("bool" as const) }),
  int8: T.spec({ op: T.constant("int8" as const) }),
  int16: T.spec({ op: T.constant("int16" as const) }),
  int32: T.spec({ op: T.constant("int32" as const) }),
  uint8: T.spec({ op: T.constant("uint8" as const) }),
  uint16: T.spec({ op: T.constant("uint16" as const) }),
  uint32: T.spec({ op: T.constant("uint32" as const) }),
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
  tuple: T.spec({
    op: T.constant("tuple" as const),
    fields: T.seq2(
      T.list_of(T.spec({ name: T.str, type: T.lazy((x) => top(x)) })),
      (xs) => xs.map((x) => [x.name, x.type] as [string, Op])
    ),
  }),
  "tagged-choice": T.spec({
    op: T.constant("tagged-choice" as const),
    mapping: T.seq2(
      T.list_of(T.spec({ tag: T.int, type: T.lazy((x) => top(x)) })),
      (xs) => new Map(xs.map((x) => [x.tag, x.type] as const))
    ),
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
  name: T.str,
  id: T.int,
  versions: T.list_of(trecord_version),
});

const tschema = T.spec({
  magic: T.seq2(T.list_of(T.byte), (x) => new Uint8Array(x)),
  version: T.int,
  records: T.list_of(trecord),
});

export function parse(json: unknown) {
  const schema0 = T.parse(tschema, json);
  const schema = new Schema(schema0.magic, schema0.version);
  for (const record0 of schema0.records) {
    const versions: VersionedRecord[] = [];
    const record = new Record(record0.id, record0.name, versions);
    let version_id = 0;
    for (const version of record0.versions) {
      versions.push(
        new VersionedRecord(
          record.id,
          version_id,
          record.name,
          version.fields.map((x) => [x.name, x.type])
        )
      );
      version_id += 1;
    }
  }
  return schema;
}
