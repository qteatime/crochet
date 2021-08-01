import { CrochetValue } from "../../crochet";
import * as IR from "../../ir";
import { XorShift } from "../../utils/xorshift";
import { ErrArbitrary } from "../errors";
import {
  Action,
  ActionChoice,
  Context,
  CrochetContext,
  CrochetModule,
  CrochetRelation,
  Environment,
  Machine,
  NSEvaluate,
  State,
  When,
} from "../intrinsics";
import { search } from "../logic";
import { Namespace } from "../namespaces";
import { Environments, Types, Values } from "../primitives";
import { module_location } from "../primitives/location";

export function lookup_context(module: CrochetModule, name: string | null) {
  if (name == null) {
    return module.pkg.world.global_context;
  }

  const context = module.contexts.try_lookup(name);
  if (context == null) {
    throw new ErrArbitrary(
      "undefined-context",
      `The context ${name} is not accessible from ${module_location(module)}`
    );
  }
  return context;
}

export function define_context(module: CrochetModule, context: CrochetContext) {
  const result = module.pkg.contexts.define(context.name, context);
  if (!result) {
    throw new ErrArbitrary(
      `duplicated-context`,
      `The context ${context.name} already exists in package ${module.pkg.name}`
    );
  }
  return result;
}

export function add_action(
  module: CrochetModule,
  context: Context,
  action: Action
) {
  const result = module.pkg.actions.define(action.name, action);
  if (!result) {
    throw new ErrArbitrary(
      `duplicated-action`,
      `The action ${action.name} already exists in package ${module.pkg.name}`
    );
  }
  context.actions.push(action);
}

export function add_event(context: Context, event: When) {
  context.events.push(event);
}

export function* available_actions(
  context: Context,
  state: State,
  env0: Environment,
  module: CrochetModule,
  random: XorShift,
  relations: Namespace<CrochetRelation>,
  actor: CrochetValue
): Machine<ActionChoice[]> {
  const result: ActionChoice[] = [];

  for (const action of context.actions) {
    if (!Types.fulfills_constraint(action.actor_type, actor.type)) {
      continue;
    }
    const action_value = Values.make_action(action, env0);
    const env = Environments.clone_with_receiver(env0, action_value);
    env.define(action.self_parameter, actor);

    const envs = yield* search(
      state,
      env,
      module,
      random,
      relations,
      action.predicate
    );
    for (const e0 of envs) {
      const e1 = Environments.clone(e0);
      const score0 = yield new NSEvaluate(e1, action.rank_function);
      const score = Values.to_number(score0);
      result.push({
        action: action,
        env: e0,
        score: score,
      });
    }
  }

  return result;
}

export interface EventChoice {
  env: Environment;
  event: When;
}

export function* available_events(
  context: Context,
  state: State,
  env: Environment,
  module: CrochetModule,
  random: XorShift,
  relations: Namespace<CrochetRelation>
): Machine<EventChoice[]> {
  const result: EventChoice[] = [];

  for (const event of context.events) {
    const envs = yield* search(
      state,
      env,
      module,
      random,
      relations,
      event.predicate
    );
    for (const e of envs) {
      result.push({ event: event, env: e });
    }
  }

  return result;
}

export function mark_action_fired(action: Action, actor: CrochetValue) {
  action.fired.add(actor);
}
