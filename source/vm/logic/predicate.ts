import { CrochetValue } from "../../crochet";
import * as IR from "../../ir";
import { unreachable } from "../../utils/utils";
import { XorShift } from "../../utils/xorshift";
import {
  CrochetModule,
  CrochetRelation,
  Environment,
  NativeSignal,
  NSEvaluate,
  State,
  Universe,
} from "../intrinsics";
import * as Tree from "./tree";
import * as Relations from "./relations";
import { Namespace } from "../namespaces";
import { Environments, Types, Values } from "../primitives";

export function search(
  state: State,
  env: Environment,
  module: CrochetModule,
  random: XorShift,
  relations: Namespace<CrochetRelation>,
  predicate: IR.Predicate
) {
  const t = IR.PredicateTag;
  function* go(
    predicate: IR.Predicate,
    env: Environment
  ): Generator<NativeSignal, Environment[], CrochetValue> {
    switch (predicate.tag) {
      case t.ALWAYS: {
        return [env];
      }

      case t.AND: {
        const result = [];
        const lenvs = yield* go(predicate.left, env);
        for (const lenv of lenvs) {
          const renvs = yield* go(predicate.right, lenv);
          for (const e of renvs) {
            result.push(e);
          }
        }
        return result;
      }

      case t.CONSTRAIN: {
        const result = [];
        const envs = yield* go(predicate.predicate, env);
        for (const e of envs) {
          const value = yield new NSEvaluate(
            Environments.clone(e),
            predicate.constraint
          );
          if (Values.get_boolean(value)) {
            result.push(e);
          }
        }
        return result;
      }

      case t.LET: {
        const env1 = Environments.clone(env);
        const value = yield new NSEvaluate(
          Environments.clone(env),
          predicate.value
        );
        env1.define(predicate.name, value);
        return [env1];
      }

      case t.NOT: {
        const envs = yield* go(predicate.pred, env);
        if (envs.length === 0) {
          return [env];
        } else {
          return [];
        }
      }

      case t.OR: {
        const lenvs = yield* go(predicate.left, env);
        if (lenvs.length !== 0) {
          return lenvs;
        } else {
          return yield* go(predicate.right, env);
        }
      }

      case t.RELATION: {
        const relation = Relations.lookup(
          module,
          relations,
          predicate.relation
        );
        const envs = Relations.search(
          state,
          module,
          env,
          relation,
          predicate.patterns
        );
        return envs;
      }

      case t.SAMPLE_RELATION: {
        const relation = Relations.lookup(
          module,
          relations,
          predicate.relation
        );
        const envs = Relations.sample(
          state,
          module,
          random,
          predicate.size,
          env,
          relation,
          predicate.patterns
        );
        return envs;
      }

      case t.TYPE: {
        const result: Environment[] = [];
        const type = Types.materialise_type(
          state.universe,
          module,
          predicate.type
        );
        const instances = Types.registered_instances(state.universe, type);
        for (const x of instances) {
          const new_env = Environments.clone(env);
          new_env.define(predicate.name, x);
          result.push(new_env);
        }
        return result;
      }

      case t.SAMPLE_TYPE: {
        const result: Environment[] = [];
        const type = Types.materialise_type(
          state.universe,
          module,
          predicate.type
        );
        const instances = [...Types.registered_instances(state.universe, type)];
        const sampled = random.random_choice_many(predicate.size, instances);
        for (const x of sampled) {
          const new_env = Environments.clone(env);
          new_env.define(predicate.name, x);
          result.push(new_env);
        }
        return result;
      }

      default:
        throw unreachable(predicate, `Predicate`);
    }
  }

  return go(predicate, env);
}

export function* run_search(
  universe: Universe,
  mark: Environment,
  machine: Generator<NativeSignal, Environment[], CrochetValue>
) {
  const envs = yield* machine;
  const result: CrochetValue[] = [];
  for (const e of envs) {
    const bound = Environments.bound_values_up_to(mark, e);
    result.push(Values.make_record_from_map(universe, bound));
  }
  return Values.make_tuple(universe, result);
}

export function* run_match_case(
  universe: Universe,
  base_env: Environment,
  bindings: Map<string, CrochetValue>[],
  block: IR.BasicBlock
): Generator<NativeSignal, CrochetValue, CrochetValue> {
  const result: CrochetValue[] = [];
  for (const binds of bindings) {
    const new_env = Environments.clone_with_bindings(base_env, binds);
    const value = yield new NSEvaluate(new_env, block);
    result.push(value);
  }
  return Values.make_tuple(universe, result);
}
