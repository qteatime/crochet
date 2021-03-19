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
  _throw,
} from "../../runtime";
import { copy_map } from "../../utils";

@foreign_namespace("crochet.native.record")
export class RecordFfi {
  static at(record: CrochetRecord, key: CrochetText) {
    return record.values.get(key.value);
  }

  @foreign()
  @machine()
  static merge(l: CrochetRecord, r: CrochetRecord) {
    const map = new Map<string, CrochetValue>();
    copy_map(l.values, map);
    copy_map(r.values, map);
    return new CrochetRecord(map);
  }

  @foreign()
  @machine()
  static keys(record: CrochetRecord) {
    return new CrochetStream(
      [...record.values.keys()].map((x) => new CrochetText(x))
    );
  }

  @foreign()
  @machine()
  values(record: CrochetRecord) {
    return new CrochetStream([...record.values.values()]);
  }

  @foreign()
  @machine()
  count(record: CrochetRecord) {
    return new CrochetInteger(BigInt(record.values.size));
  }
}
