import { UnificationEnvironment } from "./unification";

export type Effect = Trivial;

interface IEffect {
  evaluate(env: UnificationEnvironment): UnificationEnvironment | null;
}

export class Trivial implements IEffect {
  evaluate(env: UnificationEnvironment): UnificationEnvironment | null {
    return env;
  }
}