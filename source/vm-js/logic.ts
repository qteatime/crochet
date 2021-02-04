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

export abstract class Pattern {}

export class VariablePattern extends Pattern {
  constructor(readonly name: string) {
    super();
  }
}

export class Pair {
  constructor(readonly value: CrochetValue, readonly tree: RelationNode) {}
}

export abstract class RelationNode {
  abstract insert(values: CrochetValue[]): void;
}

export class EndNode extends RelationNode {
  insert(_: CrochetValue[]) {}
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
  constructor(readonly multiplicity: Multiplicity, readonly pattern: Pattern) {}

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
