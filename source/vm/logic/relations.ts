import * as IR from "../../ir";
import { unreachable } from "../../utils/utils";
import { ErrArbitrary } from "../errors";
import {
  ConcreteRelation,
  CrochetModule,
  CrochetRelation,
  Environment,
  RelationTag,
  State,
  Tree as RelationTree,
  TreeType,
} from "../intrinsics";
import * as Tree from "./tree";
import { Namespace } from "../namespaces";
import { Location } from "../primitives";
import { XorShift } from "../../utils/xorshift";
import { CrochetValue } from "../../crochet";

export function define_concrete(
  module: CrochetModule,
  meta: number,
  name: string,
  documentation: string,
  type: TreeType,
  tree: RelationTree
) {
  const result = module.pkg.relations.define(
    name,
    new CrochetRelation(
      RelationTag.CONCRETE,
      name,
      documentation,
      new ConcreteRelation(module, meta, type, tree)
    )
  );
  if (!result) {
    throw new ErrArbitrary(
      "duplicate-relation",
      `Could not define relation ${name} in module ${Location.module_location(
        module
      )}`
    );
  }
}

export function lookup(
  module: CrochetModule,
  relations: Namespace<CrochetRelation>,
  name: string
) {
  const relation = relations.try_lookup(name);
  if (relation == null) {
    throw new ErrArbitrary(
      `no-relation`,
      `Relation ${name} is not accessible from ${Location.module_location(
        module
      )}`
    );
  }
  return relation;
}

export function search(
  state: State,
  module: CrochetModule,
  env: Environment,
  relation: CrochetRelation,
  patterns: IR.Pattern[]
) {
  switch (relation.tag) {
    case RelationTag.CONCRETE: {
      return Tree.search(state, module, env, relation.payload.tree, patterns);
    }

    default:
      throw unreachable(relation as never, `Relation`);
  }
}

export function sample(
  state: State,
  module: CrochetModule,
  random: XorShift,
  size: number,
  env: Environment,
  relation: CrochetRelation,
  patterns: IR.Pattern[]
) {
  switch (relation.tag) {
    case RelationTag.CONCRETE: {
      return Tree.sample(
        state,
        module,
        random,
        size,
        env,
        relation.payload.tree,
        patterns
      );
    }

    default:
      throw unreachable(relation as never, `Relation`);
  }
}

export function assert_tag<T extends RelationTag>(
  tag: T,
  relation: CrochetRelation
): asserts relation is CrochetRelation<T> {
  if (relation.tag !== tag) {
    throw new ErrArbitrary(
      "invalid-relation",
      `Expected a ${RelationTag[tag]} relation`
    );
  }
}

export function insert(relation: CrochetRelation, values: CrochetValue[]) {
  assert_tag(RelationTag.CONCRETE, relation);
  Tree.insert(relation.payload.tree, values);
}

export function remove(relation: CrochetRelation, values: CrochetValue[]) {
  assert_tag(RelationTag.CONCRETE, relation);
  const result = Tree.remove(relation.payload.tree, values).tree;
  if (result == null) {
    relation.payload.tree = Tree.materialise(relation.payload.type);
  } else {
    relation.payload.tree = result;
  }
}
