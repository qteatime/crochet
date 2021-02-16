import {
  Module,
  Operation,
  Predicate,
  SimpleInterpolation,
} from "../ir/operations";
import { Environment } from "./environment";

export class Scene {
  constructor(
    readonly module: Module,
    readonly name: string,
    readonly env: Environment,
    readonly body: Operation[]
  ) {}
}

export class Action {
  public enabled: boolean = true;

  constructor(
    readonly module: Module,
    readonly repeatable: boolean,
    readonly title: SimpleInterpolation,
    readonly tags: Set<string>,
    readonly env: Environment,
    readonly predicate: Predicate,
    readonly body: Operation[]
  ) {}

  disable() {
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
  }
}

export class Hook {
  constructor(
    readonly module: Module,
    readonly env: Environment,
    readonly predicate: Predicate,
    readonly body: Operation[]
  ) {}
}

export class Context {
  constructor(readonly name: string, readonly hooks: Hook[]) {}
}
