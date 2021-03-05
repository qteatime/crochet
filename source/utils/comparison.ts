import { lazy } from "./decorators";

export abstract class Comparison {
  abstract to_number(): number;
  abstract if_equals(f: () => Comparison): Comparison;

  @lazy()
  static get less() {
    return new LessThan();
  }

  @lazy()
  static get equals() {
    return new Equals();
  }

  @lazy()
  static get greater() {
    return new GreaterThan();
  }
}

class LessThan extends Comparison {
  to_number() {
    return -1;
  }

  if_equals(f: () => Comparison) {
    return this;
  }
}

class Equals extends Comparison {
  to_number() {
    return 0;
  }

  if_equals(f: () => Comparison) {
    return f();
  }
}

class GreaterThan extends Comparison {
  to_number() {
    return 1;
  }

  if_equals(f: () => Comparison) {
    return this;
  }
}
