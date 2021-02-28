import { CrochetType, CrochetValue, Procedure, type_name } from "../primitives";

export type MachineError =
  | ErrUndefinedVariable
  | ErrVariableAlreadyBound
  | ErrNoBranchMatched
  | ErrNoConversionAvailable;

export class ErrUndefinedVariable {
  constructor(readonly name: string) {}

  format() {
    return `undefined-variable: Undefined variable ${this.name}`;
  }
}

export class ErrVariableAlreadyBound {
  constructor(readonly name: string) {}

  format() {
    return `variable-already-bound: The variable ${this.name} is already bound`;
  }
}

export class ErrNoBranchMatched {
  constructor(readonly procedure: Procedure, readonly args: CrochetValue[]) {}

  format() {
    return `no-branch-matched: No branches of ${
      this.procedure.name
    } match the signature (${this.args.map(type_name).join(", ")})`;
  }
}

export class ErrNoConversionAvailable {
  constructor(readonly type: CrochetType, readonly value: CrochetValue) {}

  format() {
    return `no-conversion-available: It's not possible to convert the value of type ${type_name(
      this.value
    )} to ${type_name(this.type)}`;
  }
}
