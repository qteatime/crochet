import { Environment } from "../world";
import { EInterpolate, Expression, SBlock, Statement } from "../ir";
import { Predicate, UnificationEnvironment } from "../logic";
import { Machine, State, _mark } from "../vm";
import {
  CrochetInteger,
  CrochetInterpolation,
  CrochetText,
  CrochetThunk,
  CrochetValue,
} from "../primitives";
import { BagMap, iter } from "../../utils";
import { DatabaseLayer, FunctionLayer } from "../logic/layer";
import { SimpleInterpolation } from "../ir/atomic";

export class When {
  constructor(
    readonly filename: string,
    readonly predicate: Predicate,
    readonly env: Environment,
    readonly body: Statement[]
  ) {}

  get full_name() {
    return `an event (from ${this.filename})`;
  }

  executions(state: State) {
    const results = state.database.search(
      state,
      this.predicate,
      UnificationEnvironment.empty()
    );
    return results.map((uenv) => {
      const env = new Environment(this.env, null);
      env.define_all(uenv.boundValues);
      const block = new SBlock(this.body);
      return block.evaluate(state.with_env(env));
    });
  }
}

export type ReadyAction = {
  action: Action
  title: CrochetInterpolation
  score: CrochetThunk
  tags: CrochetValue[]
  machine: Machine
}

export class Action {
  private fired_for = new BagMap<CrochetValue, bigint>();

  constructor(
    readonly filename: string,
    readonly title: SimpleInterpolation<string>,
    readonly predicate: Predicate,
    readonly tags: CrochetValue[],
    readonly env: Environment,
    readonly rank: Expression,
    readonly body: Statement[]
  ) {}

  ready_actions(actor: CrochetValue, state0: State): ReadyAction[] {
    const db = new DatabaseLayer(state0.database, this.layer);
    const state = state0.with_database(db);
    const results = state.database.search(
      state,
      this.predicate,
      UnificationEnvironment.empty()
    );
    return results.map((uenv) => {
      const env = new Environment(this.env, null);
      env.define_all(uenv.boundValues);
      const block = new SBlock(this.body);
      return {
        action: this,
        title: this.title.interpolate((x) => env.lookup(x)),
        score: new CrochetThunk(this.rank, env),
        tags: this.tags,
        machine: block.evaluate(state.with_env(env)),
      };
    });
  }

  fire(actor: CrochetValue) {
    const fired = this.fired_for.get(actor) ?? 0n;
    this.fired_for.set(actor, fired + 1n);
  }

  get layer() {
    const layer = new FunctionLayer(null);

    layer.add("_ action-fired:", (state, env, [pactor, ptimes]) => {
      return iter(this.fired_for.entries())
        .flatMap<UnificationEnvironment>(([actor, times]) => {
          return pactor.aunify(state, env, actor).flatMap((env) => {
            return ptimes.aunify(state, env, new CrochetInteger(times));
          });
        })
        .to_array();
    });

    return layer;
  }
}

export class Context {
  readonly events: When[] = [];
  readonly actions: Action[] = [];

  available_actions(actor: CrochetValue, state: State) {
    return this.actions.flatMap((x) => x.ready_actions(actor, state));
  }

  available_events(state: State) {
    return this.events.flatMap((x) =>
      x.executions(state).map((e) => _mark(x.full_name, e))
    );
  }
}
