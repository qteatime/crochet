import * as IR from "../../ir";
import { Values, Types, Literals, Environments } from "../primitives";
import {
  CrochetModule,
  CrochetType,
  CrochetValue,
  Environment,
  State,
  Tag,
} from "../intrinsics";
import { ErrArbitrary } from "../errors";
import { unreachable } from "../../utils/utils";

export abstract class Pattern {
  abstract unify(env: Environment, value: CrochetValue): Environment | null;
}

export class ValuePattern extends Pattern {
  constructor(readonly value: CrochetValue) {
    super();
  }

  unify(env: Environment, value: CrochetValue<Tag>): Environment | null {
    if (Values.equals(this.value, value)) {
      return env;
    } else {
      return null;
    }
  }
}

export class VariablePattern extends Pattern {
  constructor(readonly name: string) {
    super();
  }

  unify(env: Environment, value: CrochetValue<Tag>): Environment | null {
    const local = env.try_lookup(this.name);
    if (local == null) {
      const new_env = Environments.clone(env);
      new_env.define(this.name, value);
      return new_env;
    } else if (Values.equals(local, value)) {
      return env;
    } else {
      return null;
    }
  }
}

export class WildcardPattern extends Pattern {
  unify(env: Environment, value: CrochetValue<Tag>): Environment | null {
    return env;
  }
}

export class TypePattern extends Pattern {
  constructor(readonly type: CrochetType, readonly pattern: Pattern) {
    super();
  }

  unify(env: Environment, value: CrochetValue<Tag>): Environment | null {
    if (Values.has_type(this.type, value)) {
      return this.pattern.unify(env, value);
    } else {
      return null;
    }
  }
}

export function compile_pattern(
  state: State,
  module: CrochetModule,
  env: Environment,
  pattern: IR.Pattern
): Pattern {
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
      return new ValuePattern(global);
    }

    case t.HAS_TYPE: {
      const type = Types.materialise_type(state.universe, module, pattern.type);
      return new TypePattern(
        type,
        compile_pattern(state, module, env, pattern.pattern)
      );
    }

    case t.LITERAL: {
      const lit = Literals.materialise_literal(state.universe, pattern.literal);
      return new ValuePattern(lit);
    }

    case t.SELF: {
      if (env.raw_receiver == null) {
        throw new ErrArbitrary("no-receiver", `self with no receiver`);
      }
      return new ValuePattern(env.raw_receiver);
    }

    case t.VARIABLE: {
      const local = env.try_lookup(pattern.name);
      if (local != null) {
        return new ValuePattern(local);
      } else {
        return new VariablePattern(pattern.name);
      }
    }

    case t.WILDCARD: {
      return new WildcardPattern();
    }

    case t.STATIC_TYPE: {
      const type = Types.materialise_type(state.universe, module, pattern.type);
      const stype = Types.get_static_type(state.universe, type);
      const value = Values.make_static_type(state.universe, stype);
      return new ValuePattern(value);
    }

    default:
      throw unreachable(pattern, "Pattern");
  }
}

export function unify_all(
  env: Environment,
  value: CrochetValue[],
  pattern: Pattern
) {
  const result = [];
  for (const x of value) {
    const new_env = pattern.unify(env, x);
    if (new_env != null) {
      result.push(new_env);
    }
  }
  return result;
}
