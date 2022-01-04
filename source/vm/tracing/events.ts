import * as IR from "../../ir";
import {
  ActionChoice,
  CrochetRelation,
  CrochetValue,
  RelationTag,
  TraceSpan,
} from "../intrinsics";
import { EventChoice } from "../simulation/contexts";

export enum TraceTag {
  FACT,
  FORGET,
  SIMULATION_TURN,
  SIMULATION_EVENT,
  SIMULATION_ACTION,
  SIMULATION_GOAL_REACHED,
  SIMULATION_ACTION_CHOICE,
  LOG,
}

export type TraceEvent =
  | TEFact
  | TEForget
  | TELog
  | TEAction
  | TEEvent
  | TETurn
  | TEGoalReached
  | TEActionChoice;

export abstract class BaseTraceEvent {
  abstract tag: TraceTag;
}

export class TEFact extends BaseTraceEvent {
  readonly tag = TraceTag.FACT;
  constructor(
    readonly location: TraceSpan,
    readonly relation: CrochetRelation<RelationTag.CONCRETE>,
    readonly values: CrochetValue[]
  ) {
    super();
  }
}

export class TEForget extends BaseTraceEvent {
  readonly tag = TraceTag.FORGET;
  constructor(
    readonly location: TraceSpan,
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
    readonly log_tag: CrochetValue,
    readonly location: TraceSpan,
    readonly value: CrochetValue | string
  ) {
    super();
  }
}

export class TEAction extends BaseTraceEvent {
  readonly tag = TraceTag.SIMULATION_ACTION;
  constructor(readonly location: TraceSpan, readonly choice: ActionChoice) {
    super();
  }
}

export class TEEvent extends BaseTraceEvent {
  readonly tag = TraceTag.SIMULATION_EVENT;
  constructor(readonly location: TraceSpan, readonly event: EventChoice) {
    super();
  }
}

export class TETurn extends BaseTraceEvent {
  readonly tag = TraceTag.SIMULATION_TURN;
  constructor(readonly location: TraceSpan, readonly turn: CrochetValue) {
    super();
  }
}

export class TEGoalReached extends BaseTraceEvent {
  readonly tag = TraceTag.SIMULATION_GOAL_REACHED;
  constructor(readonly location: TraceSpan, readonly goal: IR.SimulationGoal) {
    super();
  }
}

export class TEActionChoice extends BaseTraceEvent {
  readonly tag = TraceTag.SIMULATION_ACTION_CHOICE;
  constructor(
    readonly location: TraceSpan,
    readonly turn: CrochetValue,
    readonly choices: ActionChoice[]
  ) {
    super();
  }
}
