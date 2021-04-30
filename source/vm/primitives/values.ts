import * as IR from "../../ir";
import { zip3 } from "../../utils/utils";
import { ErrArbitrary } from "../errors";
import {
  CrochetLambda,
  CrochetThunk,
  CrochetType,
  CrochetValue,
  Environment,
  Tag,
  Universe,
} from "../intrinsics";
import { type_name } from "./location";
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
