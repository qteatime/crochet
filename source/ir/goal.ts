import { Predicate } from "./logic";

type Metadata = number;
type uint32 = number;

export enum SimulationGoalTag {
  ACTION_QUIESCENCE = 1,
  EVENT_QUIESCENCE,
  TOTAL_QUIESCENCE,
  PREDICATE,
}

export type SimulationGoal =
  | SGActionQuiescence
  | SGEventQuiescence
  | SGTotalQuiescence
  | SGPredicate;

export abstract class SimulationGoalBase {
  abstract tag: SimulationGoalTag;
}

export class SGActionQuiescence extends SimulationGoalBase {
  readonly tag = SimulationGoalTag.ACTION_QUIESCENCE;

  constructor(readonly meta: Metadata) {
    super();
  }
}

export class SGEventQuiescence extends SimulationGoalBase {
  readonly tag = SimulationGoalTag.EVENT_QUIESCENCE;

  constructor(readonly meta: Metadata) {
    super();
  }
}

export class SGTotalQuiescence extends SimulationGoalBase {
  readonly tag = SimulationGoalTag.TOTAL_QUIESCENCE;

  constructor(readonly meta: Metadata) {
    super();
  }
}

export class SGPredicate extends SimulationGoalBase {
  readonly tag = SimulationGoalTag.PREDICATE;

  constructor(readonly meta: Metadata, readonly predicate: Predicate) {
    super();
  }
}
