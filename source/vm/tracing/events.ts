import {
  ActivationLocation,
  CrochetRelation,
  CrochetValue,
  RelationTag,
} from "../intrinsics";

export enum TraceTag {
  FACT,
  FORGET,
  SIMULATION_EVENT,
  SIMULATION_ACTION,
  SIMULATION_ACTION_CHOICE,
  LOG,
}

export type TraceEvent = TEFact | TEForget | TELog;

export abstract class BaseTraceEvent {
  abstract tag: TraceTag;
}

export class TEFact extends BaseTraceEvent {
  readonly tag = TraceTag.FACT;
  constructor(
    readonly location: ActivationLocation,
    readonly relation: CrochetRelation<RelationTag.CONCRETE>,
    readonly values: CrochetValue[]
  ) {
    super();
  }
}

export class TEForget extends BaseTraceEvent {
  readonly tag = TraceTag.FORGET;
  constructor(
    readonly location: ActivationLocation,
    readonly relation: CrochetRelation<RelationTag.CONCRETE>,
    readonly values: CrochetValue[]
  ) {
    super();
  }
}

export class TELog extends BaseTraceEvent {
  readonly tag = TraceTag.LOG;
  constructor(
    readonly category: string,
    readonly log_tag: string,
    readonly location: ActivationLocation,
    readonly value: CrochetValue | string
  ) {
    super();
  }
}
