import { zip } from "../../utils/utils";
import { Constraint } from "./constraint";
import { Database } from "./database";
import { Effect } from "./effect";
import { Tree } from "./tree";
import { Pattern, UnificationEnvironment } from "./unification";

export class Predicate {
  constructor(readonly relations: Relation[], readonly constraint: Constraint) {}

  search(env: UnificationEnvironment, db: Database) {
    return this.relations.reduce((envs, relation) => {
      return envs.flatMap(env => relation.search(env, db));
    }, [env]).filter(env => {
      return this.constraint.evaluate(env).as_bool();
    })
  }
}

export class Relation {
  constructor(readonly name: string, readonly patterns: Pattern[]) {}

  search(env: UnificationEnvironment, db: Database) {
    const relation = db.lookup(this.name);
    if (relation == null) {
      throw new Error(`Undefined relation ${this.name}`);
    }
    return relation.search(env, this.patterns, db);
  }
}

export type MappedRelation = ConcreteRelation | PredicateProcedure;

interface IRelation {
  search(env: UnificationEnvironment, patterns: Pattern[], database: Database): UnificationEnvironment[];
}

export class ConcreteRelation implements IRelation {
  constructor(readonly name: string, readonly tree: Tree) {}

  search(env: UnificationEnvironment, patterns: Pattern[], db: Database): UnificationEnvironment[] {
    return this.tree.search(env, patterns);
  }
}

export class PredicateProcedure implements IRelation {
  constructor(readonly name: string, readonly parameters: string[], readonly clauses: PredicateClause[]) {
  }

  search(env: UnificationEnvironment, patterns: Pattern[], db: Database): UnificationEnvironment[] {
    const bindings = [...zip(this.parameters, patterns)];
    for (const clause of this.clauses) {
      const result = clause.evaluate(env, bindings, db);
      if (result.length !== 0) {
        return result;
      }
    }
    return [];
  }
}

export class PredicateClause {
  constructor(readonly predicate: Predicate, readonly effect: Effect) {}

  evaluate(env: UnificationEnvironment, bindings: [string, Pattern][], db: Database) {
    return this.predicate.search(env, db).flatMap(env0 => {
      const env1 = join(env0, env, bindings);
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

function join(env0: UnificationEnvironment, resultEnv: UnificationEnvironment, bindings: [string, Pattern][]) {
  let env = resultEnv;

  for (const [key, pattern] of bindings) {
    const value = env0.lookup(key);
    if (value == null) {
      return null;
    }

    const newEnv = pattern.unify(env, value);
    if (newEnv == null) {
      return null;
    } else {
      env = newEnv;
    }
  }

  return env;
}