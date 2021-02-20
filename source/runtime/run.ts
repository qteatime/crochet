import { unreachable } from "../utils/utils";
import { bfalse, CrochetStream, CrochetValue } from "./primitives";

// Yield types
export type Yield = Push | Mark | Return;

export class Push {
  readonly tag = "push";
  constructor(readonly machine: Machine) {}
}

export class Mark {
  readonly tag = "mark";
  constructor(readonly machine: Machine, readonly k: Machine) {}
}

export class Return {
  readonly tag = "return";
  constructor(readonly value: CrochetValue) {}
}

export function _push(machine: Machine) {
  return new Push(machine);
}

export function _mark(machine: Machine, k: Machine)  {
  return new Mark(machine, k);
}

export function _return(v: CrochetValue) {
  return new Return(v);
}

// Frame types
export type Frame = FMachine | FContinuation;

export class FMachine {
  readonly tag = "machine";
  constructor(readonly machine: Machine) {}
}

export class FContinuation {
  readonly tag = "continuation";
  constructor(readonly k: Machine) {}
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
          stack.push(new FContinuation(value.k));
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

export async function* run_all(machines: Machine[]): Machine {
  const result = [];
  for (const machine of machines) {
    const value = yield _push(machine);
    result.push(value);
  }
  return new CrochetStream(result);
}