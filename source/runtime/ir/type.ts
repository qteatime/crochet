import { CrochetType, tAny, TCrochetUnion } from "../primitives";
import { World } from "../world";

export type Type = TNamed | TUnion | TAny;

interface IType {
  realise(world: World): CrochetType;
}

export class TAny implements IType {
  realise(world: World): CrochetType {
    return tAny;
  }
}

export class TNamed implements IType {
  constructor(readonly name: string) {}

  realise(world: World): CrochetType {
    return world.get_type(this.name);
  }
}

export class TUnion implements IType {
  constructor(readonly left: Type, readonly right: Type) {}

  realise(world: World): CrochetType {
    return new TCrochetUnion(
      this.left.realise(world),
      this.right.realise(world)
    );
  }
}
