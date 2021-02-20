type Ctor<A> = { name: string; prototype: A };

type TypeToPrim<T> = T extends "string"
  ? string
  : T extends "number"
    ? number
    : T extends "boolean"
      ? boolean
      : T extends "undefined"
        ? undefined
        : T extends "function" ? Function : never;

type Primitives = "string" | "number" | "boolean" | "undefined" | "function";

export function coerce<T>(ctor: Ctor<T>, value: any): T {
  if (!(value instanceof <any>ctor)) {
    throw new TypeError(`Expected ${ctor.name}, got ${value}`);
  }

  return value;
}

export function coercePrimitive<T extends Primitives>(
  type: T,
  value: any
): TypeToPrim<T> {
  if (typeof value !== type) {
    throw new TypeError(`Expected a primitive ${type}, got ${value}`);
  }

  return value;
}

export function coerceArray<T>(ctor: Ctor<T>, value: any): T[] {
  if (!Array.isArray(value)) {
    throw new TypeError(`Expected an array of ${ctor.name}, got ${value}`);
  }

  return value.map(x => coerce(ctor, x));
}

export function coercePrimitiveArray<T extends Primitives>(
  type: T,
  value: any
): TypeToPrim<T>[] {
  if (!Array.isArray(value)) {
    throw new TypeError(`Expected an array of primitive ${type}, got ${value}`);
  }

  return value.map(x => coercePrimitive(type, x));
}