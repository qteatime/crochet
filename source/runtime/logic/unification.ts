import { CrochetValue } from "../primitives";

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

export type Pattern = ValuePattern | VariablePattern | WildcardPattern;

interface IPattern {
  unify(
    env: UnificationEnvironment,
    value: CrochetValue
  ): UnificationEnvironment | null;
}

export class ValuePattern implements IPattern {
  constructor(readonly value: CrochetValue) {}

  unify(env: UnificationEnvironment, value: CrochetValue) {
    if (value.equals(this.value)) {
      return env;
    } else {
      return null;
    }
  }
}

export class VariablePattern implements IPattern {
  constructor(readonly name: string) {}

  unify(env: UnificationEnvironment, value: CrochetValue) {
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
  unify(env: UnificationEnvironment, _value: CrochetValue) {
    return env;
  }
}
