import { anyOf, equal, map_spec } from "../../utils";

export abstract class Target {
  abstract accepts(x: Target): boolean;

  static get spec() {
    return anyOf([CliTarget, WebTarget, AnyTarget]);
  }
}

export class CliTarget extends Target {
  accepts(x: Target) {
    return x instanceof CliTarget;
  }

  static get spec() {
    return map_spec(equal("cli"), (_) => new CliTarget());
  }
}

export class WebTarget extends Target {
  accepts(x: Target) {
    return x instanceof WebTarget;
  }

  static get spec() {
    return map_spec(equal("web"), (_) => new WebTarget());
  }
}

export class AnyTarget extends Target {
  accepts(x: Target) {
    return true;
  }

  static get spec() {
    return map_spec(equal("*"), (_) => new AnyTarget());
  }
}
