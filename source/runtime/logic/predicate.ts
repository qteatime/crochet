import { zip } from "../../utils/utils";
import { World } from "../world";
import { Constraint } from "./constraint";
import { Database } from "./database";
import { Effect } from "./effect";
import { Tree } from "./tree";
import { Pattern, UnificationEnvironment } from "./unification";

export class Predicate {
  constructor(
    readonly relations: PredicateRelation[],
    readonly constraint: Constraint
  ) {}

  search(world: World, env: UnificationEnvironment, db: Database) {
    return this.relations
      .reduce(
        (envs, relation) => {
          return envs.flatMap((env) => relation.search(world, env, db));
        },
        [env]
      )
      .filter((env) => {
        return this.constraint.evaluate(env).as_bool();
      });
  }
}

export type PredicateRelation = HasRelation | NotRelation;

interface IPredicateRelation {
  search(
    world: World,
    env: UnificationEnvironment,
    db: Database
  ): UnificationEnvironment[];
}

export class HasRelation implements IPredicateRelation {
  constructor(readonly name: string, readonly patterns: Pattern[]) {}

  search(world: World, env: UnificationEnvironment, db: Database) {
    const relation = db.lookup(this.name);
    return relation.search(world, env, this.patterns, db);
  }
}

export class NotRelation implements IPredicateRelation {
  constructor(readonly name: string, readonly patterns: Pattern[]) {}

  search(world: World, env: UnificationEnvironment, db: Database) {
    const relation = db.lookup(this.name);
    const results = relation.search(world, env, this.patterns, db);
    if (results.length === 0) {
      return [env];
    } else {
      return [];
    }
  }
}

export type MappedRelation = ConcreteRelation | PredicateProcedure;

interface IRelation {
  search(
    world: World,
    env: UnificationEnvironment,
    patterns: Pattern[],
    database: Database
  ): UnificationEnvironment[];
}

export class ConcreteRelation implements IRelation {
  constructor(readonly name: string, readonly tree: Tree) {}

  search(
    world: World,
    env: UnificationEnvironment,
    patterns: Pattern[],
    db: Database
  ): UnificationEnvironment[] {
    return this.tree.search(world, env, patterns);
  }
}

export class PredicateProcedure implements IRelation {
  constructor(
    readonly name: string,
    readonly parameters: string[],
    readonly clauses: PredicateClause[]
  ) {}

  search(
    world: World,
    env: UnificationEnvironment,
    patterns: Pattern[],
    db: Database
  ): UnificationEnvironment[] {
    const bindings = [...zip(this.parameters, patterns)];
    for (const clause of this.clauses) {
      const result = clause.evaluate(world, env, bindings, db);
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
    world: World,
    env: UnificationEnvironment,
    bindings: [string, Pattern][],
    db: Database
  ) {
    return this.predicate.search(world, env, db).flatMap((env0) => {
      const env1 = join(world, env0, env, bindings);
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
  world: World,
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

    const newEnv = pattern.unify(world, env, value);
    if (newEnv == null) {
      return null;
    } else {
      env = newEnv;
    }
  }

  return env;
}
