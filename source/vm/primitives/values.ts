import * as IR from "../../ir";
import {
  clone_map,
  copy_map,
  every,
  unreachable,
  zip,
  zip3,
} from "../../utils/utils";
import { ErrArbitrary } from "../errors";
import {
  CrochetCell,
  CrochetLambda,
  CrochetModule,
  CrochetPartial,
  CrochetThunk,
  CrochetType,
  CrochetValue,
  Environment,
  Tag,
  Universe,
} from "../intrinsics";
import { simple_value, type_name } from "./location";
import { get_function_type, is_subtype } from "./types";

export function get_nothing(universe: Universe) {
  return universe.nothing;
}

export function get_false(universe: Universe) {
  return universe.false;
}

export function get_true(universe: Universe) {
  return universe.true;
}

export function make_integer(universe: Universe, x: bigint) {
  return universe.make_integer(x);
}

export function make_float(universe: Universe, x: number) {
  return universe.make_float(x);
}

export function make_text(universe: Universe, x: string) {
  return new CrochetValue(Tag.TEXT, universe.types.Text, x);
}

export function make_static_text(universe: Universe, x: string) {
  return new CrochetValue(Tag.TEXT, universe.types.StaticText, x);
}

export function make_tuple(universe: Universe, xs: CrochetValue[]) {
  return new CrochetValue(Tag.TUPLE, universe.types.Tuple, xs);
}

export function make_interpolation(
  universe: Universe,
  xs: (string | CrochetValue)[]
) {
  return new CrochetValue(Tag.INTERPOLATION, universe.types.Interpolation, xs);
}

export function make_thunk(
  universe: Universe,
  env: Environment,
  block: IR.BasicBlock
) {
  return new CrochetValue(
    Tag.THUNK,
    universe.types.Thunk,
    new CrochetThunk(env, block)
  );
}

export function make_lambda(
  universe: Universe,
  env: Environment,
  parameters: string[],
  body: IR.BasicBlock
) {
  return new CrochetValue(
    Tag.LAMBDA,
    get_function_type(universe, parameters.length),
    new CrochetLambda(env, parameters, body)
  );
}

export function make_partial(
  universe: Universe,
  module: CrochetModule,
  name: string,
  arity: number
) {
  return new CrochetValue(
    Tag.PARTIAL,
    get_function_type(universe, arity),
    new CrochetPartial(module, name, arity)
  );
}

export function make_record(
  universe: Universe,
  keys: string[],
  values: CrochetValue[]
) {
  return new CrochetValue(
    Tag.RECORD,
    universe.types.Record,
    new Map(zip(keys, values))
  );
}

export function make_record_from_map(
  universe: Universe,
  value: Map<string, CrochetValue>
) {
  return new CrochetValue(Tag.RECORD, universe.types.Record, value);
}

export function record_at_put(
  universe: Universe,
  record: CrochetValue,
  key: string,
  value: CrochetValue
) {
  assert_tag(Tag.RECORD, record);
  const map0 = record.payload;
  const map = clone_map(map0);
  map.set(key, value);
  return new CrochetValue(Tag.RECORD, universe.types.Record, map);
}

export function has_type(type: CrochetType, value: CrochetValue) {
  return is_subtype(value.type, type);
}

export function instantiate(type: CrochetType, values: CrochetValue[]) {
  if (type.sealed) {
    throw new ErrArbitrary(
      "new-on-sealed-type",
      `The type ${type_name(type)} cannot be instantiated`
    );
  }

  if (type.fields.length !== values.length) {
    throw new ErrArbitrary(
      "invalid-new-arity",
      `The type ${type_name(type)} requires ${
        type.fields.length
      } arguments (${type.fields.join(", ")})`
    );
  }

  for (const [f, t, v] of zip3(type.fields, type.types, values)) {
    if (!has_type(t, v)) {
      throw new ErrArbitrary(
        "invalid-field-type",
        `The field ${f} of type ${type_name(
          type
        )} expects a value of type ${type_name(
          t
        )}, but was provided a value of type ${type_name(v.type)}`
      );
    }
  }

  return new CrochetValue(Tag.INSTANCE, type, values);
}

export function make_static_type(type: CrochetType) {
  if (!type.is_static) {
    throw new ErrArbitrary(
      "no-static-type",
      `The operation tried to construct a static type value, but wasn't provided with a static type`
    );
  }
  return new CrochetValue(Tag.TYPE, type, type);
}

export function tag_to_name(x: Tag): string {
  return Tag[x].replace(/_/g, "-").toLowerCase();
}

export function assert_tag<T extends Tag>(
  tag: T,
  value: CrochetValue
): asserts value is CrochetValue<T> {
  if (value.tag !== tag) {
    throw new ErrArbitrary(
      "invalid-type",
      `Expected a value of type ${tag_to_name(tag)}, but got ${type_name(
        value.type
      )}`
    );
  } else {
    return value as any;
  }
}

export function get_thunk(x: CrochetValue) {
  assert_tag(Tag.THUNK, x);
  return x.payload;
}

export function get_boolean(x: CrochetValue) {
  switch (x.tag) {
    case Tag.FALSE:
      return false;
    case Tag.TRUE:
      return true;
    default:
      throw new ErrArbitrary(
        "invalid-type",
        `Expected true or false, but got a value of type ${type_name(
          x.type
        )} instead`
      );
  }
}

export function make_boolean(universe: Universe, x: boolean) {
  return x ? get_true(universe) : get_false(universe);
}

export function get_array(x: CrochetValue) {
  assert_tag(Tag.TUPLE, x);
  return x.payload;
}

export function get_interpolation_parts(
  x: CrochetValue
): (string | CrochetValue)[] {
  assert_tag(Tag.INTERPOLATION, x);
  return x.payload;
}

export function equals(left: CrochetValue, right: CrochetValue): boolean {
  if (left.tag !== right.tag) {
    return false;
  }

  switch (left.tag) {
    case Tag.NOTHING:
    case Tag.TRUE:
    case Tag.FALSE:
      return left.tag === right.tag;

    case Tag.INTEGER: {
      assert_tag(Tag.INTEGER, left);
      assert_tag(Tag.INTEGER, right);
      return left.payload === right.payload;
    }

    case Tag.FLOAT_64: {
      assert_tag(Tag.FLOAT_64, left);
      assert_tag(Tag.FLOAT_64, right);
      return left.payload === right.payload;
    }

    case Tag.PARTIAL: {
      assert_tag(Tag.PARTIAL, left);
      assert_tag(Tag.PARTIAL, right);
      return (
        left.payload.module === right.payload.module &&
        left.payload.name === right.payload.name
      );
    }

    case Tag.TEXT: {
      assert_tag(Tag.TEXT, left);
      assert_tag(Tag.TEXT, right);
      return left.payload === right.payload;
    }

    case Tag.INTERPOLATION: {
      assert_tag(Tag.INTERPOLATION, left);
      assert_tag(Tag.INTERPOLATION, right);
      return (
        left.payload.length === right.payload.length &&
        every(zip(left.payload, right.payload), ([l, r]) => {
          if (typeof l === "string" && typeof r === "string") {
            return l === r;
          } else if (l instanceof CrochetValue && r instanceof CrochetValue) {
            return equals(l, r);
          } else {
            return false;
          }
        })
      );
    }

    case Tag.TUPLE: {
      assert_tag(Tag.TUPLE, left);
      assert_tag(Tag.TUPLE, right);
      return (
        left.payload.length === right.payload.length &&
        every(zip(left.payload, right.payload), ([l, r]) => equals(l, r))
      );
    }

    case Tag.RECORD: {
      assert_tag(Tag.RECORD, left);
      assert_tag(Tag.RECORD, right);
      if (left.payload.size !== right.payload.size) {
        return false;
      }
      for (const [k, v] of left.payload.entries()) {
        const rv = right.payload.get(k);
        if (rv == null) {
          return false;
        } else if (!equals(v, rv)) {
          return false;
        }
      }
      return true;
    }

    default:
      return left === right;
  }
}

export function register_instance(universe: Universe, value: CrochetValue) {
  const current = universe.registered_instances.get(value.type) ?? [];
  if (current.some((x) => equals(x, value))) {
    throw new ErrArbitrary(
      "instance-already-registered",
      `The instance ${simple_value(value)} is already registered`
    );
  }
  current.push(value);
  universe.registered_instances.set(value.type, current);
}

export function text_to_string(x: CrochetValue) {
  assert_tag(Tag.TEXT, x);
  return x.payload;
}

export function project(value: CrochetValue, key: string): CrochetValue {
  switch (value.tag) {
    case Tag.RECORD: {
      assert_tag(Tag.RECORD, value);
      const x = value.payload.get(key);
      if (x == null) {
        throw new ErrArbitrary(
          "no-record-key",
          `The key ${key} does not exist in the record (${[
            ...value.payload.keys(),
          ].join(", ")})`
        );
      } else {
        return x;
      }
    }

    case Tag.INSTANCE: {
      assert_tag(Tag.INSTANCE, value);
      const index = value.type.layout.get(key);
      if (index == null) {
        throw new ErrArbitrary(
          "no-type-key",
          `The type ${type_name(
            value.type
          )} does not have a field ${key} ([${value.type.fields.join(", ")}])`
        );
      } else {
        const result = value.payload[index];
        if (result == null) {
          throw new ErrArbitrary(
            "internal",
            `The data in the value does not match its type (${type_name(
              value.type
            )}) layout`
          );
        }
        return result;
      }
    }

    case Tag.TUPLE: {
      assert_tag(Tag.TUPLE, value);
      const results = value.payload.map((x) => project(x, key));
      return new CrochetValue(Tag.TUPLE, value.type, results);
    }

    default:
      throw new ErrArbitrary(
        "no-projection-capability",
        `Values of type ${type_name(value.type)} do not support projection`
      );
  }
}

export function make_cell(universe: Universe, value: CrochetValue) {
  return new CrochetValue(
    Tag.CELL,
    universe.types.Cell,
    new CrochetCell(value)
  );
}

export function deref_cell(cell: CrochetValue) {
  assert_tag(Tag.CELL, cell);
  return cell.payload.value;
}

export function update_cell(
  cell: CrochetValue,
  old_value: CrochetValue,
  value: CrochetValue
) {
  assert_tag(Tag.CELL, cell);
  if (equals(cell.payload.value, old_value)) {
    cell.payload.value = value;
    return true;
  } else {
    return false;
  }
}

export function get_map(x: CrochetValue) {
  assert_tag(Tag.RECORD, x);
  return x.payload;
}

export function normalise_interpolation(universe: Universe, x: CrochetValue) {
  assert_tag(Tag.INTERPOLATION, x);
  let last: string | null = null;
  const list: (string | CrochetValue)[] = [];
  for (const p of x.payload) {
    if (typeof p === "string") {
      if (typeof last === "string") {
        last = last + p;
      } else {
        last = p;
      }
    } else {
      if (last != null) {
        list.push(last);
        last = null;
      }
      list.push(p);
    }
  }
  if (last != null) {
    list.push(last);
  }
  return make_interpolation(universe, list);
}

export function is_thunk_forced(x: CrochetValue) {
  assert_tag(Tag.THUNK, x);
  return x.payload.value != null;
}

export function update_thunk(x: CrochetThunk, value: CrochetValue) {
  x.value = value;
}

export function is_boxed(x: CrochetValue) {
  return x.tag === Tag.UNKNOWN;
}

export function box(universe: Universe, x: unknown) {
  if (x instanceof CrochetValue && is_boxed(x)) {
    return x;
  } else {
    return new CrochetValue(Tag.UNKNOWN, universe.types.Unknown, x);
  }
}

export function unbox(x: CrochetValue) {
  assert_tag(Tag.UNKNOWN, x);
  return x.payload;
}

export function to_plain_object(x: CrochetValue): unknown {
  switch (x.tag) {
    case Tag.NOTHING:
      return null;

    case Tag.INTEGER:
      return x.payload;

    case Tag.FLOAT_64:
      return x.payload;

    case Tag.TEXT:
      return x.payload;

    case Tag.TRUE:
      return true;

    case Tag.FALSE:
      return false;

    case Tag.TUPLE:
      assert_tag(Tag.TUPLE, x);
      return x.payload.map((x) => to_plain_object(x));

    case Tag.RECORD: {
      assert_tag(Tag.RECORD, x);
      const result = new Map<string, unknown>();
      for (const [k, v] of x.payload.entries()) {
        result.set(k, to_plain_object(v));
      }
      return result;
    }

    default:
      throw new ErrArbitrary(
        `no-conversion-to-native`,
        `No conversion supported for values of type ${type_name(x.type)}`
      );
  }
}

export function from_plain_object(
  universe: Universe,
  x: unknown
): CrochetValue {
  if (x == null) {
    return universe.nothing;
  } else if (typeof x === "string") {
    return make_text(universe, x);
  } else if (typeof x === "bigint") {
    return make_integer(universe, x);
  } else if (typeof x === "number") {
    return make_float(universe, x);
  } else if (typeof x === "boolean") {
    return make_boolean(universe, x);
  } else if (Array.isArray(x)) {
    return make_tuple(
      universe,
      x.map((x) => from_plain_object(universe, x))
    );
  } else if (x instanceof Map) {
    const result = new Map<string, CrochetValue>();
    for (const [k, v] of x.entries()) {
      if (typeof k !== "string") {
        throw new ErrArbitrary(
          "invalid-type",
          `Cannot convert native map because it has non-text keys`
        );
      }
      result.set(k, from_plain_object(universe, v));
    }
    return make_record_from_map(universe, result);
  } else {
    throw new ErrArbitrary(
      "no-conversion-from-native",
      `Conversions are only supported for plain native types`
    );
  }
}

export function float_to_number(x: CrochetValue) {
  assert_tag(Tag.FLOAT_64, x);
  return x.payload;
}

export function to_number(x: CrochetValue) {
  switch (x.tag) {
    case Tag.FLOAT_64: {
      assert_tag(Tag.FLOAT_64, x);
      return x.payload;
    }
    case Tag.INTEGER: {
      assert_tag(Tag.INTEGER, x);
      return Number(x.payload);
    }
    default:
      throw new ErrArbitrary("invalid-type", `Expected a numeric value`);
  }
}
