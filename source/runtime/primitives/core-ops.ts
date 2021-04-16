import { CrochetNothing, CrochetType, CrochetValue, type_name } from "./0-core";
import {
  cvalue,
  ErrArbitrary,
  ErrInvalidArity,
  ErrNativeError,
  ErrNoBranchMatched,
  ErrUnexpectedType,
  Machine,
  State,
  Thread,
  _push,
} from "../vm";
import { ProcedureBranch } from "./procedure";
import {
  CrochetLambda,
  CrochetPartial,
  PartialConcrete,
  PartialValue,
} from "./partial";
import { False, True } from "./boolean";
import { CrochetFloat, CrochetInteger } from "./numeric";
import { CrochetText } from "./text";
import { CrochetTuple } from "./tuple";
import { CrochetUnknown } from "./unknown";
import { CrochetRecord } from "./record";
import { cast } from "../../utils";

export type Class<T> = {
  new (...args: any[]): T;
};

export function from_bool(x: boolean): CrochetValue {
  return x ? True.instance : False.instance;
}

export function* safe_cast(x: any, type: CrochetType): Machine {
  if (type.accepts(x)) {
    return x;
  } else {
    throw new ErrUnexpectedType(type, x);
  }
}

export function* invoke(
  state: State,
  name: string,
  args: CrochetValue[]
): Machine {
  const procedure = state.world.procedures.lookup(name);
  const branch0 = procedure.select(args);
  let branch: ProcedureBranch;
  if (branch0 == null) {
    throw new ErrNoBranchMatched(procedure, args);
  } else {
    branch = branch0;
  }
  const result = cvalue(yield _push(branch.procedure.invoke(state, args)));
  return result;
}

export function* apply_partial(
  state: State,
  fn: CrochetPartial,
  args: PartialValue[]
): Machine {
  if (fn.arity !== args.length) {
    throw new ErrInvalidArity(fn, args.length);
  } else {
    const new_fn = fn.merge(args);
    if (new_fn.is_saturated) {
      return yield _push(invoke(state, new_fn.name, new_fn.concrete_args));
    } else {
      return new_fn;
    }
  }
}

export function* apply(
  state: State,
  fn: CrochetValue,
  args: CrochetValue[]
): Machine {
  if (fn instanceof CrochetPartial) {
    return yield _push(
      apply_partial(
        state,
        fn,
        args.map((x) => new PartialConcrete(x))
      )
    );
  } else if (fn instanceof CrochetLambda) {
    return yield _push(fn.apply(state, args));
  } else {
    throw new ErrArbitrary(
      "invalid-type",
      `Expected a function, got ${fn.to_text()}`
    );
  }
}

export function js_to_crochet(value: unknown): CrochetValue {
  if (value instanceof CrochetValue) {
    return value;
  }

  switch (typeof value) {
    case "number":
      return new CrochetFloat(value);
    case "bigint":
      return new CrochetInteger(value);
    case "boolean":
      return from_bool(value);
    case "string":
      return new CrochetText(value);
    default: {
      if (value == null) {
        return CrochetNothing.instance;
      } else if (Array.isArray(value)) {
        return new CrochetTuple(value.map(js_to_crochet));
      } else {
        return new CrochetUnknown(value);
      }
    }
  }
}

export function json_to_crochet(value: unknown): CrochetValue {
  switch (typeof value) {
    case "number":
      return new CrochetFloat(value);
    case "boolean":
      return from_bool(value);
    case "string":
      return new CrochetText(value);
    case "object": {
      if (value == null) {
        return CrochetNothing.instance;
      } else if (Array.isArray(value)) {
        return new CrochetTuple(value.map(json_to_crochet));
      } else {
        const result = new Map<string, CrochetValue>();
        for (const [key, prop] of Object.entries(value)) {
          result.set(key, json_to_crochet(prop));
        }
        return new CrochetRecord(result);
      }
    }
    default:
      throw new ErrArbitrary(
        "invalid-json",
        `Invalid JSON type ${typeof value}`
      );
  }
}

export function box(value: unknown) {
  if (value instanceof CrochetUnknown) {
    return value;
  } else {
    return new CrochetUnknown(value);
  }
}

export function unbox<T>(value: CrochetValue): T {
  return cast(value, CrochetUnknown).value as T;
}

export function unbox_typed<T>(type: Class<T>, value: CrochetValue): T {
  const result = unbox<unknown>(value);
  if (result instanceof type) {
    return result;
  } else {
    throw new ErrNativeError(new Error(`invalid-type: Expected ${type.name}`));
  }
}

export function number_to_float(value: CrochetValue) {
  if (value instanceof CrochetInteger) {
    return Number(value.value);
  } else if (value instanceof CrochetFloat) {
    return value.value;
  } else {
    throw new ErrArbitrary(
      "invalid-type",
      `Expected an integer or float, got ${type_name(value)}`
    );
  }
}

export function get_string(value: CrochetValue) {
  if (value instanceof CrochetText) {
    return value.value;
  } else {
    throw new ErrArbitrary(
      "invalid-type",
      `Expected a text, got ${type_name(value)}`
    );
  }
}

export function get_array(value: CrochetValue) {
  if (value instanceof CrochetTuple) {
    return value.values;
  } else {
    throw new ErrArbitrary(
      "invalid-type",
      `Expected a tuple, got ${type_name(value)}`
    );
  }
}

export function get_map(value: CrochetValue) {
  if (value instanceof CrochetRecord) {
    return value.values;
  } else {
    throw new ErrArbitrary(
      "invalid-type",
      `Expected a record, got ${type_name(value)}`
    );
  }
}

export function project(value: CrochetValue, key: string) {
  return value.projection.project(key);
}

export function from_string(x: string) {
  return new CrochetText(x);
}

export function* equals(
  state: State,
  left: CrochetValue,
  right: CrochetValue
): Machine {
  const result = yield _push(invoke(state, "_ === _", [left, right]));
  return cvalue(result);
}

export function equals_sync(
  state: State,
  left: CrochetValue,
  right: CrochetValue
): boolean {
  return cvalue(
    Thread.for_machine(equals(state, left, right)).run_sync()
  ).as_bool();
}
