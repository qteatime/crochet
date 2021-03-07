import { from_bool, CrochetValue } from "../primitives";
import { Core } from "../primitives";
import { UnificationEnvironment } from "./unification";

export type Constraint = And | Or | Not | Variable | Equals | Value;

interface IConstraint {
  evaluate(env: UnificationEnvironment): CrochetValue;
  variables: string[];
}

export class And implements IConstraint {
  constructor(readonly left: Constraint, readonly right: Constraint) {}

  evaluate(env: UnificationEnvironment): CrochetValue {
    return Core.band(this.left.evaluate(env), this.right.evaluate(env));
  }

  get variables(): string[] {
    return this.left.variables.concat(this.right.variables);
  }
}

export class Or implements IConstraint {
  constructor(readonly left: Constraint, readonly right: Constraint) {}

  evaluate(env: UnificationEnvironment): CrochetValue {
    return Core.bor(this.left.evaluate(env), this.right.evaluate(env));
  }

  get variables(): string[] {
    return this.left.variables.concat(this.right.variables);
  }
}

export class Not implements IConstraint {
  constructor(readonly constraint: Constraint) {}

  evaluate(env: UnificationEnvironment): CrochetValue {
    return Core.bnot(this.constraint.evaluate(env));
  }

  get variables(): string[] {
    return this.constraint.variables;
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

  get variables() {
    return [this.name];
  }
}

export class Equals implements IConstraint {
  constructor(readonly left: Constraint, readonly right: Constraint) {}

  evaluate(env: UnificationEnvironment): CrochetValue {
    return Core.eq(this.left.evaluate(env), this.right.evaluate(env));
  }

  get variables(): string[] {
    return this.left.variables.concat(this.right.variables);
  }
}

export class Value implements IConstraint {
  constructor(readonly value: CrochetValue) {}

  evaluate(env: UnificationEnvironment): CrochetValue {
    return this.value;
  }

  get variables(): string[] {
    return [];
  }
}
