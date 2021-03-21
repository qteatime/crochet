import { Predicate, UnificationEnvironment } from "../logic";
import { CrochetValue } from "../primitives";
import { State } from "../vm";
import { World } from "../world";
import { Context } from "./event";

export type Goal =
  | ActionQuiescence
  | EventQuiescence
  | TotalQuiescence
  | CustomGoal;

interface IGoal {
  reset(): void;
  tick(actor: CrochetValue, state: State, context: Context): void;
  reached(round_ended: boolean): boolean;
}

export class ActionQuiescence implements IGoal {
  private _reached = true;

  reached(round_ended: boolean) {
    return round_ended && this._reached;
  }

  reset() {
    this._reached = true;
  }

  tick(actor: CrochetValue, state: State, context: Context) {
    if (context.available_actions(actor, state).length !== 0) {
      this._reached = false;
    }
  }
}

export class EventQuiescence implements IGoal {
  private _reached = true;

  reached(round_ended: boolean) {
    return round_ended && this._reached;
  }

  reset() {
    this._reached = true;
  }

  tick(actor: CrochetValue, state: State, context: Context) {
    if (context.available_events(state).length !== 0) {
      this._reached = false;
    }
  }
}

export class TotalQuiescence implements IGoal {
  private event_goal = new EventQuiescence();
  private action_goal = new ActionQuiescence();

  reached(round_ended: boolean) {
    return (
      this.event_goal.reached(round_ended) &&
      this.action_goal.reached(round_ended)
    );
  }

  reset() {
    this.event_goal.reset();
    this.action_goal.reset();
  }

  tick(actor: CrochetValue, state: State, context: Context) {
    this.action_goal.tick(actor, state, context);
    this.event_goal.tick(actor, state, context);
  }
}

export class CustomGoal implements IGoal {
  private _reached = false;
  constructor(readonly predicate: Predicate) {}

  reached(round_ended: boolean) {
    return this._reached;
  }

  reset() {
    this._reached = false;
  }

  tick(actor: CrochetValue, state: State, context: Context) {
    const env = UnificationEnvironment.empty();
    const results = state.database.search(state, this.predicate, env);
    if (results.length !== 0) {
      this._reached = true;
    }
  }
}
