import { anyOf, equal, map_spec } from "../../utils";

export abstract class Target {
  abstract accepts(x: Target): boolean;
  abstract describe(): string;

  static get spec() {
    return anyOf([NodeTarget, BrowserTarget, AnyTarget]);
  }
}

export class NodeTarget extends Target {
  accepts(x: Target) {
    return x instanceof NodeTarget;
  }

  describe() {
    return `node`;
  }

  static get spec() {
    return map_spec(equal("node"), (_) => new NodeTarget());
  }
}

export class BrowserTarget extends Target {
  accepts(x: Target) {
    return x instanceof BrowserTarget;
  }

  describe() {
    return `browser`;
  }

  static get spec() {
    return map_spec(equal("browser"), (_) => new BrowserTarget());
  }
}

export class AnyTarget extends Target {
  accepts(x: Target) {
    return true;
  }

  describe() {
    return `*`;
  }

  static get spec() {
    return map_spec(equal("*"), (_) => new AnyTarget());
  }
}
