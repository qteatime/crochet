import * as IR from "../../ir";
import { CrochetValue, Machine } from "../../crochet";
import { logger } from "../../utils/logger";
import { unreachable, zip } from "../../utils/utils";
import {
  ActionChoice,
  CrochetActivation,
  CrochetRelation,
  NSEvaluate,
  NSJump,
  ProceduralRelation,
  SimulationSignal,
  SimulationState,
  Tag,
  Universe,
  _done,
  _return,
} from "../intrinsics";
import { Environments, Location, Values } from "../primitives";
import {
  available_actions,
  available_events,
  mark_action_fired,
} from "./contexts";
import { Relation, search, unify_all } from "../logic";
import { Namespace } from "../namespaces";

export function* run_simulation(state: SimulationState) {
  const relations = setup_relations(state);
  state.rounds = 0n;

  while (true) {
    const active = yield* run_turn(state, relations);
    if (!active) {
      break;
    }
    state.rounds += 1n;
  }

  return Values.get_nothing(state.state.universe);
}

function* run_turn(
  state: SimulationState,
  relations: Namespace<CrochetRelation>
) {
  let actions_fired = 0;
  let events_fired = 0;
  state.acted.clear();

  let actor = yield* next_actor(state);
  while (actor != null) {
    state.turn = actor;
    logger.debug(`New turn ${Location.simple_value(actor)}`);
    const action = yield* pick_action(state, actor, relations);
    if (action != null) {
      actions_fired += 1;
      mark_action_fired(action.action, actor);
      logger.debug(`Running action ${action.action.name}`);
      yield new NSEvaluate(action.env, action.action.body);

      const reactions = yield* available_events(
        state.context,
        state.state,
        state.env,
        state.module,
        state.random,
        relations
      );
      for (const reaction of reactions) {
        events_fired += 1;
        yield new NSEvaluate(reaction.env, reaction.event.body);
      }
    }

    state.acted.add(actor);
    const next_turn = yield* next_actor(state);
    const ended = yield* check_goal(
      state,
      actions_fired,
      events_fired,
      next_turn == null
    );
    logger.debug(`Checked goal ${ended}`);
    logger.debug(
      `Next turn ${Location.simple_value(
        next_turn ?? Values.get_nothing(state.state.universe)
      )}`
    );
    if (ended) {
      return false;
    } else {
      actor = next_turn;
    }
  }

  return actions_fired > 0;
}

function* next_actor(state: SimulationState) {
  const remaining = state.actors.filter((x) => !state.acted.has(x));
  if (remaining.length === 0) {
    return null;
  } else {
    return remaining[0];
  }
}

function* pick_action(
  state: SimulationState,
  actor: CrochetValue,
  relations: Namespace<CrochetRelation>
) {
  const actions = yield* available_actions(
    state.context,
    state.state,
    state.env,
    state.module,
    state.random,
    relations,
    actor
  );
  const sorted_actions = actions.sort((a, b) => a.score - b.score);
  const signal = state.signals.try_lookup("pick-action: _ for: _");
  if (signal == null) {
    const choices = sorted_actions.map(
      (x) => [x.score, x] as [number, ActionChoice]
    );
    return state.random.random_weighted_choice(choices);
  } else {
    const choices = sorted_actions.map((x) => make_action_choice(state, x));
    const args = [Values.make_tuple(state.state.universe, choices), actor];
    const choice0 = yield* trigger_signal(state, signal, args);
    if (choice0.tag === Tag.NOTHING) {
      return null;
    } else {
      const choice = Values.get_action_choice(choice0);
      return choice;
    }
  }
}

function make_action_choice(state: SimulationState, choice: ActionChoice) {
  const universe = state.state.universe;
  return Values.make_action_choice(universe, choice);
}

function* trigger_signal(
  state: SimulationState,
  signal: SimulationSignal,
  args: CrochetValue[]
): Machine<CrochetValue> {
  const env = Environments.clone(state.env);
  for (const [k, v] of zip(signal.parameters, args)) {
    env.define(k, v);
  }
  const result = yield new NSJump(
    (parent) =>
      new CrochetActivation(
        parent,
        signal,
        env,
        _return,
        parent.handlers,
        signal.body
      )
  );
  return result;
}

function* check_goal(
  state: SimulationState,
  actions: number,
  events: number,
  round_ended: boolean
) {
  const goal = state.goal;
  switch (goal.tag) {
    case IR.SimulationGoalTag.ACTION_QUIESCENCE:
      return round_ended && actions === 0;

    case IR.SimulationGoalTag.EVENT_QUIESCENCE:
      return round_ended && events === 0;

    case IR.SimulationGoalTag.TOTAL_QUIESCENCE:
      return round_ended && events === 0 && actions === 0;

    case IR.SimulationGoalTag.PREDICATE: {
      const env = Environments.clone(state.env);
      const results = yield* search(
        state.state,
        env,
        state.module,
        state.random,
        state.module.relations,
        goal.predicate
      );
      return results.length !== 0;
    }

    default:
      throw unreachable(goal, `Goal`);
  }
}

function setup_relations(state: SimulationState) {
  return Relation.make_functional_layer(
    state.module,
    new Map([
      [
        "_ simulate-turn",
        new ProceduralRelation((env, [pattern]) => {
          if (state.turn == null) {
            return [];
          } else {
            return unify_all(env, [state.turn], pattern);
          }
        }, null),
      ],
      [
        "_ simulate-rounds-elapsed",
        new ProceduralRelation((env, [pattern]) => {
          const rounds = Values.make_integer(
            state.state.universe,
            state.rounds
          );
          return unify_all(env, [rounds], pattern);
        }, null),
      ],
    ])
  );
}
