import { bfalse, btrue, CrochetValue } from "./value";

export function and(l: CrochetValue, r: CrochetValue) {
  if (l.as_bool()) {
    return r;
  } else {
    return l;
  }
}

export function or(l: CrochetValue, r: CrochetValue) {
  if (l.as_bool()) {
    return l;
  } else {
    return r;
  }
}

export function from_bool(x: boolean): CrochetValue {
  return x ? btrue : bfalse;
}

export function not(x: CrochetValue) {
  return from_bool(x.as_bool());
}