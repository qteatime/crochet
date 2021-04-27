import { Declaration } from "./declaration";

type uint32 = number;

export class Interval {
  constructor(readonly range: { start: uint32; end: uint32 }) {}
}

export class Program {
  constructor(
    readonly filename: string,
    readonly source: string,
    readonly meta_table: Map<uint32, Interval>,
    readonly declarations: Declaration[]
  ) {}
}
