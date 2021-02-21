import { PredicateProcedure, TreeType } from "../logic";
import { Machine } from "../run";
import { Environment, World } from "../world";
import { SBlock, Statement } from "./statement";

export type Declaration = DDo | DPredicate | DRelation;

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