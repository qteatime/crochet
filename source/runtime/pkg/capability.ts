import { anyOf, difference, equal, intersect } from "../../utils";

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
    return difference(set, this.capabilities);
  }

  restrict(new_set: Set<Capability>) {
    return new Capabilities(intersect(this.capabilities, new_set));
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
