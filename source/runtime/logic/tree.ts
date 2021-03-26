import { CrochetValue } from "../primitives";
import { State } from "../vm";
import { World } from "../world";
import { Pattern, UnificationEnvironment } from "./unification";

class Pair {
  constructor(readonly value: CrochetValue, public tree: Tree) {}
}

export abstract class TreeType {
  abstract realise(): Tree;
}

export class TTOne extends TreeType {
  constructor(readonly next: TreeType) {
    super();
  }

  realise() {
    return new OneNode(this.next);
  }
}
export class TTMany extends TreeType {
  constructor(readonly next: TreeType) {
    super();
  }

  realise() {
    return new ManyNode(this.next);
  }
}
export class TTEnd extends TreeType {
  realise() {
    return new EndNode();
  }
}

export abstract class Tree {
  abstract type: TreeType;

  abstract insert(values: CrochetValue[]): void;
  abstract remove(values: CrochetValue[]): Tree | null;

  abstract search(
    state: State,
    env: UnificationEnvironment,
    patterns: Pattern[]
  ): UnificationEnvironment[];

  abstract sample(
    size: number,
    state: State,
    env: UnificationEnvironment,
    patterns: Pattern[]
  ): UnificationEnvironment[];
}

export class OneNode extends Tree {
  private value: Pair | null = null;
  constructor(readonly subtype: TreeType) {
    super();
  }

  get type() {
    return new TTOne(this.subtype);
  }

  insert(values: CrochetValue[]) {
    const [head, ...tail] = values;
    if (this.value == null || !this.value.value.equals(head)) {
      this.value = new Pair(head, this.subtype.realise());
      this.value.tree.insert(tail);
    } else {
      this.value.tree.insert(tail);
    }
  }

  remove(values: CrochetValue[]) {
    const [head, ...tail] = values;
    if (this.value == null) {
      return null;
    }

    if (head.equals(this.value.value)) {
      this.value = null;
      return null;
    } else {
      const result = this.value.tree.remove(tail);
      if (result == null) {
        this.value = null;
        return null;
      } else {
        this.value.tree = result;
        return this;
      }
    }
  }

  search(
    state: State,
    env: UnificationEnvironment,
    patterns: Pattern[]
  ): UnificationEnvironment[] {
    if (this.value == null) {
      return [];
    }

    const [head, ...tail] = patterns;
    const newEnv = head.unify(state, env, this.value.value);
    if (newEnv == null) {
      return [];
    } else {
      return this.value.tree.search(state, newEnv, tail);
    }
  }

  sample(
    size: number,
    state: State,
    env: UnificationEnvironment,
    patterns: Pattern[]
  ): UnificationEnvironment[] {
    if (this.value == null) {
      return [];
    }

    const [head, ...tail] = patterns;
    const newEnv = head.unify(state, env, this.value.value);
    if (newEnv == null) {
      return [];
    } else {
      return this.value.tree.sample(size, state, newEnv, tail);
    }
  }
}

export class ManyNode extends Tree {
  private pairs: Pair[] = [];
  constructor(readonly subtype: TreeType) {
    super();
  }

  get type() {
    return new TTMany(this.subtype);
  }

  insert(values: CrochetValue[]) {
    const [head, ...tail] = values;
    for (const pair of this.pairs) {
      if (pair.value.equals(head)) {
        pair.tree.insert(tail);
        return;
      }
    }

    const subtree = this.subtype.realise();
    this.pairs.push(new Pair(head, subtree));
    subtree.insert(tail);
  }

  remove(values: CrochetValue[]) {
    const [head, ...tail] = values;
    this.pairs = this.pairs.flatMap((pair) => {
      if (pair.value.equals(head)) {
        const result = pair.tree.remove(tail);
        if (result == null) {
          return [];
        } else {
          return [new Pair(pair.value, result)];
        }
      } else {
        return [pair];
      }
    });

    if (this.pairs.length === 0) {
      return null;
    } else {
      return this;
    }
  }

  search(
    state: State,
    env: UnificationEnvironment,
    patterns: Pattern[]
  ): UnificationEnvironment[] {
    const [head, ...tail] = patterns;

    return this.pairs.flatMap((pair) => {
      const newEnv = head.unify(state, env, pair.value);
      if (newEnv == null) {
        return [];
      } else {
        return pair.tree.search(state, newEnv, tail);
      }
    });
  }

  sample(
    size: number,
    state: State,
    env: UnificationEnvironment,
    patterns: Pattern[]
  ): UnificationEnvironment[] {
    const [head, ...tail] = patterns;

    const result: UnificationEnvironment[] = [];
    const envs = this.pairs.flatMap((pair) => {
      const newEnv = head.unify(state, env, pair.value);
      if (newEnv == null) {
        return [];
      } else {
        return [{ env: newEnv, tree: pair.tree }];
      }
    });

    while (result.length < size) {
      const choice = state.random.random_choice_mut(envs);
      if (choice == null) {
        return result;
      } else {
        const envs = choice.tree.sample(size, state, choice.env, tail);
        result.push.apply(result, envs);
      }
    }

    return result;
  }
}

export class EndNode extends Tree {
  get type() {
    return new TTEnd();
  }

  insert(values: CrochetValue[]) {
    if (values.length !== 0) {
      throw new Error(`non-empty insertion on end node`);
    }
  }

  remove(values: CrochetValue[]) {
    if (values.length !== 0) {
      throw new Error(`non-empty deletion on end node`);
    } else {
      return null;
    }
  }

  search(
    state: State,
    env: UnificationEnvironment,
    patterns: Pattern[]
  ): UnificationEnvironment[] {
    if (patterns.length !== 0) {
      throw new Error(`non-empty search on end node`);
    }

    return [env];
  }

  sample(
    size: number,
    state: State,
    env: UnificationEnvironment,
    patterns: Pattern[]
  ) {
    if (patterns.length !== 0) {
      throw new Error(`non-empty search on end node`);
    }

    return [env];
  }
}
