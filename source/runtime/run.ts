import { unreachable } from "../utils/utils";
import {
  bfalse,
  CrochetStream,
  CrochetType,
  CrochetValue,
  type_name,
} from "./primitives";
import { Procedure } from "./primitives/procedure";

// Error types
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

// Yield types
export type Yield = Push | Jump | Mark | Throw;

export class Push {
  readonly tag = "push";
  constructor(readonly machine: Machine) {}
}

export class Jump {
  readonly tag = "jump";
  constructor(readonly machine: Machine) {}
}

export class Mark {
  readonly tag = "mark";
  constructor(
    readonly name: string,
    readonly machine: Machine,
    readonly k: Machine | null
  ) {}
}

export class Throw {
  readonly tag = "throw";
  constructor(readonly error: MachineError) {}
}

export function _push(machine: Machine) {
  return new Push(machine);
}

export function _jump(machine: Machine) {
  return new Jump(machine);
}

export function _mark(
  name: string,
  machine: Machine,
  k: Machine | null = null
) {
  return new Mark(name, machine, k);
}

export function _throw(error: MachineError) {
  return new Throw(error);
}

// Frame types
type Frame = FMachine | FProcedure;

class FMachine {
  readonly tag = "machine";
  constructor(readonly machine: Machine) {}
}

class FProcedure {
  readonly tag = "continuation";
  constructor(readonly location: string, readonly k: Machine) {}
}

// Machine execution
export type Machine = AsyncGenerator<Yield, unknown, unknown>;

export async function run(machine0: Machine) {
  const stack: Frame[] = [];
  let machine: Machine = machine0;
  let input: unknown = null;

  while (true) {
    const result = await machine.next(input);
    // Return
    if (result.done) {
      const newFrame = stack.pop();
      if (newFrame == null) {
        return result.value;
      } else {
        switch (newFrame.tag) {
          case "machine": {
            machine = newFrame.machine;
            input = result.value;
            continue;
          }

          case "continuation": {
            machine = newFrame.k;
            input = result.value;
            continue;
          }

          default:
            throw unreachable(newFrame, "Unknown frame");
        }
      }
      // Yield
    } else {
      const value = result.value;
      switch (value.tag) {
        case "push": {
          stack.push(new FMachine(machine));
          machine = value.machine;
          input = null;
          continue;
        }

        case "jump": {
          let frame: Frame | null = null;
          do {
            frame = stack.pop() ?? null;
          } while (frame != null && !(frame instanceof FProcedure));

          stack.push(new FMachine(machine));
          machine = value.machine;
          input = null;
          continue;
        }

        case "mark": {
          stack.push(new FProcedure(value.name, value.k ?? machine));
          machine = value.machine;
          input = null;
          continue;
        }

        case "throw": {
          const error = value.error;
          const trace = get_trace(stack);
          console.error(format_error(error, trace));
          throw error;
        }

        default:
          throw unreachable(value, "Unknown yield");
      }
    }
  }
}

function get_trace(frames: Frame[]) {
  const trace = [];
  let n = 10;
  for (let i = frames.length - 1; i > 0 && n > 0; --i) {
    const frame = frames[i];
    if (frame instanceof FProcedure) {
      trace.push(frame.location);
      n--;
    }
  }
  return trace;
}

function format_error(error: MachineError, trace: string[]) {
  const trace_string = trace.map((x) => `  - ${x}`).join("\n");
  return `${error.format()}\n\n${trace_string}`;
}

export async function* run_all(machines: Machine[]): Machine {
  const result = [];
  for (const machine of machines) {
    const value = yield _push(machine);
    result.push(value);
  }
  return result;
}

export function cvalue(x: unknown): CrochetValue {
  if (x instanceof CrochetValue) {
    return x;
  } else {
    throw new Error(`internal: expected a crochet value`);
  }
}

export function avalue(x: unknown): CrochetValue[] {
  if (Array.isArray(x) && x.every((z) => z instanceof CrochetValue)) {
    return x;
  } else {
    throw new Error(`internal: expected an array of crochet values`);
  }
}
