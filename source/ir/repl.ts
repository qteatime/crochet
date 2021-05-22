import { Declaration } from "./declaration";
import { BasicBlock } from "./expression";
import { Interval } from "./program";

export enum ReplTag {
  STATEMENTS,
  DECLARATIONS,
}

export type ReplNode = ReplDeclarations | ReplStatements;

export class ReplDeclarations {
  readonly tag = ReplTag.DECLARATIONS;
  constructor(
    readonly declarations: Declaration[],
    readonly source: string,
    readonly meta: Map<number, Interval>
  ) {}
}

export class ReplStatements {
  readonly tag = ReplTag.STATEMENTS;
  constructor(
    readonly block: BasicBlock,
    readonly source: string,
    readonly meta: Map<number, Interval>
  ) {}
}
