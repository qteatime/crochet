import * as IR from "../../ir";
import { unreachable } from "../../utils/utils";
import { Universe } from "../intrinsics";
import {
  get_false,
  get_nothing,
  get_true,
  make_float,
  make_integer,
  make_static_text,
} from "./values";

export function materialise_literal(universe: Universe, literal: IR.Literal) {
  const t = IR.LiteralTag;
  switch (literal.tag) {
    case t.NOTHING:
      return get_nothing(universe);
    case t.TRUE:
      return get_true(universe);
    case t.FALSE:
      return get_false(universe);
    case t.INTEGER:
      return make_integer(universe, literal.value);
    case t.FLOAT_64:
      return make_float(universe, literal.value);
    case t.TEXT:
      return make_static_text(universe, literal.value);

    default:
      throw unreachable(literal, `Literal`);
  }
}
