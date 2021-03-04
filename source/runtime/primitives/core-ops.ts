import { Value } from "../logic/constraint";
import { ErrUnexpectedType, Machine, _throw } from "../vm";
import { CrochetType } from "./types";
import { bfalse, btrue, CrochetRecord, CrochetValue } from "./value";

export function from_bool(x: boolean): CrochetValue {
  return x ? btrue : bfalse;
}

export async function* safe_cast(x: any, type: CrochetType): Machine {
  if (type.accepts(x)) {
    return x;
  } else {
    return yield _throw(new ErrUnexpectedType(type, x));
  }
}
