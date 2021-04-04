import {
  CrochetInteger,
  CrochetRecord,
  CrochetStream,
  CrochetText,
  CrochetValue,
  cvalue,
  ErrNoRecordKey,
  foreign,
  foreign_namespace,
  Machine,
  machine,
  State,
  _push,
} from "../../runtime";
import { cast, copy_map } from "../../utils";

@foreign_namespace("crochet.core:record")
export class RecordFfi {
  static at(record: CrochetRecord, key: CrochetText) {
    return record.values.get(key.value);
  }

  @foreign()
  @machine()
  static merge(l0: CrochetValue, r0: CrochetValue) {
    const l = cast(l0, CrochetRecord);
    const r = cast(r0, CrochetRecord);

    const map = new Map<string, CrochetValue>();
    copy_map(l.values, map);
    copy_map(r.values, map);
    return new CrochetRecord(map);
  }

  @foreign()
  @machine()
  static keys(record0: CrochetValue) {
    const record = cast(record0, CrochetRecord);

    return new CrochetStream(
      [...record.values.keys()].map((x) => new CrochetText(x))
    );
  }

  @foreign()
  @machine()
  values(record0: CrochetValue) {
    const record = cast(record0, CrochetRecord);

    return new CrochetStream([...record.values.values()]);
  }

  @foreign()
  @machine()
  count(record0: CrochetValue) {
    const record = cast(record0, CrochetRecord);

    return new CrochetInteger(BigInt(record.values.size));
  }
}

export default [RecordFfi];
