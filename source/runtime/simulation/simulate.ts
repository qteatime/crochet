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
  UnificationEnvironment,
} from "../logic";
import { timingSafeEqual } from "crypto";

export class Signal {
  constructor(
    readonly name: string,
    readonly parameters: string[],
    readonly body: Statement[]
  ) {}
}

export class ActionChoice {
  constructor(readonly title: string, readonly machine: Machine) {}
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

  async *run(state: State): Machine {
    this.active = true;
    this.rounds = 0n;
    this.setup_relations(state);
    while (this.active) {
      yield _push(this.simulate_round(state));
      this.rounds += 1n;
    }
    return bfalse;
  }

  async *simulate_round(state: State): Machine {
    this.acted = new Set();
    const actor0 = yield _push(this.next_actor(state));
    this.turn = maybe_cast(actor0, CrochetValue);
    while (this.turn != null) {
      const action0 = yield _push(this.pick_action(state, this.turn));
      const action = maybe_cast(action0, ActionChoice);
      if (action != null) {
        yield _push(action.machine);
        for (const reaction of this.context.available_events(state)) {
          yield _push(reaction);
        }
      }
      this.acted.add(this.turn);
      this.turn = maybe_cast(yield _push(this.next_actor(state)), CrochetValue);
      if (this.goal.reached(state, this.context)) {
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
      .available_actions(state)
      .map((x) => new ActionChoice(x.title, x.machine));
    return pick(actions);
  }

  setup_relations(state: State) {
    const world = state.world;
    this.setup_relation(
      world,
      "_ simulate-turn",
      (world, env, [pattern], db) => {
        return maybe_env(pattern.unify(world, env, this.turn!));
      }
    );

    this.setup_relation(
      world,
      "_ simulate-actor",
      (world, env, [pattern], db) => {
        return this.actors.flatMap((x) =>
          maybe_env(pattern.unify(world, env, x))
        );
      }
    );

    this.setup_relation(
      world,
      "_ simulate-acted",
      (world, env, [pattern], db) => {
        return [...this.acted].flatMap((x) =>
          maybe_env(pattern.unify(world, env, x))
        );
      }
    );

    this.setup_relation(
      world,
      "_ simulate-rounds-elapsed",
      (world, env, [pattern], db) => {
        return maybe_env(
          pattern.unify(world, env, new CrochetInteger(this.rounds))
        );
      }
    );
  }

  setup_relation(world: World, name: string, code: FunctionRelationFn) {
    world.database.update(name, new FunctionRelation(name, code));
  }
}

function maybe_env(x: UnificationEnvironment | null) {
  return x == null ? [] : [x];
}
