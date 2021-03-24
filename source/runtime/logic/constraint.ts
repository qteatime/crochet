import { Type } from "../ir";
import { from_bool, CrochetValue } from "../primitives";
import { State } from "../vm";
import { BinOp, do_bin_op } from "./primitives";
import { UnificationEnvironment } from "./unification";

export abstract class Constraint {
  abstract evaluate(env: UnificationEnvironment, state: State): CrochetValue;
}

export class And extends Constraint {
  constructor(readonly left: Constraint, readonly right: Constraint) {
    super();
  }

  evaluate(env: UnificationEnvironment, state: State): CrochetValue {
    return from_bool(
      this.left.evaluate(env, state).as_bool() &&
        this.right.evaluate(env, state).as_bool()
    );
  }
}

export class Or extends Constraint {
  constructor(readonly left: Constraint, readonly right: Constraint) {
    super();
  }

  evaluate(env: UnificationEnvironment, state: State): CrochetValue {
    return from_bool(
      this.left.evaluate(env, state).as_bool() ||
        this.right.evaluate(env, state).as_bool()
    );
  }
}

export class Not extends Constraint {
  constructor(readonly constraint: Constraint) {
    super();
  }

  evaluate(env: UnificationEnvironment, state: State): CrochetValue {
    return from_bool(!this.constraint.evaluate(env, state).as_bool());
  }
}

export class BinaryConstraint extends Constraint {
  constructor(
    readonly op: BinOp,
    readonly left: Constraint,
    readonly right: Constraint
  ) {
    super();
  }

  evaluate(env: UnificationEnvironment, state: State): CrochetValue {
    const left = this.left.evaluate(env, state);
    const right = this.right.evaluate(env, state);
    return do_bin_op(this.op, left, right);
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
}

export class Global extends Constraint {
  constructor(readonly name: string) {
    super();
  }

  evaluate(env: UnificationEnvironment, state: State): CrochetValue {
    return state.world.globals.lookup(this.name);
  }
}

export class Equals extends Constraint {
  constructor(readonly left: Constraint, readonly right: Constraint) {
    super();
  }

  evaluate(env: UnificationEnvironment, state: State): CrochetValue {
    return from_bool(
      this.left.evaluate(env, state).equals(this.right.evaluate(env, state))
    );
  }
}

export class Value extends Constraint {
  constructor(readonly value: CrochetValue) {
    super();
  }

  evaluate(env: UnificationEnvironment, state: State): CrochetValue {
    return this.value;
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
}
