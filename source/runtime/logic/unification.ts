import { TypeApp } from "../../generated/crochet-grammar";
import { cast } from "../../utils/utils";
import { Type } from "../ir";
import { CrochetType, CrochetValue, TCrochetEnum } from "../primitives";
import { World } from "../world";

export class UnificationEnvironment {
  private bindings = new Map<string, CrochetValue>();

  get boundValues() {
    return this.bindings;
  }

  lookup(name: string) {
    return this.bindings.get(name);
  }

  bind(name: string, value: CrochetValue) {
    this.bindings.set(name, value);
  }

  clone() {
    return UnificationEnvironment.from(this.bindings);
  }

  static from(map: Map<string, CrochetValue>) {
    const result = UnificationEnvironment.empty();
    for (const [k, v] of map.entries()) {
      result.bindings.set(k, v);
    }
    return result;
  }

  static empty() {
    return new UnificationEnvironment();
  }
}

export type Pattern =
  | VariantPattern
  | TypePattern
  | RolePattern
  | ValuePattern
  | GlobalPattern
  | VariablePattern
  | WildcardPattern;

interface IPattern {
  unify(
    world: World,
    env: UnificationEnvironment,
    value: CrochetValue
  ): UnificationEnvironment | null;
}

export class TypePattern implements IPattern {
  constructor(readonly pattern: Pattern, readonly type: Type) {}
  unify(
    world: World,
    env: UnificationEnvironment,
    value: CrochetValue
  ): UnificationEnvironment | null {
    const type = this.type.realise(world);
    if (type.accepts(value)) {
      return this.pattern.unify(world, env, value);
    } else {
      return null;
    }
  }
}

export class RolePattern implements IPattern {
  constructor(readonly pattern: Pattern, readonly role: string) {}
  unify(
    world: World,
    env: UnificationEnvironment,
    value: CrochetValue
  ): UnificationEnvironment | null {
    const role = world.roles.lookup(this.role);
    if (value.has_role(role)) {
      return this.pattern.unify(world, env, value);
    } else {
      return null;
    }
  }
}

export class ValuePattern implements IPattern {
  constructor(readonly value: CrochetValue) {}

  unify(
    world: World,
    env: UnificationEnvironment,
    value: CrochetValue
  ): UnificationEnvironment | null {
    if (value.equals(this.value)) {
      return env;
    } else {
      return null;
    }
  }
}

export class VariantPattern implements IPattern {
  constructor(readonly type: string, readonly variant: string) {}
  unify(
    world: World,
    env: UnificationEnvironment,
    other: CrochetValue
  ): UnificationEnvironment | null {
    const type = cast(world.types.lookup(this.type), TCrochetEnum);
    const variant = type.get_variant(this.variant);
    if (variant.equals(other)) {
      return env;
    } else {
      return null;
    }
  }
}

export class GlobalPattern implements IPattern {
  constructor(readonly name: string) {}

  unify(
    world: World,
    env: UnificationEnvironment,
    other: CrochetValue
  ): UnificationEnvironment | null {
    const value = world.globals.lookup(this.name);
    if (other.equals(value)) {
      return env;
    } else {
      return null;
    }
  }
}

export class VariablePattern implements IPattern {
  constructor(readonly name: string) {}

  unify(
    world: World,
    env: UnificationEnvironment,
    value: CrochetValue
  ): UnificationEnvironment | null {
    const bound = env.lookup(this.name);
    if (bound == null) {
      const newEnv = env.clone();
      newEnv.bind(this.name, value);
      return newEnv;
    } else if (value.equals(bound)) {
      return env;
    } else {
      return null;
    }
  }
}

export class WildcardPattern implements IPattern {
  unify(
    world: World,
    env: UnificationEnvironment,
    _value: CrochetValue
  ): UnificationEnvironment | null {
    return env;
  }
}
