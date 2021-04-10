import {
  CrochetPartial,
  CrochetRecord,
  CrochetType,
  CrochetValue,
  Procedure,
  Selection,
  type_name,
} from "../../primitives";

export abstract class MachineError {
  abstract format(): string;

  format_verbose() {
    return this.format();
  }
}

export class ErrUndefinedVariable extends MachineError {
  constructor(readonly name: string) {
    super();
  }

  format() {
    return `undefined-variable: Undefined variable ${this.name}`;
  }
}

export class ErrVariableAlreadyBound extends MachineError {
  constructor(readonly name: string) {
    super();
  }

  format() {
    return `variable-already-bound: The variable ${this.name} is already bound`;
  }
}

export class ErrNoBranchMatched extends MachineError {
  constructor(readonly procedure: Procedure, readonly args: CrochetValue[]) {
    super();
  }

  format() {
    return `no-branch-matched: No branches of ${
      this.procedure.name
    } match the signature (${this.args.map(type_name).join(", ")})`;
  }
}

export class ErrNoConversionAvailable extends MachineError {
  constructor(readonly type: CrochetType, readonly value: CrochetValue) {
    super();
  }

  format() {
    return `no-conversion-available: It's not possible to convert the value of type ${type_name(
      this.value
    )} to ${type_name(this.type)}`;
  }
}

export class ErrNoRecordKey extends MachineError {
  constructor(readonly record: CrochetRecord, readonly key: string) {
    super();
  }

  format() {
    return `no-record-key: The record does not contain a key ${this.key}`;
  }
}

export class ErrIndexOutOfRange extends MachineError {
  constructor(readonly value: CrochetValue, readonly index: any) {
    super();
  }

  format() {
    return `index-out-of-range: The index ${this.index} does not exist in the value`;
  }
}

export class ErrUnexpectedType extends MachineError {
  constructor(readonly type: CrochetType, readonly value: CrochetValue) {
    super();
  }

  format() {
    return `unexpected-type: Expected a value of type ${type_name(
      this.type
    )}, but got a value of type ${type_name(this.value)}`;
  }
}

export class ErrInvalidArity extends MachineError {
  constructor(readonly partial: CrochetPartial, readonly provided: number) {
    super();
  }

  format() {
    return `invalid-arity: ${type_name(this.partial)} requires ${
      this.partial.arity
    } arguments, but was given ${this.provided}`;
  }
}

export class ErrNoProjection extends MachineError {
  constructor(readonly value: CrochetValue) {
    super();
  }

  format() {
    return `no-projection: ${type_name(
      this.value
    )} does not support projection.`;
  }
}

export class ErrNoSelection extends MachineError {
  constructor(readonly value: CrochetValue) {
    super();
  }

  format() {
    return `no-selection: ${type_name(this.value)} does not support selection.`;
  }
}

export class ErrNativeError extends MachineError {
  constructor(readonly error: Error) {
    super();
  }

  format() {
    return `internal: ${this.error.name}: ${this.error.message}`;
  }

  format_verbose() {
    if (this.error.stack != null) {
      return `internal: ${this.error.stack}`;
    } else {
      return this.format();
    }
  }
}
