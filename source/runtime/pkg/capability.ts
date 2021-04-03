import { anyOf, difference, equal } from "../../utils";

export type Capability = "native" | "timing" | "reflection" | "html";

export class Capabilities {
  constructor(readonly capabilities: Set<Capability>) {}

  static get all() {
    return new Capabilities(
      new Set(["native", "timing", "reflection", "html"])
    );
  }

  static get safe() {
    return new Capabilities(new Set(["html"]));
  }

  allows(capability: Capability) {
    return this.capabilities.has(capability);
  }

  require(set: Set<Capability>) {
    return difference(this.capabilities, set);
  }

  restrict(new_set: Set<Capability>) {
    const missing = this.require(new_set);
    if (missing.size !== 0) {
      throw new Error(
        `Missing capabilities: ${[...missing.values()].join(", ")}`
      );
    }
    return new Capabilities(new_set);
  }
}

export abstract class CrochetCapability {
  static get spec() {
    return anyOf([
      equal("native" as "native"),
      equal("timing" as "timing"),
      equal("reflection" as "reflection"),
      equal("html" as "html"),
    ]);
  }
}
