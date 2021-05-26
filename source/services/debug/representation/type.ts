import { CrochetType } from "../../../vm";
import { RFlow, RKeyword, RStatic, space } from "./ast";

export function type_to_repr(type: CrochetType) {
  return new RFlow([
    new RKeyword(type.name),
    space,
    new RStatic("from"),
    space,
    new RKeyword(type.module?.pkg.name ?? "(built-in)"),
  ]);
}
