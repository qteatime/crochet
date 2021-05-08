import * as IR from "../../ir";
import { unreachable } from "../../utils/utils";
import { XorShift } from "../../utils/xorshift";
import {
  CrochetModule,
  CrochetValue,
  Environment,
  Pair,
  State,
  Tree,
  TreeMany,
  TreeOne,
  TreeTag,
  TreeType,
  tree_end,
  TTMany,
  TTOne,
} from "../intrinsics";
import { Values } from "../primitives";
import { unify } from "./unification";

export function materialise_type(type: IR.RelationType[]) {
  return type.reduceRight((prev, type) => {
    switch (type.multiplicity) {
      case IR.RelationMultiplicity.ONE:
        return new TTOne(prev);

      case IR.RelationMultiplicity.MANY:
        return new TTMany(prev);

      default:
        throw unreachable(type.multiplicity, `Tree Type`);
    }
  }, tree_end as TreeType);
}

export function materialise(type: TreeType) {
  switch (type.tag) {
    case TreeTag.ONE: {
      return new TreeOne(type.next);
    }

    case TreeTag.MANY: {
      return new TreeMany(type.next);
    }

    case TreeTag.END: {
      return tree_end;
    }

    default:
      throw unreachable(type, `Tree Type`);
  }
}

export function insert(tree: Tree, values: CrochetValue[]): boolean {
  let changed: boolean = false;

  function go(tree: Tree, index: number) {
    switch (tree.tag) {
      case TreeTag.ONE: {
        const head = values[index];
        if (tree.value == null || !Values.equals(head, tree.value.value)) {
          tree.value = new Pair(head, materialise(tree.type));
          changed = true;
          go(tree.value.tree, index + 1);
        } else {
          go(tree.value.tree, index + 1);
        }
        return;
      }

      case TreeTag.MANY: {
        const head = values[index];
        for (const pair of tree.pairs) {
          if (Values.equals(head, pair.value)) {
            go(pair.tree, index + 1);
            return;
          }
        }

        const subtree = materialise(tree.type);
        tree.pairs.push(new Pair(head, subtree));
        changed = true;
        go(subtree, index + 1);
        return;
      }

      case TreeTag.END: {
        return;
      }

      default:
        throw unreachable(tree, `Tree`);
    }
  }

  go(tree, 0);
  return changed;
}

export function remove(
  tree: Tree,
  values: CrochetValue[]
): { changed: boolean; tree: Tree | null } {
  let changed: boolean = false;

  function go(tree: Tree, index: number) {
    switch (tree.tag) {
      case TreeTag.ONE: {
        const head = values[index];
        if (tree.value == null) {
          return null;
        }

        if (Values.equals(head, tree.value.value)) {
          changed = true;
          tree.value = null;
          return null;
        } else {
          const result = go(tree.value.tree, index + 1);
          if (result == null) {
            changed = true;
            tree.value = null;
            return null;
          } else {
            tree.value.tree = result;
            return tree;
          }
        }
      }

      case TreeTag.MANY: {
        const head = values[index];
        const new_pairs: Pair[] = [];
        for (const pair of tree.pairs) {
          if (Values.equals(head, pair.value)) {
            const result = go(pair.tree, index + 1);
            if (result == null) {
              changed = true;
            } else {
              new_pairs.push(new Pair(pair.value, result));
            }
          } else {
            new_pairs.push(pair);
          }
        }

        if (new_pairs.length === 0) {
          return null;
        } else {
          tree.pairs = new_pairs;
          return tree;
        }
      }

      case TreeTag.END: {
        changed = true;
        return null;
      }

      default:
        throw unreachable(tree, `Tree`);
    }
  }

  return { changed, tree: go(tree, 0) };
}

export function search(
  state: State,
  module: CrochetModule,
  env: Environment,
  tree: Tree,
  patterns: IR.Pattern[]
) {
  function* go(
    tree: Tree,
    env: Environment,
    index: number
  ): Generator<Environment> {
    switch (tree.tag) {
      case TreeTag.ONE: {
        if (tree.value == null) {
          break;
        }

        const head = patterns[index];
        const new_env = unify(state, module, env, tree.value.value, head);
        if (new_env != null) {
          yield* go(tree.value.tree, new_env, index + 1);
        }
        break;
      }

      case TreeTag.MANY: {
        const head = patterns[index];
        for (const pair of tree.pairs) {
          const new_env = unify(state, module, env, pair.value, head);
          if (new_env != null) {
            yield* go(pair.tree, new_env, index + 1);
          }
        }
        break;
      }

      case TreeTag.END: {
        yield env;
        break;
      }

      default:
        throw unreachable(tree, `Tree`);
    }
  }

  return [...go(tree, env, 0)];
}

export function sample(
  state: State,
  module: CrochetModule,
  random: XorShift,
  size: number,
  env: Environment,
  tree: Tree,
  patterns: IR.Pattern[]
) {
  function* go(
    tree: Tree,
    env: Environment,
    index: number
  ): Generator<Environment> {
    switch (tree.tag) {
      case TreeTag.ONE: {
        if (tree.value == null) {
          break;
        }

        const head = patterns[index];
        const new_env = unify(state, module, env, tree.value.value, head);
        if (new_env != null) {
          yield* go(tree.value.tree, new_env, index + 1);
        }
        break;
      }

      case TreeTag.MANY: {
        const head = patterns[index];

        const pairs: { env: Environment; tree: Tree }[] = [];
        for (const pair of tree.pairs) {
          const new_env = unify(state, module, env, pair.value, head);
          if (new_env != null) {
            pairs.push({ env: new_env, tree: pair.tree });
          }
        }

        while (pairs.length > 0) {
          const choice = random.random_choice_mut(pairs);
          if (choice == null) {
            break;
          } else {
            yield* go(choice.tree, choice.env, index + 1);
          }
        }

        break;
      }

      case TreeTag.END: {
        yield env;
        break;
      }

      default:
        throw unreachable(tree, `Tree`);
    }
  }

  const results: Environment[] = [];
  for (const x of go(tree, env, 0)) {
    if (results.length > size) {
      break;
    }
    results.push(x);
  }

  return results;
}
