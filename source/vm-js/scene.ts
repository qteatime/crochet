import { Operation } from "../ir/operations";
import { Environment } from "./environment";

export class Scene {
  constructor(
    readonly name: string,
    readonly env: Environment,
    readonly body: Operation[]
  ) {}
}
