import { Predicate } from "../logic";
import { State } from "../vm";
import { World } from "../world";
import { Context } from "./event";

export type Goal =
  | ActionQuiescence
  | EventQuiescence
  | TotalQuiescence
  | CustomGoal;

interface IGoal {
  reached(state: State, context: Context): boolean;
}

export class ActionQuiescence implements IGoal {
  reached(state: State, context: Context): boolean {
    return context.available_actions(state).length === 0;
  }
}

export class EventQuiescence implements IGoal {
  reached(state: State, context: Context): boolean {
    return context.available_events(state).length === 0;
  }
}

export class TotalQuiescence implements IGoal {
  reached(state: State, context: Context): boolean {
    return (
      context.available_actions(state).length === 0 &&
      context.available_events(state).length === 0
    );
  }
}

export class CustomGoal implements IGoal {
  constructor(readonly predicate: Predicate) {}

  reached(state: State, context: Context): boolean {
    const results = state.world.search(this.predicate);
    return results.length !== 0;
  }
}
