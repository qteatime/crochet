import { PredicateProcedure, TreeType } from "../logic";
import { CrochetRole, TCrochetEnum, TCrochetType } from "../primitives";
import { CrochetProcedure, NativeProcedure } from "../primitives/procedure";
import { cvalue, Machine, run } from "../run";
import { Environment, World } from "../world";
import { Expression } from "./expression";
import { SBlock, Statement } from "./statement";
import { Type } from "./type";

export type Declaration =
  | DDo
  | DPredicate
  | DRelation
  | DForeignCommand
  | DCrochetCommand
  | DRole
  | DType
  | DEnum
  | DDefine;

interface IDeclaration {
  apply(world: World): Promise<void> | void;
}

export class DRelation implements IDeclaration {
  constructor(readonly name: string, readonly type: TreeType) {}

  apply(world: World) {
    world.add_relation(this.name, this.type);
  }
}

export class DPredicate implements IDeclaration {
  constructor(readonly name: string, readonly procedure: PredicateProcedure) {}

  apply(world: World) {
    world.add_predicate(this.name, this.procedure);
  }
}

export class DDo implements IDeclaration {
  constructor(readonly body: Statement[]) {}

  apply(world: World) {
    const env = new Environment(null, world);
    const block = new SBlock(this.body);
    world.schedule(block.evaluate(world, env));
  }
}

export class DForeignCommand implements IDeclaration {
  constructor(
    readonly name: string,
    readonly types: Type[],
    readonly foreign_name: string,
    readonly args: number[]
  ) {}

  apply(world: World) {
    world.add_foreign_procedure(
      this.name,
      this.types.map((x) => x.realise(world)),
      new NativeProcedure(this.name, this.args, this.foreign_name)
    );
  }
}

export class DCrochetCommand implements IDeclaration {
  constructor(
    readonly name: string,
    readonly parameters: string[],
    readonly types: Type[],
    readonly body: Statement[]
  ) {}

  apply(world: World) {
    const env = new Environment(null, world);
    const code = new CrochetProcedure(
      env,
      world,
      this.name,
      this.parameters,
      this.body
    );
    world.add_crochet_procedure(
      this.name,
      this.types.map((x) => x.realise(world)),
      code
    );
  }
}

export class DRole implements IDeclaration {
  constructor(readonly name: string) {}

  apply(world: World) {
    const role = new CrochetRole(this.name);
    world.add_role(this.name, role);
  }
}

export class DType implements IDeclaration {
  constructor(readonly name: string, readonly roles: string[]) {}

  apply(world: World) {
    const roles = this.roles.map((x) => world.get_role(x));
    const type = new TCrochetType(this.name, new Set(roles));
    world.add_type(this.name, type);
  }
}

export type Variant = { name: string; roles: string[] };

export class DEnum implements IDeclaration {
  constructor(readonly name: string, readonly variants: Variant[]) {}

  apply(world: World) {
    const type = new TCrochetEnum(this.name);
    for (const x of this.variants) {
      type.add_variant(
        x.name,
        x.roles.map((z) => world.get_role(z))
      );
    }
  }
}

export class DDefine implements IDeclaration {
  constructor(readonly name: string, readonly value: Expression) {}
  async apply(world: World) {
    const env = new Environment(null, world);
    const value = cvalue(await run(this.value.evaluate(world, env)));
    world.add_global(this.name, value);
  }
}
