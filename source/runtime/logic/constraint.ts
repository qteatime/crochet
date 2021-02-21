import { and, from_bool, not, or, CrochetValue } from "../primitives";
import { UnificationEnvironment } from "./unification";

export type Constraint = And | Or | Not | Variable | Equals | Value;

interface IConstraint {
  evaluate(env: UnificationEnvironment): CrochetValue;
}

export class And implements IConstraint {
  constructor(readonly left: Constraint, readonly right: Constraint) {
  }

  evaluate(env: UnificationEnvironment): CrochetValue {
    return and(this.left.evaluate(env), this.right.evaluate(env));
  }
}

export class Or implements IConstraint {
  constructor(readonly left: Constraint, readonly right: Constraint) {
  }

  evaluate(env: UnificationEnvironment): CrochetValue {
    return or(this.left.evaluate(env), this.right.evaluate(env));
  }
}

export class Not implements IConstraint {
  constructor(readonly constraint: Constraint) {
  }

  evaluate(env: UnificationEnvironment): CrochetValue {
    return not(this.constraint.evaluate(env));
  }
}

export class Variable implements IConstraint {
  constructor(readonly name: string) {}

  evaluate(env: UnificationEnvironment): CrochetValue {
    const result = env.lookup(this.name);
    if (result == null) {
      throw new Error(`Undefined constraint variable ${this.name}`);
    }

    return result;
  }
}

export class Equals implements IConstraint {
  constructor(readonly left: Constraint, readonly right: Constraint) {

  }

  evaluate(env: UnificationEnvironment): CrochetValue {
    return from_bool(this.left.evaluate(env).equals(this.right.evaluate(env)));
  }
}

export class Value implements IConstraint {
  constructor(readonly value: CrochetValue) {
    
  }

  evaluate(env: UnificationEnvironment): CrochetValue {
    return this.value;
  }
}