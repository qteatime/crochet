import * as IR from "../../ir";
import { unreachable } from "../../utils/utils";
import * as Environments from "./environments";
import {
  CrochetModule,
  CrochetValue,
  Environment,
  Universe,
} from "../intrinsics";
import { materialise_literal } from "./literals";
import {
  instantiate,
  make_record_from_map,
  make_static_text,
  make_text,
  make_thunk,
  make_tuple,
} from "./values";

export function reify_dsl_node(
  universe: Universe,
  module: CrochetModule,
  env: Environment,
  node: IR.DslNode
): CrochetValue {
  switch (node.tag) {
    case IR.DslNodeTag.NODE: {
      const children = node.children.map((x) =>
        reify_dsl_node(universe, module, env, x)
      );
      const attrs = new Map<string, CrochetValue>();
      for (const [k, v] of node.attributes) {
        attrs.set(k, reify_dsl_node(universe, module, env, v));
      }
      return instantiate(universe.types.Skeleton.Node, [
        make_static_text(universe, node.name),
        make_tuple(universe, children),
        make_record_from_map(universe, attrs),
      ]);
    }

    case IR.DslNodeTag.LITERAL: {
      return instantiate(universe.types.Skeleton.Literal, [
        materialise_literal(universe, node.value),
      ]);
    }

    case IR.DslNodeTag.VARIABLE: {
      return instantiate(universe.types.Skeleton.Name, [
        make_static_text(universe, node.name),
      ]);
    }

    case IR.DslNodeTag.EXPRESSION: {
      return instantiate(universe.types.Skeleton.Dynamic, [
        make_thunk(universe, env, node.value),
      ]);
    }

    case IR.DslNodeTag.LIST: {
      const children = node.children.map((x) =>
        reify_dsl_node(universe, module, env, x)
      );
      return instantiate(universe.types.Skeleton.Tuple, [
        make_tuple(universe, children),
      ]);
    }

    default:
      throw unreachable(node, "DSL Node");
  }
}
