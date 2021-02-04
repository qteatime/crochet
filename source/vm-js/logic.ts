import { CrochetValue, CrochetType } from "./intrinsics";

export class Database {
  private relations = new Map<string, RelationType>();

  add(type: RelationType) {
    if (this.relations.has(type.name)) {
      return false;
    } else {
      this.relations.set(type.name, type);
    }
  }

  lookup(name: string): RelationType | null {
    return this.relations.get(name) ?? null;
  }
}

export abstract class Pattern {
  abstract unify(
    env: UnificationEnvironment,
    value: CrochetValue
  ): UnificationEnvironment | null;
}

export class ValuePattern extends Pattern {
  constructor(readonly value: CrochetValue) {
    super();
  }

  unify(env: UnificationEnvironment, value: CrochetValue) {
    if (this.value.equals(value)) {
      return env;
    } else {
      return null;
    }
  }
}

export class TypePattern extends Pattern {
  constructor(readonly type: CrochetType) {
    super();
  }

  unify(env: UnificationEnvironment, value: CrochetValue) {
    if (this.type.hasInstance(value)) {
      return env;
    } else {
      return null;
    }
  }
}

export class VariablePattern extends Pattern {
  constructor(readonly name: string) {
    super();
  }

  unify(env: UnificationEnvironment, value: CrochetValue) {
    const bound = env.lookup(this.name);
    if (bound == null) {
      if (this.name === "_") {
        return env;
      } else {
        const new_env = env.clone();
        new_env.add(this.name, value);
        return new_env;
      }
    } else if (value.equals(bound)) {
      return env;
    } else {
      return null;
    }
  }
}

export class Pair {
  constructor(readonly value: CrochetValue, readonly tree: RelationNode) {}
}

export abstract class RelationNode {
  abstract insert(values: CrochetValue[]): void;
  abstract search(
    env: UnificationEnvironment,
    patterns: Pattern[]
  ): UnificationEnvironment[];
}

export class EndNode extends RelationNode {
  insert(values: CrochetValue[]) {
    if (values.length !== 0) {
      throw new Error(`Insert with extraneous values`);
    }
  }

  search(env: UnificationEnvironment, patterns: Pattern[]) {
    if (patterns.length !== 0) {
      throw new Error(`Search with extraneous patterns`);
    }
    return [env];
  }
}

export class ManyNode extends RelationNode {
  private trees: Pair[] = [];

  constructor(readonly new_tree: () => RelationNode) {
    super();
  }

  insert(values: CrochetValue[]) {
    const [head, ...tail] = values;

    for (const pair of this.trees) {
      if (pair.value.equals(head)) {
        pair.tree.insert(tail);
        return;
      }
    }

    const sub_tree = this.new_tree();
    this.trees.push(new Pair(head, sub_tree));
    sub_tree.insert(tail);
  }

  search(env: UnificationEnvironment, patterns: Pattern[]) {
    const [head, ...tail] = patterns;

    return this.trees.flatMap((pair) => {
      const new_env = head.unify(env, pair.value);
      if (new_env === null) {
        return [];
      } else {
        return pair.tree.search(new_env, tail);
      }
    });
  }
}

export class SingleNode extends RelationNode {
  private value!: CrochetValue;
  private sub_tree!: RelationNode;

  constructor(readonly new_tree: () => RelationNode) {
    super();
  }

  insert(values: CrochetValue[]) {
    const [head, ...tail] = values;
    this.value = head;
    this.sub_tree = this.new_tree();
    this.sub_tree.insert(tail);
  }

  search(env: UnificationEnvironment, patterns: Pattern[]) {
    const [head, ...tail] = patterns;

    const new_env = head.unify(env, this.value);
    if (new_env == null) {
      return [];
    } else {
      return this.sub_tree.search(new_env, tail);
    }
  }
}

export class RelationType {
  private tree: RelationNode;

  constructor(
    readonly name: string,
    readonly arity: number,
    readonly components: Component[]
  ) {
    this.tree = build_tree_structure(components)();
  }

  insert(values: CrochetValue[]) {
    if (this.arity !== values.length) {
      throw new Error(
        `Invalid arity ${values.length} for relation ${this.name}`
      );
    }
    this.tree.insert(values);
  }

  search(
    patterns: Pattern[],
    env: UnificationEnvironment
  ): UnificationEnvironment[] {
    return this.tree.search(env, patterns);
  }
}

export abstract class Multiplicity {
  abstract to_tree(subtree: () => RelationNode): RelationNode;
}

export class One extends Multiplicity {
  to_tree(subtree: () => RelationNode) {
    return new SingleNode(subtree);
  }
}

export class Many extends Multiplicity {
  to_tree(subtree: () => RelationNode) {
    return new ManyNode(subtree);
  }
}

export class Component {
  constructor(readonly multiplicity: Multiplicity, readonly name: string) {}

  to_tree(subtree: () => RelationNode) {
    return this.multiplicity.to_tree(subtree);
  }
}

function build_tree_structure(components: Component[]): () => RelationNode {
  if (components.length === 0) {
    throw new Error(`empty components`);
  } else {
    return components.reduceRight(
      (subtree, component) => {
        return () => component.to_tree(subtree);
      },
      () => new EndNode()
    );
  }
}

export class UnificationEnvironment {
  private bindings = new Map<string, CrochetValue>();

  static from_map(map: Map<string, CrochetValue>) {
    const new_env = new UnificationEnvironment();
    for (const [k, v] of map) {
      new_env.bindings.set(k, v);
    }
    return new_env;
  }

  clone() {
    return UnificationEnvironment.from_map(this.bindings);
  }

  add(name: string, value: CrochetValue) {
    this.bindings.set(name, value);
  }

  lookup(name: string) {
    return this.bindings.get(name) ?? null;
  }

  get bound_values() {
    return this.bindings;
  }
}
