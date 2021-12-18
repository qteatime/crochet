import * as Package from "../pkg";
import { CrochetForNode } from "./node";

export class CrochetForBench extends CrochetForNode {
  constructor(
    readonly _sdtlib_path: string,
    readonly capabilities: Set<Package.Capability>
  ) {
    super(true, [], capabilities, false, false);
  }

  get stdlib_path() {
    return this._sdtlib_path;
  }

  reseed(seed: number) {
    this.system.universe.random.reseed(seed);
  }
}
