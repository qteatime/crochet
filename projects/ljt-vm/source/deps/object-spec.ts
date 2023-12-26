export abstract class EParse {
  abstract message: string;
}

export class EType extends EParse {
  constructor(readonly name: string, readonly value: any) {
    super();
  }

  get message() {
    return `Expected ${this.name}, got ${typeof this.value}`;
  }
}

export class EInstance extends EParse {
  constructor(readonly name: string, readonly value: any) {
    super();
  }

  get message() {
    return `Expected an instance of ${this.name}`;
  }
}

export class EUnexpected extends EParse {
  constructor(readonly expected: any, readonly actual: any) {
    super();
  }

  get message() {
    return `Expected the constant ${this.expected}, got ${this.actual}`;
  }
}

export class EMaxLength extends EParse {
  constructor(readonly max: number, readonly actual: number) {
    super();
  }

  get message() {
    return `Expected maximum length of ${this.max}, got ${this.actual}`;
  }
}

export class EMinLength extends EParse {
  constructor(readonly min: number, readonly actual: number) {
    super();
  }

  get message() {
    return `Expected minimum length of ${this.min}, got ${this.actual}`;
  }
}

export class ERegExp extends EParse {
  constructor(
    readonly reason: string,
    readonly regex: RegExp,
    readonly actual: string
  ) {
    super();
  }

  get message() {
    return `Expected a ${this.reason} (${this.regex})`;
  }
}

export class EOneOf extends EParse {
  constructor(readonly expected: readonly any[], readonly actual: any) {
    super();
  }

  get message() {
    return `Expected one of ${this.expected.join(", ")}; got ${this.actual}`;
  }
}

export class EAt extends EParse {
  constructor(readonly key: string, readonly error: EParse) {
    super();
  }

  get message() {
    const { path, error } = this.collect_path();
    return `At ${path}: ${error.message}`;
  }

  collect_path(): { path: string; error: EParse } {
    if (this.error instanceof EAt) {
      const { path, error } = this.error.collect_path();
      return {
        path: `${this.key}.${path}`,
        error: error,
      };
    } else {
      return {
        path: this.key,
        error: this.error,
      };
    }
  }
}

export class EOr extends EParse {
  constructor(
    readonly left: EParse,
    readonly right: EParse,
    readonly value: any
  ) {
    super();
  }

  get message(): string {
    return `Invalid value: ${this.short(this)}`;
  }

  short(x: EParse): string {
    if (x instanceof EOr) {
      return `${this.short(x.left)}, ${this.short(x.right)}`;
    } else {
      return x.message;
    }
  }
}

export function bool(x: any): boolean {
  if (typeof x === "boolean") {
    return x;
  } else {
    throw new EType("Boolean", x);
  }
}

export function anything() {
  return (x: unknown) => x;
}

export function dictionary<A>(p: (_: any) => A) {
  return (x: any) => {
    if (x == null || Object(x) !== x) {
      throw new EType("dictionary", x);
    }
    const result: { [key: string]: A } = Object.create(null);
    for (const [k, v] of Object.entries(x)) {
      result[k] = p(v);
    }
    return result;
  };
}

export function str(x: any): string {
  if (typeof x === "string") {
    return x;
  } else {
    throw new EType("String", x);
  }
}

export function short_str(max_size: number = 255) {
  return seq2(str, max_length(max_size));
}

export function regex(reason: string, re: RegExp) {
  return (x: string) => {
    if (re.test(x)) {
      return x;
    } else {
      throw new ERegExp(reason, re, x);
    }
  };
}

export function constant<T>(expected: T) {
  return (x: any) => {
    if (x === expected) {
      return expected;
    } else {
      throw new EUnexpected(expected, x);
    }
  };
}

export function num(x: any): number {
  if (typeof x === "number") {
    return x;
  } else {
    throw new EType("Number", x);
  }
}

export function int(x: any): number {
  if (typeof x === "number" && Math.trunc(x) === x) {
    return x;
  } else {
    throw new EType("Integer", x);
  }
}

export function byte(x: any): number {
  return seq2(int, (x) => {
    if (x < 0 || x > 255) {
      throw new EType("byte", x);
    } else {
      return x;
    }
  })(x);
}

export function max_length(size: number) {
  return (x: string) => {
    if (x.length < size) {
      return x;
    } else {
      throw new EMaxLength(size, x.length);
    }
  };
}

export function min_length(size: number) {
  return (x: string) => {
    if (x.length >= size) {
      return x;
    } else {
      throw new EMinLength(size, x.length);
    }
  };
}

export function min_max_length(min: number, max: number) {
  return seq2(min_length(min), max_length(max));
}

export function max_items(size: number) {
  return <A>(x: A[]) => {
    if (x.length < size) {
      return x;
    } else {
      throw new EMaxLength(size, x.length);
    }
  };
}

export function min_items(size: number) {
  return <A>(x: A[]) => {
    if (x.length >= size) {
      return x;
    } else {
      throw new EMinLength(size, x.length);
    }
  };
}

export function min_max_items(min: number, max: number) {
  return seq2(min_items(min), max_items(max));
}

export function optional<A>(default_value: A, spec: (_: any) => A) {
  return (x: any) => {
    if (x == null) {
      return default_value;
    } else {
      return spec(x);
    }
  };
}

export function lazy<A>(p: (_: any) => A) {
  return (x: any) => p(x);
}

export function lazy_optional<A>(default_value: () => A, spec: (_: any) => A) {
  return (x: any) => {
    if (x == null) {
      return default_value();
    } else {
      return spec(x);
    }
  };
}

export function list_of<A>(f: (_: any) => A) {
  return (x: any) => {
    if (Array.isArray(x)) {
      return x.map((a, i) => {
        try {
          return f(a);
        } catch (e) {
          throw new EAt(String(i), e as EParse);
        }
      });
    } else {
      throw new EType("List", x);
    }
  };
}

export function one_of<K>(xs: readonly K[]) {
  return (x: any) => {
    if (xs.includes(x)) {
      return x as K;
    } else {
      throw new EOneOf(xs, x);
    }
  };
}

export function instance_of<A>(
  type: { new (...args: any[]): A },
  name?: string
) {
  return (x: unknown) => {
    if (x instanceof type) {
      return x;
    } else {
      throw new EInstance(name ?? type.name, x);
    }
  };
}

export function spec<T extends { [key: string]: (_: any) => any }>(
  spec: T
): (_: any) => { [K in keyof T]: ReturnType<T[K]> } {
  return (x: any) => {
    if (x != null && Object(x) === x) {
      const result = Object.create(null);
      for (const [k, p] of Object.entries(spec)) {
        try {
          result[k] = p(x[k] ?? null);
        } catch (e) {
          throw new EAt(k, e as EParse);
        }
      }
      return result;
    } else {
      throw new EType("Object", x);
    }
  };
}

export function nullable<T>(spec: (_: any) => T) {
  return (x: any) => {
    if (x == null) {
      return null;
    } else {
      return spec(x) as T;
    }
  };
}

export function seq2<A, B, C>(a: (_: A) => B, b: (_: B) => C) {
  return (x: any) => {
    return b(a(x));
  };
}

export function seq3<A, B, C, D>(
  a: (_: A) => B,
  b: (_: B) => C,
  c: (_: C) => D
) {
  return (x: any) => {
    return c(b(a(x)));
  };
}

export function tagged_choice<U, T extends string>(
  tag_field: string,
  choices: Record<T, (_: any) => U>
) {
  return (x: any) => {
    if (x == null || Object(x) !== x) {
      throw new EType("tagged object", x);
    }
    if (typeof x[tag_field] !== "string" || !choices[x[tag_field] as T]) {
      throw new EAt(tag_field, new EOneOf(Object.keys(choices), x[tag_field]));
    }

    Object.entries(x);
    const spec = choices[x[tag_field] as T];
    return spec(x);
  };
}

export function or<A, B>(a: (_: any) => A, b: (_: any) => B) {
  return (x: any) => {
    try {
      return a(x) as A | B;
    } catch (e1) {
      try {
        return b(x) as A | B;
      } catch (e2) {
        throw new EOr(e1 as EParse, e2 as EParse, x);
      }
    }
  };
}

export function choice<A>(a: ((_: any) => A)[]) {
  return a.reduce(or);
}

type P<A> = (_: any) => A;
export function or3<A, B, C>(a: P<A>, b: P<B>, c: P<C>) {
  return or(a, or(b, c));
}

export function or4<A, B, C, D>(a: P<A>, b: P<B>, c: P<C>, d: P<D>) {
  return or(a, or(b, or(c, d)));
}
export function or5<A, B, C, D, E>(
  a: P<A>,
  b: P<B>,
  c: P<C>,
  d: P<D>,
  e: P<E>
) {
  return or(a, or(b, or(c, or(d, e))));
}
export function or6<A, B, C, D, E, F>(
  a: P<A>,
  b: P<B>,
  c: P<C>,
  d: P<D>,
  e: P<E>,
  f: P<F>
) {
  return or(a, or(b, or(c, or(d, or(e, f)))));
}

export function parse<A>(spec: (_: any) => A, value: any) {
  try {
    return spec(value);
  } catch (e) {
    if (e instanceof EParse) {
      throw new Error(`Failed to parse: ${e.message}`);
    } else {
      throw e;
    }
  }
}
