import { Type } from "../ir";
import { from_bool, CrochetValue } from "../primitives";
import { Core } from "../primitives";
import { State } from "../vm";
import { UnificationEnvironment } from "./unification";

export abstract class Constraint {
  abstract evaluate(env: UnificationEnvironment, state: State): CrochetValue;
  abstract variables: string[];
}

export class And extends Constraint {
  constructor(readonly left: Constraint, readonly right: Constraint) {
    super();
  }

  evaluate(env: UnificationEnvironment, state: State): CrochetValue {
    return Core.band(
      this.left.evaluate(env, state),
      this.right.evaluate(env, state)
    );
  }

  get variables(): string[] {
    return this.left.variables.concat(this.right.variables);
  }
}

export class Or extends Constraint {
  constructor(readonly left: Constraint, readonly right: Constraint) {
    super();
  }

  evaluate(env: UnificationEnvironment, state: State): CrochetValue {
    return Core.bor(
      this.left.evaluate(env, state),
      this.right.evaluate(env, state)
    );
  }

  get variables(): string[] {
    return this.left.variables.concat(this.right.variables);
  }
}

export class Not extends Constraint {
  constructor(readonly constraint: Constraint) {
    super();
  }

  evaluate(env: UnificationEnvironment, state: State): CrochetValue {
    return Core.bnot(this.constraint.evaluate(env, state));
  }

  get variables(): string[] {
    return this.constraint.variables;
  }
}

export class Variable extends Constraint {
  constructor(readonly name: string) {
    super();
  }

  evaluate(env: UnificationEnvironment, state: State): CrochetValue {
    const result = env.try_lookup(this.name) ?? state.env.try_lookup(this.name);
    if (result == null) {
      throw new Error(`Undefined constraint variable ${this.name}`);
    }

    return result;
  }

  get variables() {
    return [this.name];
  }
}

export class Global extends Constraint {
  constructor(readonly name: string) {
    super();
  }

  evaluate(env: UnificationEnvironment, state: State): CrochetValue {
    return state.world.globals.lookup(this.name);
  }

  get variables(): string[] {
    return [];
  }
}

export class Equals extends Constraint {
  constructor(readonly left: Constraint, readonly right: Constraint) {
    super();
  }

  evaluate(env: UnificationEnvironment, state: State): CrochetValue {
    return Core.eq(
      this.left.evaluate(env, state),
      this.right.evaluate(env, state)
    );
  }

  get variables(): string[] {
    return this.left.variables.concat(this.right.variables);
  }
}

export class Value extends Constraint {
  constructor(readonly value: CrochetValue) {
    super();
  }

  evaluate(env: UnificationEnvironment, state: State): CrochetValue {
    return this.value;
  }

  get variables(): string[] {
    return [];
  }
}

export class HasRole extends Constraint {
  constructor(readonly value: Constraint, readonly role: string) {
    super();
  }

  evaluate(env: UnificationEnvironment, state: State): CrochetValue {
    const value = this.value.evaluate(env, state);
    const role = state.world.roles.lookup(this.role);
    return from_bool(value.has_role(role));
  }

  get variables(): string[] {
    return [];
  }
}

export class HasType extends Constraint {
  constructor(readonly value: Constraint, readonly type: Type) {
    super();
  }

  evaluate(env: UnificationEnvironment, state: State): CrochetValue {
    const value = this.value.evaluate(env, state);
    const type = this.type.realise(state.world);
    return from_bool(type.accepts(value));
  }

  get variables(): string[] {
    return [];
  }
}
