import * as IR from "../../ir";
import {
  ActionChoice,
  CrochetRelation,
  CrochetValue,
  RelationTag,
  TraceSpan,
  ActivationLocation,
  CrochetType,
  Activation,
  CrochetActivation,
  CrochetCommandBranch,
  CrochetPartial,
  CrochetLambda,
  CrochetNativeLambda,
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
  NEW,
  INVOKE,
  RETURN,
  APPLY_LAMBDA,
  FORCE_THUNK,
}

export type TraceEvent =
  | TEFact
  | TEForget
  | TELog
  | TEAction
  | TEEvent
  | TETurn
  | TEGoalReached
  | TEActionChoice
  | TENew
  | TEInvoke
  | TEReturn
  | TEApplyLambda
  | TEForceThunk;

export class EventLocation {
  constructor(
    readonly span: TraceSpan | null,
    readonly activation: Activation | null,
    readonly instruction: number | null,
    readonly location: ActivationLocation
  ) {}

  static from_activation(
    activation: Activation,
    location: ActivationLocation | null
  ) {
    if (activation instanceof CrochetActivation) {
      return new EventLocation(
        activation.span,
        activation,
        activation.instruction,
        location ?? activation.location
      );
    } else {
      return new EventLocation(
        activation.span,
        activation,
        null,
        location ?? activation.location
      );
    }
  }
}

export abstract class BaseTraceEvent {
  abstract tag: TraceTag;
  abstract time: bigint;
}

export class TEFact extends BaseTraceEvent {
  readonly tag = TraceTag.FACT;
  constructor(
    readonly time: bigint,
    readonly location: EventLocation,
    readonly relation: CrochetRelation<RelationTag.CONCRETE>,
    readonly values: CrochetValue[]
  ) {
    super();
  }
}

export class TEForget extends BaseTraceEvent {
  readonly tag = TraceTag.FORGET;
  constructor(
    readonly time: bigint,
    readonly location: EventLocation,
    readonly relation: CrochetRelation<RelationTag.CONCRETE>,
    readonly values: CrochetValue[]
  ) {
    super();
  }
}

export class TELog extends BaseTraceEvent {
  readonly tag = TraceTag.LOG;
  constructor(
    readonly time: bigint,
    readonly location: EventLocation,
    readonly category: string,
    readonly log_tag: CrochetValue,
    readonly value: CrochetValue | string
  ) {
    super();
  }
}

export class TEAction extends BaseTraceEvent {
  readonly tag = TraceTag.SIMULATION_ACTION;
  constructor(
    readonly time: bigint,
    readonly location: EventLocation,
    readonly choice: ActionChoice
  ) {
    super();
  }
}

export class TEEvent extends BaseTraceEvent {
  readonly tag = TraceTag.SIMULATION_EVENT;
  constructor(
    readonly time: bigint,
    readonly location: EventLocation,
    readonly event: EventChoice
  ) {
    super();
  }
}

export class TETurn extends BaseTraceEvent {
  readonly tag = TraceTag.SIMULATION_TURN;
  constructor(
    readonly time: bigint,
    readonly location: EventLocation,
    readonly turn: CrochetValue
  ) {
    super();
  }
}

export class TEGoalReached extends BaseTraceEvent {
  readonly tag = TraceTag.SIMULATION_GOAL_REACHED;
  constructor(
    readonly time: bigint,
    readonly location: EventLocation,
    readonly goal: IR.SimulationGoal
  ) {
    super();
  }
}

export class TEActionChoice extends BaseTraceEvent {
  readonly tag = TraceTag.SIMULATION_ACTION_CHOICE;
  constructor(
    readonly time: bigint,
    readonly location: EventLocation,
    readonly turn: CrochetValue,
    readonly choices: ActionChoice[]
  ) {
    super();
  }
}

export class TENew extends BaseTraceEvent {
  readonly tag = TraceTag.NEW;
  constructor(
    readonly time: bigint,
    readonly location: EventLocation,
    readonly type: CrochetType,
    readonly parameters: CrochetValue[]
  ) {
    super();
  }
}

export class TEInvoke extends BaseTraceEvent {
  readonly tag = TraceTag.INVOKE;
  constructor(
    readonly time: bigint,
    readonly location: EventLocation,
    readonly command: CrochetCommandBranch,
    readonly activation: CrochetActivation | null,
    readonly args: CrochetValue[]
  ) {
    super();
  }
}

export class TEReturn extends BaseTraceEvent {
  readonly tag = TraceTag.RETURN;
  constructor(
    readonly time: bigint,
    readonly location: EventLocation,
    readonly value: CrochetValue
  ) {
    super();
  }
}

export class TEApplyLambda extends BaseTraceEvent {
  readonly tag = TraceTag.APPLY_LAMBDA;
  constructor(
    readonly time: bigint,
    readonly location: EventLocation,
    readonly activation: Activation | null,
    readonly lambda: CrochetValue,
    readonly args: CrochetValue[]
  ) {
    super();
  }
}

export class TEForceThunk extends BaseTraceEvent {
  readonly tag = TraceTag.FORCE_THUNK;
  constructor(
    readonly time: bigint,
    readonly location: EventLocation,
    readonly activation: Activation | null,
    readonly thunk: CrochetValue
  ) {
    super();
  }
}
