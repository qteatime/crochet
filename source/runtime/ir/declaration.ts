import { PredicateProcedure, TreeType } from "../logic";
import {
  CrochetProcedure,
  DispatchType,
  NativeProcedure,
} from "../primitives/procedure";
import { Machine } from "../run";
import { Environment, World } from "../world";
import { SBlock, Statement } from "./statement";

export type Declaration =
  | DDo
  | DPredicate
  | DRelation
  | DForeignCommand
  | DCrochetCommand;

interface IDeclaration {
  apply(world: World): void;
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
    readonly types: DispatchType[],
    readonly foreign_name: string,
    readonly args: number[]
  ) {}

  apply(world: World) {
    world.add_foreign_procedure(
      this.name,
      this.types,
      new NativeProcedure(this.name, this.args, this.foreign_name)
    );
  }
}

export class DCrochetCommand implements IDeclaration {
  constructor(
    readonly name: string,
    readonly parameters: string[],
    readonly types: DispatchType[],
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
    world.add_crochet_procedure(this.name, this.types, code);
  }
}
