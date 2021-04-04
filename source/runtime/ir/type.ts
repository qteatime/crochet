import { CrochetType, CrochetTypeInstance, TCrochetAny } from "../primitives";
import { State } from "../vm";
import { World } from "../world";

export abstract class Type {
  abstract realise(state: State): CrochetType;
  abstract static_name: string;
}

export class TAny extends Type {
  realise(state: State): CrochetType {
    return TCrochetAny.type;
  }

  get static_name() {
    return "any";
  }
}

export class TNamed extends Type {
  constructor(readonly name: string) {
    super();
  }

  realise(state: State): CrochetType {
    return state.env.module.lookup_type(this.name);
  }

  get static_name() {
    return this.name;
  }
}

export class TStatic extends Type {
  constructor(readonly type: Type) {
    super();
  }

  realise(state: State): CrochetType {
    const type = this.type.realise(state);
    return type.static_type.type;
  }

  get static_name() {
    return `#${this.type.static_name}`;
  }
}
