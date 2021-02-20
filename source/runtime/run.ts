import { unreachable } from "../utils/utils";
import { bfalse, CrochetStream, CrochetValue } from "./primitives";

// Error types
export type MachineError = ErrUndefinedVariable | ErrVariableAlreadyBound;

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

// Yield types
export type Yield = Push | Mark | Return | Throw;

export class Push {
  readonly tag = "push";
  constructor(readonly machine: Machine) {}
}

export class Mark {
  readonly tag = "mark";
  constructor(readonly name: string, readonly machine: Machine, readonly k: Machine) {}
}

export class Return {
  readonly tag = "return";
  constructor(readonly value: CrochetValue) {}
}

export class Throw {
  readonly tag = "throw";
  constructor(readonly error: MachineError) {}
}

export function _push(machine: Machine) {
  return new Push(machine);
}

export function _mark(name: string, machine: Machine, k: Machine)  {
  return new Mark(name, machine, k);
}

export function _return(v: CrochetValue) {
  return new Return(v);
}

export function _throw(error: MachineError) {
  return new Throw(error);
}

// Frame types
type Frame = FMachine | FContinuation;

class FMachine {
  readonly tag = "machine";
  constructor(readonly machine: Machine) {}
}

class FContinuation {
  readonly tag = "continuation";
  constructor(readonly location: string, readonly k: Machine) {}
}

class FProcedure {
  readonly tag = "procedure";
  constructor(readonly location: string, readonly machine: Machine) {}
}

// Machine execution
export type Machine = AsyncGenerator<Yield, CrochetValue, CrochetValue>;

export async function run(machine0: Machine) {
  const stack: Frame[] = [];
  let machine: Machine = machine0;
  let input: CrochetValue = bfalse;
  
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
          input = bfalse;
          continue;
        }

        case "mark": {
          stack.push(new FContinuation(value.name, value.k));
          machine = value.machine;
          input = bfalse;
          continue;
        }

        case "return": {
          const frame = get_continuation(stack);
          if (frame == null) {
            return value.value;
          } else {
            machine = frame.k;
            input = value.value;
            continue;
          }
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

function get_continuation(frames: Frame[]) {
  while (true) {
    const frame = frames.pop();
    if (frame == null) {
      return null;
    } else if (frame instanceof FContinuation) {
      return frame;
    } else {
      continue;
    }
  }
}

function get_trace(frames: Frame[]) {
  const trace = [];
  let n = 10;
  for (let i = frames.length - 1; i > 0 && n > 0; --i) {
    const frame = frames[i];
    if (frame instanceof FContinuation) {
      trace.push(frame.location);
      n--;
    }
  }
  return trace;
}

function format_error(error: MachineError, trace: string[]) {
  const trace_string = trace.map(x => `  - ${x}`).join("\n");
  return `${error.format()}\n\n${trace_string}`
}

export async function* run_all(machines: Machine[]): Machine {
  const result = [];
  for (const machine of machines) {
    const value = yield _push(machine);
    result.push(value);
  }
  return new CrochetStream(result);
}