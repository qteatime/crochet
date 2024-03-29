import { Union } from "./types";
import { inspect } from "util";

export class Ok<A, B> {
  constructor(readonly value: A) {}
  chain<C>(f: (_: A) => Result<C, B>): Result<C, B> {
    return f(this.value);
  }
  recover(f: (_: B) => Result<A, B>): Result<A, B> {
    return this;
  }
}

export class Err<A, B> {
  constructor(readonly reason: B) {}
  chain<C>(f: (_: A) => Result<C, B>): Result<C, B> {
    return this as any;
  }
  recover(f: (_: B) => Result<A, B>): Result<A, B> {
    return f(this.reason);
  }
}

function collect<A>(xs: Valid<A>[]): Valid<A[]> {
  return xs.reduce((rs: Valid<A[]>, x) => {
    return rs.chain((rsV) => {
      return x.chain((xV) => {
        return new Ok([...rsV, xV]);
      });
    });
  }, new Ok([]));
}

export type SpecType<T> = T extends AnySpec<infer U> ? U : never;

export type SpecTypes<Ts> = Ts extends [AnySpec<infer U>]
  ? U
  : Ts extends [AnySpec<infer U>, ...infer Rest]
  ? U | SpecTypes<Rest>
  : never;

export type RecordSpecType<R> = R extends Record<infer K, infer T>
  ? { [K0 in K]: SpecType<R[K0]> }
  : never;

type Result<A, B> = Ok<A, B> | Err<A, B>;

export class EType {
  constructor(readonly expected: string) {}
  format(): string {
    return `a value of type ${this.expected}`;
  }
}

export class ENoKey {
  constructor(readonly key: string) {}
  format(): string {
    return `the key ${JSON.stringify(this.key)} to be present`;
  }
}

export class ENotEqual {
  constructor(readonly expected: any) {}
  format(): string {
    return `${inspect(this.expected)}`;
  }
}

export class EAnyOf {
  constructor(readonly errors: Errors[]) {}
  format(): string {
    return `any of: ${this.errors.map((x) => x.format()).join(", ")}`;
  }
}

export class EPath {
  constructor(readonly key: string, readonly error: Errors) {}

  get_path_and_error() {
    const go = (path: string[], err: Errors): [string[], Errors] => {
      if (err instanceof EPath) {
        return go([...path, err.key], err.error);
      } else {
        return [path, err];
      }
    };
    return go([], this);
  }

  format(): string {
    const [path, error] = this.get_path_and_error();
    return `${error.format()} at path ${path.join(".")}`;
  }
}

type Errors = EType | ENoKey | ENotEqual | EAnyOf | EPath;

type Valid<A> = Result<A, Errors>;

const failed = new (class Failed {})();

export class LazySpec<A> {
  constructor(readonly thunk: () => AnySpec<A>) {}
}

export type SpecFun<A> = (_: any) => Valid<A>;
export type SpecContainer<A> = { spec: AnySpec<A> };
export type AnySpec<A> = SpecFun<A> | SpecContainer<A> | LazySpec<A>;

export function lazy<A>(x: () => AnySpec<A>) {
  return new LazySpec(x);
}

function toSpec<A>(x: AnySpec<A>): SpecFun<A> {
  if (x instanceof LazySpec) {
    return toSpec(x.thunk());
  } else if (typeof (x as any).spec === "function") {
    return (x as any).spec;
  } else {
    return x as any;
  }
}

export function string(x: any): Valid<string> {
  if (typeof x === "string") {
    return new Ok(x);
  } else {
    return new Err(new EType("string"));
  }
}

export function anything(x: any): Valid<any> {
  return new Ok(x);
}

export function bigint(x: any): Valid<bigint> {
  if (typeof x === "bigint") {
    return new Ok(x);
  } else {
    return new Err(new EType("bigint"));
  }
}

export function bigint_string(x: any): Valid<bigint> {
  return string(x).chain((s) => {
    try {
      return new Ok(BigInt(s));
    } catch {
      return new Err(new EType("bigint"));
    }
  });
}

export function number(x: any): Valid<number> {
  if (typeof x === "number") {
    return new Ok(x);
  } else {
    return new Err(new EType("number"));
  }
}

export function boolean(x: any): Valid<boolean> {
  if (typeof x === "boolean") {
    return new Ok(x);
  } else {
    return new Err(new EType("boolean"));
  }
}

export function nothing(x: any): Valid<null> {
  if (x == null) {
    return new Ok(null);
  } else {
    return new Err(new EType("nothing"));
  }
}

export function array<A>(f0: AnySpec<A>): SpecFun<A[]> {
  const f = toSpec(f0);
  return (xs: any) => {
    if (Array.isArray(xs)) {
      return collect(xs.map(f));
    } else {
      return new Err(new EType("array"));
    }
  };
}

export function equal<A>(x: A): SpecFun<A> {
  return (value: any) => {
    if (value === x) {
      return new Ok(value);
    } else {
      return new Err(new ENotEqual(x));
    }
  };
}

export function anyOf<T extends AnySpec<any>[]>(
  fs: [...T]
): SpecFun<SpecTypes<T>> {
  return (value: any) => {
    return fs.map(toSpec).reduce((r: Result<any, EAnyOf>, f: SpecFun<any>) => {
      return r.recover((rs: EAnyOf) => {
        return f(value).recover((e: Errors) => {
          return new Err(new EAnyOf([...rs.errors, e]));
        }) as Result<any, EAnyOf>;
      });
    }, new Err(new EAnyOf([])));
  };
}

export function spec<A extends Record<string, AnySpec<any>>, B>(
  type: A,
  parser: (_: RecordSpecType<A>) => B
): SpecFun<B> {
  return (value: any) => {
    if (value !== null && typeof value === "object") {
      const entries = collect(
        Object.entries(type).map(([k, f]: [string, any]) => {
          return toSpec(f)(value[k] ?? failed)
            .recover((e) => new Err(new EPath(k, e)))
            .chain((v: any) => new Ok([k, v]));
        })
      );
      return entries.chain((xs: any[]) => {
        const result = Object.create(null);
        for (const [k, v] of xs) {
          result[k] = v;
        }
        return new Ok(parser(result));
      });
    } else {
      return new Err(new EType("object"));
    }
  };
}

export function optional<A>(spec: AnySpec<A>, default_value: A): SpecFun<A> {
  return (value: any) => {
    if (value === failed) {
      return new Ok(default_value);
    } else {
      return toSpec(spec)(value);
    }
  };
}

export function map_spec<A, B>(spec: AnySpec<A>, f: (_: A) => B): SpecFun<B> {
  return (value: any) => {
    return toSpec(spec)(value).chain((v) => new Ok(f(v)));
  };
}

export function parse<A>(x: any, spec: AnySpec<A>): A {
  const result = toSpec(spec)(x);
  if (result instanceof Ok) {
    return result.value;
  } else {
    throw new Error(`Failed to parse: Expected ${result.reason.format()}`);
  }
}

export function try_parse<A>(x: any, spec: AnySpec<A>): Valid<A> {
  return toSpec(spec)(x);
}
