import { SBlock, Statement } from "../ir";
import { Bag } from "../../utils/bag";
import { Context } from "./event";
import { Goal } from "./goal";
import { Environment } from "../world";
import { cast, maybe_cast, zip } from "../../utils/utils";
import { avalue, cvalue, Machine, run_all, State, _mark, _push } from "../vm";
import {
  CrochetInteger,
  CrochetStream,
  CrochetValue,
  False,
} from "../primitives";
import { Pattern, UnificationEnvironment } from "../logic";
import { DatabaseLayer, FunctionLayer } from "../logic/layer";
import { Error } from "../../utils/result";
import { ActionChoice } from "./action-choice";

export class Signal {
  constructor(
    readonly name: string,
    readonly parameters: string[],
    readonly body: Statement[]
  ) {}

  get full_name() {
    return `signal ${this.name}`;
  }

  async *evaluate(state: State, args: CrochetValue[]) {
    const env = new Environment(state.env, state.env.raw_receiver);
    if (this.parameters.length !== args.length) {
      throw new Error(`internal: Invalid arity in signal ${this.name}`);
    }
    for (const [key, value] of zip(this.parameters, args)) {
      env.define(key, value);
    }
    const block = new SBlock(this.body);
    const new_state = state.with_env(env);
    const result = cvalue(
      yield _mark(this.full_name, block.evaluate(new_state))
    );
    return result;
  }
}

export class Simulation {
  private turn: CrochetValue | null = null;
  private acted = new Set<CrochetValue>();
  private active: boolean = false;
  private rounds: bigint = 0n;

  constructor(
    readonly env: Environment,
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
    return False.instance;
  }

  async *simulate_round(state: State): Machine {
    this.acted = new Set();
    this.goal.reset();
    const actor0 = yield _push(this.next_actor(state));
    this.turn = maybe_cast(actor0, CrochetValue);
    while (this.turn != null) {
      const action0 = cvalue(yield _push(this.pick_action(state, this.turn)));
      const action = maybe_cast(action0, ActionChoice);
      if (action != null) {
        action.action.fire(this.turn);
        yield _mark(action.full_name, action.machine);
        for (const reaction of this.context.available_events(state)) {
          yield reaction;
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
      .map(
        (x) => new ActionChoice(x.title, x.score, x.tags, x.action, x.machine)
      );

    const selected = cvalue(
      yield _push(
        this.trigger_signal(
          state,
          "pick-action:for:",
          [new CrochetStream(actions), actor],
          async function* (_state, _actions, _for) {
            const scores = avalue(
              yield _push(run_all(actions.map((x) => x.score.force(state))))
            ).map((x) => Number(cast(x, CrochetInteger).value));
            const scored_actions = [...zip(scores, actions)];
            return (
              state.random.random_weighted_choice(scored_actions) ??
              False.instance
            );
          }
        )
      )
    );
    return selected;
  }

  async *trigger_signal(
    state: State,
    name: string,
    args: CrochetValue[],
    default_handler: (state: State, ...args: CrochetValue[]) => Machine
  ) {
    const signal = this.signals.try_lookup(name);
    if (signal != null) {
      const result = cvalue(
        yield _push(signal.evaluate(state.with_env(this.env), args))
      );
      return result;
    } else {
      const result = cvalue(yield _push(default_handler(state, ...args)));
      return result;
    }
  }

  get layer() {
    const layer = new FunctionLayer(null);
    layer.add("_ simulate-turn", (state, env, [pattern]) =>
      unify(pattern, this.turn ?? False.instance, state, env)
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
