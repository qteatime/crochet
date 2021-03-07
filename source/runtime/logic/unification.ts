import { TypeApp } from "../../generated/crochet-grammar";
import { cast } from "../../utils/utils";
import { Type } from "../ir";
import { CrochetType, CrochetValue } from "../primitives";
import { State } from "../vm";
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
  | TypePattern
  | RolePattern
  | ValuePattern
  | GlobalPattern
  | VariablePattern
  | WildcardPattern;

abstract class AbstractPattern {
  abstract unify(
    state: State,
    env: UnificationEnvironment,
    value: CrochetValue
  ): UnificationEnvironment | null;

  aunify(state: State, env: UnificationEnvironment, value: CrochetValue) {
    const result = this.unify(state, env, value);
    if (result == null) {
      return [];
    } else {
      return [result];
    }
  }

  get variables(): string[] {
    return [];
  }
}

export class TypePattern extends AbstractPattern {
  constructor(readonly pattern: Pattern, readonly type: Type) {
    super();
  }

  unify(
    state: State,
    env: UnificationEnvironment,
    value: CrochetValue
  ): UnificationEnvironment | null {
    const type = this.type.realise(state.world);
    if (type.accepts(value)) {
      return this.pattern.unify(state, env, value);
    } else {
      return null;
    }
  }
}

export class RolePattern extends AbstractPattern {
  constructor(readonly pattern: Pattern, readonly role: string) {
    super();
  }

  unify(
    state: State,
    env: UnificationEnvironment,
    value: CrochetValue
  ): UnificationEnvironment | null {
    const role = state.world.roles.lookup(this.role);
    if (value.has_role(role)) {
      return this.pattern.unify(state, env, value);
    } else {
      return null;
    }
  }
}

export class ValuePattern extends AbstractPattern {
  constructor(readonly value: CrochetValue) {
    super();
  }

  unify(
    state: State,
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

export class GlobalPattern extends AbstractPattern {
  constructor(readonly name: string) {
    super();
  }

  unify(
    state: State,
    env: UnificationEnvironment,
    other: CrochetValue
  ): UnificationEnvironment | null {
    const value = state.world.globals.lookup(this.name);
    if (other.equals(value)) {
      return env;
    } else {
      return null;
    }
  }
}

export class VariablePattern extends AbstractPattern {
  constructor(readonly name: string) {
    super();
  }

  unify(
    state: State,
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

  get variables(): string[] {
    return [this.name];
  }
}

export class WildcardPattern extends AbstractPattern {
  unify(
    state: State,
    env: UnificationEnvironment,
    _value: CrochetValue
  ): UnificationEnvironment | null {
    return env;
  }
}
