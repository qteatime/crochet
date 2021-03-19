import { Action } from "./event";
import {
  CrochetRecord,
  CrochetText,
  CrochetType,
  CrochetUnknown,
  CrochetValue,
  TCrochetAny,
} from "../primitives";
import { Machine } from "../vm";

export class ActionChoice extends CrochetValue {
  constructor(
    readonly title: CrochetValue,
    readonly score: number,
    readonly action: Action,
    readonly machine: Machine
  ) {
    super();
  }

  get type() {
    return TActionChoice.type;
  }

  as_record() {
    return new CrochetRecord(
      new Map<string, CrochetValue>([
        ["Title", this.title],
        ["Action", new CrochetUnknown(this.action)],
      ])
    );
  }

  readonly _projection = this.as_record().projection;
  readonly _selection = this.as_record().selection;
}

export class TActionChoice extends CrochetType {
  readonly parent = TCrochetAny.type;
  readonly type_name = "action-choice";
  static type = new TActionChoice();
}
