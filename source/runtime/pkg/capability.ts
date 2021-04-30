import { string } from "../../utils/spec";
import { difference, intersect } from "../../utils/collections";

export type Capability = string;

export class Capabilities {
  constructor(readonly capabilities: Set<Capability>) {}

  static get all() {
    return new Capabilities(new Set([]));
  }

  static get safe() {
    return new Capabilities(new Set([]));
  }

  allows(capability: Capability) {
    return this.capabilities.has(capability);
  }

  require(set: Set<Capability>) {
    return difference(set, this.capabilities);
  }

  restrict(new_set: Set<Capability>) {
    return new Capabilities(intersect(this.capabilities, new_set));
  }
}

export abstract class CrochetCapability {
  static get spec() {
    return string;
  }
}
