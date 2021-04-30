import * as Commands from "./commands";
import * as Environments from "./environments";
import * as Values from "./values";
import * as Location from "./location";
import { CrochetValue, Tag, CrochetActivation, Universe } from "../intrinsics";
import { ErrArbitrary } from "../errors";

export function prepare_activation(
  universe: Universe,
  parent_activation: CrochetActivation,
  lambda: CrochetValue,
  values: CrochetValue[]
) {
  switch (lambda.tag) {
    case Tag.LAMBDA: {
      Values.assert_tag(Tag.LAMBDA, lambda);
      const p = lambda.payload;
      assert_arity(lambda, p.parameters.length, values.length);
      const env = Environments.extend_with_parameters(
        p.env,
        p.parameters,
        values
      );
      const activation = new CrochetActivation(parent_activation, env, p.body);
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
