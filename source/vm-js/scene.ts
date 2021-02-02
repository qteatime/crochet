import { Module, Operation } from "../ir/operations";
import { Environment } from "./environment";

export class Scene {
  constructor(
    readonly module: Module,
    readonly name: string,
    readonly env: Environment,
    readonly body: Operation[]
  ) {}
}
