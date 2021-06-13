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
  make_integer,
  make_lambda,
  make_record_from_map,
  make_static_text,
  make_text,
  make_thunk,
  make_tuple,
} from "./values";

export function reify_meta(
  universe: Universe,
  module: CrochetModule,
  node: IR.DslNode
) {
  return make_record_from_map(
    universe,
    new Map([
      ["line", make_integer(universe, BigInt(node.meta.line))],
      ["column", make_integer(universe, BigInt(node.meta.column))],
    ])
  );
}

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
        reify_meta(universe, module, node),
      ]);
    }

    case IR.DslNodeTag.LITERAL: {
      return instantiate(universe.types.Skeleton.Literal, [
        materialise_literal(universe, node.value),
        reify_meta(universe, module, node),
      ]);
    }

    case IR.DslNodeTag.VARIABLE: {
      return instantiate(universe.types.Skeleton.Name, [
        make_static_text(universe, node.name),
        reify_meta(universe, module, node),
      ]);
    }

    case IR.DslNodeTag.EXPRESSION: {
      return instantiate(universe.types.Skeleton.Dynamic, [
        make_lambda(universe, env, [], node.value),
        reify_meta(universe, module, node),
      ]);
    }

    case IR.DslNodeTag.LIST: {
      const children = node.children.map((x) =>
        reify_dsl_node(universe, module, env, x)
      );
      return instantiate(universe.types.Skeleton.Tuple, [
        make_tuple(universe, children),
        reify_meta(universe, module, node),
      ]);
    }

    case IR.DslNodeTag.INTERPOLATION: {
      const parts = node.parts.map((x) => {
        switch (x.tag) {
          case IR.DslInterpolationTag.STATIC: {
            return instantiate(universe.types.Skeleton.Literal, [
              materialise_literal(universe, new IR.LiteralText(x.text)),
              universe.nothing,
            ]);
          }

          case IR.DslInterpolationTag.DYNAMIC: {
            return reify_dsl_node(universe, module, env, x.node);
          }

          default:
            throw unreachable(x, "DSL Interpolation part");
        }
      });

      return instantiate(universe.types.Skeleton.Interpolation, [
        make_tuple(universe, parts),
        reify_meta(universe, module, node),
      ]);
    }

    default:
      throw unreachable(node, "DSL Node");
  }
}
