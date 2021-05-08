import * as IR from "../../ir";
import { Values, Types, Literals, Environments } from "../primitives";
import type {
  CrochetModule,
  CrochetValue,
  Environment,
  State,
} from "../intrinsics";
import { ErrArbitrary } from "../errors";
import { unreachable } from "../../utils/utils";

export function unify(
  state: State,
  module: CrochetModule,
  env: Environment,
  value: CrochetValue,
  pattern: IR.Pattern
): Environment | null {
  const t = IR.PatternTag;
  switch (pattern.tag) {
    case t.GLOBAL: {
      const global = module.definitions.try_lookup(pattern.name);
      if (global == null) {
        throw new ErrArbitrary(
          "no-definition",
          `${pattern.name} is not defined`
        );
      }
      if (Values.equals(global, value)) {
        return env;
      } else {
        return null;
      }
    }

    case t.HAS_TYPE: {
      const type = Types.materialise_type(state.universe, module, pattern.type);
      if (Values.has_type(type, value)) {
        return unify(state, module, env, value, pattern.pattern);
      } else {
        return null;
      }
    }

    case t.LITERAL: {
      const lit = Literals.materialise_literal(state.universe, pattern.literal);
      if (Values.equals(value, lit)) {
        return env;
      } else {
        return null;
      }
    }

    case t.SELF: {
      if (env.raw_receiver == null) {
        throw new ErrArbitrary("no-receiver", `self with no receiver`);
      }
      if (Values.equals(value, env.raw_receiver)) {
        return env;
      } else {
        return null;
      }
    }

    case t.VARIABLE: {
      const local = env.try_lookup(pattern.name);
      if (local == null) {
        const new_env = Environments.clone(env);
        new_env.define(pattern.name, value);
        return new_env;
      } else if (Values.equals(local, value)) {
        return env;
      } else {
        return null;
      }
    }

    case t.WILDCARD: {
      return env;
    }

    default:
      throw unreachable(pattern, `Pattern`);
  }
}
