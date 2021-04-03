import { CrochetType, TCrochetAny } from "../primitives";
import { State } from "../vm";
import { World } from "../world";

export type Type = TNamed | TAny;

interface IType {
  realise(state: State): CrochetType;
  static_name: string;
}

export class TAny implements IType {
  realise(state: State): CrochetType {
    return TCrochetAny.type;
  }

  get static_name() {
    return "any";
  }
}

export class TNamed implements IType {
  constructor(readonly name: string) {}

  realise(state: State): CrochetType {
    return state.env.module.lookup_type(this.name);
  }

  get static_name() {
    return this.name;
  }
}
