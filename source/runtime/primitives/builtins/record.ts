import { copy_map } from "../../../utils";
import { ErrNoRecordKey, Machine, State, _throw } from "../../vm";
import {
  foreign,
  foreign_namespace,
  machine,
} from "../../world/ffi-decorators";
import {
  CrochetInteger,
  CrochetRecord,
  CrochetStream,
  CrochetText,
  CrochetValue,
} from "../value";

@foreign_namespace("crochet.record")
export class Record {
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

  @foreign("at")
  static async *crochet_at(
    state: State,
    record: CrochetRecord,
    key: CrochetText
  ): Machine {
    const value = Record.at(record, key);
    if (value == null) {
      return yield _throw(new ErrNoRecordKey(record, key.value));
    } else {
      return value;
    }
  }

  @foreign("at-put")
  @machine()
  static at_put(record: CrochetRecord, key: CrochetText, value: CrochetValue) {
    const result = new Map<string, CrochetValue>();
    copy_map(record.values, result);
    result.set(key.value, value);
    return new CrochetRecord(result);
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
