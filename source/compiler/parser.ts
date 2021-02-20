import { AbstractCrochetVisitor, Wrapper } from "../generated/crochet-grammar";
import { coerceArray } from "../utils/operators";
import {
  CrochetNode,
  Declaration,
  DoDeclaration,
  Program,
  Statement,
} from "./ast";

export class CrochetVisitor extends AbstractCrochetVisitor<void, CrochetNode> {
  program<T extends Wrapper<void, CrochetNode>>(
    node: T,
    [_, decls, __, ___]: [T, T, T, T],
    context: void
  ): CrochetNode {
    return new Program(coerceArray(Declaration, decls.visit(this, context)));
  }

  declaration<T extends Wrapper<void, CrochetNode>>(
    node: T,
    [decl]: [T],
    context: void
  ): CrochetNode {
    return decl.visit(this, context);
  }

  doDeclaration<T extends Wrapper<void, CrochetNode>>(
    node: T,
    [_, block]: [T, T],
    context: void
  ): CrochetNode {
    return new DoDeclaration(
      coerceArray(Statement, block.visit(this, context))
    );
  }

  statement_expression<T extends Wrapper<void, CrochetNode>>(
    node: T,
    [stmt]: [T],
    context: void
  ): CrochetNode {
    return stmt.visit(this, context);
  }

  returnStatement<T extends Wrapper<void, CrochetNode>>(
    node: T,
    [_, expr]: [T, T],
    context: void
  ): CrochetNode {
    
  }
  expression<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  primaryExpression_expression<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  block<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T, T, T, T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  variable<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  text<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  integer<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  float<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  boolean<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  name<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  atom<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T, T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  keyword<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  actorName<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  nothing<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  infix_symbol<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  interpolateTextPart_escape<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T, T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  interpolateTextPart_interpolate<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T, T, T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  interpolateTextPart_character<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  interpolateText<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T, T, T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  s<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T, T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  header<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T, T, T, T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  line<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  comment<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T, T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  atom_start<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  t_atom<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T, T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  t_keyword<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T, T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  t_actor_name<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T, T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  t_name<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T, T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  t_integer<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  t_float<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T, T, T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  text_character_escape<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T, T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  text_character_regular<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  t_text<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T, T, T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  t_boolean_true<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  t_boolean_false<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  kw<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  true_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  false_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  nothing_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  scene_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  command_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  do_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  return_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  goto_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  let_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  end_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  actor_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  relation_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  fact_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  forget_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  search_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  action_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  when_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  choose_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  if_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  and_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  or_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  not_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  context_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  trigger_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  then_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  else_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  match_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
  repeatable_<T extends Wrapper<void, CrochetNode>>(
    node: T,
    children: [T],
    context: void
  ): CrochetNode {
    throw new Error("Method not implemented.");
  }
}
