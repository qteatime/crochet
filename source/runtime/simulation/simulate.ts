import { Statement } from "../ir";
import { CrochetValue, Environment, Machine } from "..";
import { Bag } from "../../utils/bag";
import { Action, Context } from "./event";
import { Goal } from "./goal";
import { World } from "../world";
import { maybe_cast, pick } from "../../utils/utils";
import { State, _push } from "../vm";
import { bfalse, CrochetInteger, CrochetVariant } from "../primitives";
import {
  FunctionRelation,
  FunctionRelationFn,
  Pattern,
  UnificationEnvironment,
} from "../logic";
import { DatabaseLayer, FunctionLayer } from "../logic/layer";

export class Signal {
  constructor(
    readonly name: string,
    readonly parameters: string[],
    readonly body: Statement[]
  ) {}
}

export class ActionChoice {
  constructor(
    readonly title: string,
    readonly action: Action,
    readonly machine: Machine
  ) {}
}

export class Simulation {
  private turn: CrochetValue | null = null;
  private acted = new Set<CrochetValue>();
  private active: boolean = false;
  private rounds: bigint = 0n;

  constructor(
    readonly actors: CrochetValue[],
    readonly context: Context,
    readonly goal: Goal,
    readonly signals: Bag<string, Signal>
  ) {}

  async *run(state0: State): Machine {
    this.active = true;
    this.rounds = 0n;
    const layered_db = new DatabaseLayer(state0.database, this.layer);
    const state = state0.with_database(layered_db);
    while (this.active) {
      yield _push(this.simulate_round(state));
      this.rounds += 1n;
    }
    return bfalse;
  }

  async *simulate_round(state: State): Machine {
    this.acted = new Set();
    this.goal.reset();
    const actor0 = yield _push(this.next_actor(state));
    this.turn = maybe_cast(actor0, CrochetValue);
    while (this.turn != null) {
      const action0 = yield _push(this.pick_action(state, this.turn));
      const action = maybe_cast(action0, ActionChoice);
      if (action != null) {
        action.action.fire(this.turn);
        yield _push(action.machine);
        for (const reaction of this.context.available_events(state)) {
          yield _push(reaction);
        }
      }
      this.acted.add(this.turn);
      this.goal.tick(this.turn, state, this.context);
      this.turn = maybe_cast(yield _push(this.next_actor(state)), CrochetValue);
      if (this.goal.reached(this.turn == null)) {
        this.active = false;
        return;
      }
    }
  }

  async *next_actor(state: State): Machine {
    const remaining = this.actors.filter((x) => !this.acted.has(x));
    return remaining[0] ?? null;
  }

  async *pick_action(state: State, actor: CrochetValue): Machine {
    const actions = this.context
      .available_actions(actor, state)
      .map((x) => new ActionChoice(x.title, x.action, x.machine));
    return pick(actions);
  }

  get layer() {
    const layer = new FunctionLayer(null);
    layer.add("_ simulate-turn", (state, env, [pattern]) =>
      unify(pattern, this.turn ?? bfalse, state, env)
    );
    layer.add("_ simulate-actor", (state, env, [pattern]) =>
      this.actors.flatMap((x) => unify(pattern, x, state, env))
    );
    layer.add("_ simulate-acted", (state, env, [pattern]) =>
      [...this.acted].flatMap((x) => unify(pattern, x, state, env))
    );
    layer.add("_ simulate-rounds-elapsed", (state, env, [pattern]) =>
      unify(pattern, new CrochetInteger(this.rounds), state, env)
    );
    return layer;
  }
}

function unify(
  pattern: Pattern,
  value: CrochetValue,
  state: State,
  env: UnificationEnvironment
) {
  const result = pattern.unify(state, env, value);
  if (result == null) {
    return [];
  } else {
    return [result];
  }
}
