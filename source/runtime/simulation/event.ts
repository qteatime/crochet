import { Environment } from "../world";
import {
  EInterpolate,
  Expression,
  generated_node,
  SBlock,
  Statement,
  Type,
} from "../ir";
import { Predicate, UnificationEnvironment } from "../logic";
import { die, Machine, Mark, State, _mark } from "../vm";
import {
  CrochetInteger,
  CrochetInterpolation,
  CrochetText,
  CrochetThunk,
  CrochetValue,
} from "../primitives";
import { Bag, BagMap, iter } from "../../utils";
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
      const env = this.env.clone_with_receiver(null);
      env.define_all(uenv.boundValues);
      const block = new SBlock(generated_node, this.body);
      return block.evaluate(state.with_env(env));
    });
  }
}

export type ReadyAction = {
  action: Action;
  title: CrochetThunk;
  score: CrochetThunk;
  tags: CrochetValue[];
  machine: Machine;
};

export class Action {
  private fired_for = new BagMap<CrochetValue, bigint>();

  constructor(
    readonly filename: string,
    readonly title: Expression,
    readonly predicate: Predicate,
    readonly tags: CrochetValue[],
    readonly env: Environment,
    readonly rank: Expression,
    readonly body: Statement[],
    readonly for_type: Type
  ) {}

  ready_actions(actor: CrochetValue, state0: State): ReadyAction[] {
    const type = this.for_type.realise(state0);
    if (!type.accepts(actor)) {
      return [];
    }

    const db = new DatabaseLayer(state0.database, this.layer);
    const state = state0.with_database(db);
    const results = state.database.search(
      state,
      this.predicate,
      UnificationEnvironment.empty()
    );
    return results.map((uenv) => {
      const env = this.env.clone_with_receiver(null);
      env.define_all(uenv.boundValues);
      const block = new SBlock(generated_node, this.body);
      return {
        action: this,
        title: new CrochetThunk(this.title, env),
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

export class ContextBag extends Bag<string, Context> {
  constructor() {
    super("context");
  }

  get concrete_contexts(): ConcreteContext[] {
    const result = [];
    for (const x of this.map.values()) {
      if (x instanceof ConcreteContext) {
        result.push(x);
      }
    }
    return result;
  }
}

export abstract class Context {
  add_action(action: Action): void {
    throw die(`can only add actions to concrete contexts`);
  }

  add_event(event: When): void {
    throw die(`can only add events to concrete contexts`);
  }

  abstract available_actions(actor: CrochetValue, state: State): ReadyAction[];
  abstract available_events(state: State): Mark[];
}

export class ConcreteContext {
  readonly events: When[] = [];
  readonly actions: Action[] = [];

  constructor(readonly filename: string, readonly name: string) {}

  add_action(action: Action) {
    this.actions.push(action);
  }

  add_event(event: When) {
    this.events.push(event);
  }

  available_actions(actor: CrochetValue, state: State) {
    return this.actions.flatMap((x) => x.ready_actions(actor, state));
  }

  available_events(state: State) {
    return this.events.flatMap((x) =>
      x.executions(state).map((e) => _mark(x.full_name, e))
    );
  }
}

export class AnyContext extends Context {
  static instance = new AnyContext();

  available_actions(actor: CrochetValue, state: State) {
    return state.world.all_contexts.flatMap((x) =>
      x.available_actions(actor, state)
    );
  }

  available_events(state: State) {
    return state.world.all_contexts.flatMap((x) => x.available_events(state));
  }
}
