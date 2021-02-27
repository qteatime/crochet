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

export function pick<A>(xs: A[]): A | null {
  if (xs.length === 0) {
    return null;
  } else {
    return xs[Math.floor(Math.random() * xs.length)];
  }
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
    throw new TypeError(`internal: expected ${type_name(type)}`);
  }
}

export function maybe_cast<T extends Function & { prototype: any }>(
  x: any,
  type: T
): T["prototype"] | null {
  if (x == null) {
    return null;
  } else {
    return cast(x, type);
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
