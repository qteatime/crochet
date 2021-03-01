import { bfalse, btrue, CrochetValue } from "./value";

export function from_bool(x: boolean): CrochetValue {
  return x ? btrue : bfalse;
}
