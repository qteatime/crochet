import { Predicate } from "../runtime";
import { World } from "../runtime/world";
import { Context } from "./event";

export type Goal =
  | ActionQuiescence
  | EventQuiescence
  | TotalQuiescence
  | CustomGoal;

interface IGoal {
  reached(world: World, context: Context): boolean;
}

export class ActionQuiescence implements IGoal {
  reached(world: World, context: Context): boolean {
    return context.available_actions(world).length === 0;
  }
}

export class EventQuiescence implements IGoal {
  reached(world: World, context: Context): boolean {
    return context.available_events(world).length === 0;
  }
}

export class TotalQuiescence implements IGoal {
  reached(world: World, context: Context): boolean {
    return (
      context.available_actions(world).length === 0 &&
      context.available_events(world).length === 0
    );
  }
}

export class CustomGoal implements IGoal {
  constructor(readonly predicate: Predicate) {}

  reached(world: World, context: Context): boolean {
    const results = world.search(this.predicate);
    return results.length !== 0;
  }
}
