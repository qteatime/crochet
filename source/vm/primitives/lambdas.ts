import * as IR from "../../ir";
import * as Commands from "./commands";
import * as Environments from "./environments";
import * as Values from "./values";
import * as Location from "./location";
import {
  CrochetValue,
  Tag,
  CrochetActivation,
  Universe,
  Environment,
  Activation,
} from "../intrinsics";
import { ErrArbitrary } from "../errors";
import { type_name } from "./location";

export function prepare_activation(
  universe: Universe,
  parent_activation: Activation,
  env0: Environment,
  lambda: CrochetValue,
  values: CrochetValue[]
) {
  switch (lambda.tag) {
    case Tag.LAMBDA: {
      Values.assert_tag(Tag.LAMBDA, lambda);
      const p = lambda.payload;
      assert_arity(lambda, p.parameters.length, values.length);
      const env = Environments.extend_with_parameters_and_receiver(
        p.env,
        p.parameters,
        values,
        p.env.raw_receiver
      );
      const activation = new CrochetActivation(
        parent_activation,
        lambda.payload,
        env,
        p.body
      );
      return activation;
    }

    case Tag.PARTIAL: {
      Values.assert_tag(Tag.PARTIAL, lambda);
      const command = Commands.get_command(universe, lambda.payload.name);
      assert_arity(lambda, command.arity, values.length);
      const branch = Commands.select_branch(command, values);
      const new_activation = Commands.prepare_activation(
        parent_activation,
        branch,
        values
      );
      return new_activation;
    }

    default:
      throw new ErrArbitrary(
        "not-a-function",
        `Expected a function, but got ${Location.type_name(lambda.type)}`
      );
  }
}

export function assert_arity(
  value: CrochetValue,
  expected: number,
  got: number
) {
  if (expected !== got) {
    throw new ErrArbitrary(
      "invalid-arity",
      `${Location.simple_value(
        value
      )} expects ${expected} arguments, but was provided with ${got}`
    );
  }
}

export function get_arity(value: CrochetValue) {
  switch (value.tag) {
    case Tag.LAMBDA: {
      Values.assert_tag(Tag.LAMBDA, value);
      return value.payload.parameters.length;
    }

    case Tag.PARTIAL: {
      Values.assert_tag(Tag.PARTIAL, value);
      return value.payload.arity;
    }

    default:
      throw new ErrArbitrary(
        `invalid-type`,
        `Expected a function, but got a ${type_name(value.type)}`
      );
  }
}
