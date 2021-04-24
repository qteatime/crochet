import { cast, zip } from "../../utils/utils";
import { Expression, generated_node, Metadata, Type } from "../ir";
import { TCrochetType } from "../primitives";
import { cvalue, State, Thread } from "../vm";
import { World } from "../world";
import { Database } from "./database";
import { Effect } from "./effect";
import { Tree } from "./tree";
import { Pattern, UnificationEnvironment } from "./unification";

export abstract class Predicate {
  abstract search(
    state: State,
    env: UnificationEnvironment
  ): UnificationEnvironment[];
}

export class ConstrainedPredicate extends Predicate {
  constructor(readonly predicate: Predicate, readonly constraint: Expression) {
    super();
  }

  search(state: State, env: UnificationEnvironment): UnificationEnvironment[] {
    return this.predicate.search(state, env).filter((env) => {
      const evalEnv = state.env.extend_with_unification(env);
      const evalState = state.with_env(evalEnv);
      const value = cvalue(
        Thread.for_expr(this.constraint, evalState).run_sync()
      );

      return value.as_bool();
    });
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
  constructor(readonly name: string, readonly expr: Expression) {
    super();
  }

  search(state: State, env: UnificationEnvironment) {
    const evalEnv = state.env.extend_with_unification(env);
    const evalState = state.with_env(evalEnv);
    const value = cvalue(Thread.for_expr(this.expr, evalState).run_sync());

    const newEnv = env.clone();
    newEnv.bind(this.name, value);
    return [newEnv];
  }
}

export class TypePredicate extends Predicate {
  constructor(readonly name: string, readonly type: Type) {
    super();
  }

  search(state: State, env: UnificationEnvironment) {
    const type = cast(this.type.realise(state), TCrochetType);
    return type.registered_instances.map((v) => {
      const newEnv = env.clone();
      newEnv.bind(this.name, v);
      return newEnv;
    });
  }
}

export class SamplePredicate extends Predicate {
  constructor(readonly size: number, readonly pool: SamplingPool) {
    super();
  }

  search(state: State, env: UnificationEnvironment) {
    return this.pool.sample(this.size, state, env);
  }
}

export abstract class SamplingPool {
  abstract sample(
    size: number,
    state: State,
    env: UnificationEnvironment
  ): UnificationEnvironment[];
}

export class SamplingRelation extends SamplingPool {
  constructor(readonly name: string, readonly patterns: Pattern[]) {
    super();
  }

  sample(size: number, state: State, env: UnificationEnvironment) {
    const relation = state.database.lookup(this.name);
    return relation.sample(size, state, env, this.patterns);
  }
}

export class SamplingType extends SamplingPool {
  constructor(readonly name: string, readonly type: Type) {
    super();
  }

  sample(size: number, state: State, env: UnificationEnvironment) {
    const type = cast(this.type.realise(state), TCrochetType);
    const instances = type.registered_instances;
    const sampled = state.random.random_choice_many(size, instances);
    return sampled.map((s) => {
      const newEnv = env.clone();
      newEnv.bind(this.name, s);
      return newEnv;
    });
  }
}

export abstract class MappedRelation {
  abstract search(
    state: State,
    env: UnificationEnvironment,
    patterns: Pattern[]
  ): UnificationEnvironment[];

  sample(
    size: number,
    state: State,
    env: UnificationEnvironment,
    patterns: Pattern[]
  ) {
    return state.random.random_choice_many(
      size,
      this.search(state, env, patterns)
    );
  }
}

export class ConcreteRelation extends MappedRelation {
  constructor(
    readonly meta: Metadata,
    readonly name: string,
    readonly tree: Tree
  ) {
    super();
  }

  search(
    state: State,
    env: UnificationEnvironment,
    patterns: Pattern[]
  ): UnificationEnvironment[] {
    return this.tree.search(state, env, patterns);
  }

  sample(
    size: number,
    state: State,
    env: UnificationEnvironment,
    patterns: Pattern[]
  ): UnificationEnvironment[] {
    return this.tree.sample(size, state, env, patterns);
  }
}

export type FunctionRelationFn = (
  state: State,
  env: UnificationEnvironment,
  patterns: Pattern[]
) => UnificationEnvironment[];

export class FunctionRelation extends MappedRelation {
  constructor(readonly name: string, readonly code: FunctionRelationFn) {
    super();
  }

  search(
    state: State,
    env: UnificationEnvironment,
    patterns: Pattern[]
  ): UnificationEnvironment[] {
    return this.code(state, env, patterns);
  }
}

export class PredicateProcedure extends MappedRelation {
  readonly metadata: Metadata = generated_node;

  constructor(
    readonly name: string,
    readonly parameters: string[],
    readonly clauses: PredicateClause[]
  ) {
    super();
  }

  set_metadata(metadata: Metadata) {
    (this as any).metadata = metadata;
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
