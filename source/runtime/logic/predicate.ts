import { zip } from "../../utils/utils";
import { State } from "../vm";
import { World } from "../world";
import { Constraint } from "./constraint";
import { Database } from "./database";
import { Effect } from "./effect";
import { PredicateExpr } from "./predicate-expr";
import { Tree } from "./tree";
import { Pattern, UnificationEnvironment } from "./unification";

export abstract class Predicate {
  abstract search(
    state: State,
    env: UnificationEnvironment
  ): UnificationEnvironment[];
}

export class ConstrainedPredicate extends Predicate {
  constructor(readonly predicate: Predicate, readonly constraint: Constraint) {
    super();
  }

  search(state: State, env: UnificationEnvironment): UnificationEnvironment[] {
    return this.predicate
      .search(state, env)
      .filter((env) => this.constraint.evaluate(env, state).as_bool());
  }
}

export class AndPredicate extends Predicate {
  constructor(readonly left: Predicate, readonly right: Predicate) {
    super();
  }

  search(state: State, env: UnificationEnvironment): UnificationEnvironment[] {
    return this.left
      .search(state, env)
      .flatMap((env) => this.right.search(state, env));
  }
}

export class OrPredicate extends Predicate {
  constructor(readonly left: Predicate, readonly right: Predicate) {
    super();
  }

  search(state: State, env: UnificationEnvironment): UnificationEnvironment[] {
    const lresult = this.left.search(state, env);
    if (lresult.length !== 0) {
      return lresult;
    } else {
      return this.right.search(state, env);
    }
  }
}

export class HasRelation extends Predicate {
  constructor(readonly name: string, readonly patterns: Pattern[]) {
    super();
  }

  search(state: State, env: UnificationEnvironment) {
    const relation = state.database.lookup(this.name);
    return relation.search(state, env, this.patterns);
  }
}

export class NotPredicate extends Predicate {
  constructor(readonly predicate: Predicate) {
    super();
  }

  search(state: State, env: UnificationEnvironment) {
    const result = this.predicate.search(state, env);
    if (result.length === 0) {
      return [env];
    } else {
      return [];
    }
  }
}

export class AlwaysPredicate extends Predicate {
  search(state: State, env: UnificationEnvironment) {
    return [env];
  }
}

export class LetPredicate extends Predicate {
  constructor(readonly name: string, readonly expr: PredicateExpr) {
    super();
  }

  search(state: State, env: UnificationEnvironment) {
    const newEnv = env.clone();
    newEnv.bind(this.name, this.expr.evaluate(state, env));
    return [newEnv];
  }
}

export type MappedRelation =
  | ConcreteRelation
  | PredicateProcedure
  | FunctionRelation;

interface IRelation {
  search(
    state: State,
    env: UnificationEnvironment,
    patterns: Pattern[]
  ): UnificationEnvironment[];
}

export class ConcreteRelation implements IRelation {
  constructor(
    readonly filename: string,
    readonly name: string,
    readonly tree: Tree
  ) {}

  search(
    state: State,
    env: UnificationEnvironment,
    patterns: Pattern[]
  ): UnificationEnvironment[] {
    return this.tree.search(state, env, patterns);
  }
}

export type FunctionRelationFn = (
  state: State,
  env: UnificationEnvironment,
  patterns: Pattern[]
) => UnificationEnvironment[];

export class FunctionRelation implements IRelation {
  constructor(readonly name: string, readonly code: FunctionRelationFn) {}

  search(
    state: State,
    env: UnificationEnvironment,
    patterns: Pattern[]
  ): UnificationEnvironment[] {
    return this.code(state, env, patterns);
  }
}

export class PredicateProcedure implements IRelation {
  readonly filename: string | null = null;

  constructor(
    readonly name: string,
    readonly parameters: string[],
    readonly clauses: PredicateClause[]
  ) {}

  set_filename(filename: string) {
    (this as any).filename = filename;
  }

  search(
    state: State,
    env: UnificationEnvironment,
    patterns: Pattern[]
  ): UnificationEnvironment[] {
    const bindings = [...zip(this.parameters, patterns)];
    for (const clause of this.clauses) {
      const result = clause.evaluate(state, env, bindings);
      if (result.length !== 0) {
        return result;
      }
    }
    return [];
  }
}

export class PredicateClause {
  constructor(readonly predicate: Predicate, readonly effect: Effect) {}

  evaluate(
    state: State,
    env: UnificationEnvironment,
    bindings: [string, Pattern][]
  ) {
    return this.predicate.search(state, env).flatMap((env0) => {
      const env1 = join(state, env0, env, bindings);
      if (env1 == null) {
        return [];
      } else {
        const env2 = this.effect.evaluate(env1);
        if (env2 == null) {
          return [];
        } else {
          return [env2];
        }
      }
    });
  }
}

function join(
  state: State,
  env0: UnificationEnvironment,
  resultEnv: UnificationEnvironment,
  bindings: [string, Pattern][]
) {
  let env = resultEnv;

  for (const [key, pattern] of bindings) {
    const value = env0.try_lookup(key);
    if (value == null) {
      return null;
    }

    const newEnv = pattern.unify(state, env, value);
    if (newEnv == null) {
      return null;
    } else {
      env = newEnv;
    }
  }

  return env;
}
