import { zip } from "../../utils/utils";
import { State } from "../vm";
import { World } from "../world";
import { Constraint } from "./constraint";
import { Database } from "./database";
import { Effect } from "./effect";
import { Tree } from "./tree";
import { Pattern, UnificationEnvironment } from "./unification";

export type Predicate =
  | HasRelation
  | NotPredicate
  | AndPredicate
  | OrPredicate
  | ConstrainedPredicate
  | AlwaysPredicate;

interface IPredicateRelation {
  search(state: State, env: UnificationEnvironment): UnificationEnvironment[];
}

export class ConstrainedPredicate implements IPredicateRelation {
  constructor(readonly predicate: Predicate, readonly constraint: Constraint) {}

  search(state: State, env: UnificationEnvironment): UnificationEnvironment[] {
    return this.predicate
      .search(state, env)
      .filter((env) => this.constraint.evaluate(env).as_bool());
  }
}

export class AndPredicate implements IPredicateRelation {
  constructor(readonly left: Predicate, readonly right: Predicate) {}

  search(state: State, env: UnificationEnvironment): UnificationEnvironment[] {
    return this.left
      .search(state, env)
      .flatMap((env) => this.right.search(state, env));
  }
}

export class OrPredicate implements IPredicateRelation {
  constructor(readonly left: Predicate, readonly right: Predicate) {}

  search(state: State, env: UnificationEnvironment): UnificationEnvironment[] {
    const lresult = this.left.search(state, env);
    if (lresult.length !== 0) {
      return lresult;
    } else {
      return this.right.search(state, env);
    }
  }
}

export class HasRelation implements IPredicateRelation {
  constructor(readonly name: string, readonly patterns: Pattern[]) {}

  search(state: State, env: UnificationEnvironment) {
    const relation = state.database.lookup(this.name);
    return relation.search(state, env, this.patterns);
  }
}

export class NotPredicate implements IPredicateRelation {
  constructor(readonly predicate: Predicate) {}

  search(state: State, env: UnificationEnvironment) {
    const result = this.predicate.search(state, env);
    if (result.length === 0) {
      return [env];
    } else {
      return [];
    }
  }
}

export class AlwaysPredicate implements IPredicateRelation {
  search(state: State, env: UnificationEnvironment) {
    return [env];
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
  constructor(readonly name: string, readonly tree: Tree) {}

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
  constructor(
    readonly name: string,
    readonly parameters: string[],
    readonly clauses: PredicateClause[]
  ) {}

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
    const value = env0.lookup(key);
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
