import { CrochetType, TCrochetAny } from "../primitives";
import { State } from "../vm";
import { World } from "../world";

export type Type = TNamed | TAny;

interface IType {
  realise(state: State): CrochetType;
}

export class TAny implements IType {
  realise(state: State): CrochetType {
    return TCrochetAny.type;
  }
}

export class TNamed implements IType {
  constructor(readonly name: string) {}

  realise(state: State): CrochetType {
    return state.env.module.lookup_type(this.name);
  }
}
