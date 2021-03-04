export abstract class Result<A, B> {
  static ok<A, B>(value: A) {
    return new Ok(value);
  }

  static error<A, B>(reason: B) {
    return new Error(reason);
  }

  abstract unwrap(): A | B;
}

export class Ok<A, B> extends Result<A, B> {
  constructor(readonly value: A) {
    super();
  }

  unwrap(): A {
    return this.value;
  }
}

export class Error<A, B> extends Result<A, B> {
  constructor(readonly reason: B) {
    super();
  }

  unwrap(): B {
    throw this.reason;
  }
}
