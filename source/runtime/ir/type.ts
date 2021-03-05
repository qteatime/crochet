import { CrochetType, TCrochetAny } from "../primitives";
import { World } from "../world";

export type Type = TNamed | TAny;

interface IType {
  realise(world: World): CrochetType;
}

export class TAny implements IType {
  realise(world: World): CrochetType {
    return TCrochetAny.type;
  }
}

export class TNamed implements IType {
  constructor(readonly name: string) {}

  realise(world: World): CrochetType {
    return world.types.lookup(this.name);
  }
}
