import * as Util from "util";
import { type_name } from "../runtime";
import { AnyClass } from "./types";

export function unreachable(x: never, message: string) {
  console.error(message, x);
  throw new Error(message);
}

export function show(x: any) {
  return Util.inspect(x, false, null, true);
}

export function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
}

export function cast<T extends Function & { prototype: any }>(
  x: any,
  type: T
): T["prototype"] {
  if (x instanceof type) {
    return x as any;
  } else {
    throw new TypeError(
      `internal: expected ${type_name(type)}, got ${type_name(x)}`
    );
  }
}

export function maybe_cast<T extends Function & { prototype: any }>(
  x: any,
  type: T
): T["prototype"] | null {
  if (x instanceof type) {
    return x as any;
  } else {
    return null;
  }
}

export type Deferred<T> = {
  resolve: (value: T) => void;
  reject: (reason: any) => void;
  promise: Promise<T>;
};

export function defer<T>() {
  const deferred: Deferred<T> = Object.create(null);
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
}

export function* zip<A, B>(xs: A[], ys: B[]): Generator<[A, B]> {
  if (xs.length !== ys.length) {
    throw new Error(`Can't zip lists of different lengths`);
  }
  for (let i = 0; i < xs.length; ++i) {
    yield [xs[i], ys[i]];
  }
}

export function every<A>(xs: Iterable<A>, pred: (_: A) => boolean): boolean {
  for (const x of xs) {
    if (!pred(x)) {
      return false;
    }
  }
  return true;
}

export function copy_map<A, B>(source: Map<A, B>, target: Map<A, B>) {
  for (const [k, v] of source.entries()) {
    target.set(k, v);
  }
  return target;
}

export function* gen<A>(x: Iterable<A>) {
  yield* x;
}

// assumes nanoseconds
export function format_time_diff(n: bigint) {
  const units: [bigint, string][] = [
    [1000n, "μs"],
    [1000n, "ms"],
    [1000n, "s"],
  ];

  let value = n;
  let suffix = "ns";
  for (const [divisor, unit] of units) {
    if (value > divisor) {
      value = value / divisor;
      suffix = unit;
    } else {
      break;
    }
  }

  return `${value}${suffix}`;
}
