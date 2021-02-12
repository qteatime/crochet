import { Module, Operation, Predicate } from "../ir/operations";
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
  constructor(
    readonly module: Module,
    readonly title: string,
    readonly env: Environment,
    readonly predicate: Predicate,
    readonly body: Operation[]
  ) {}
}
