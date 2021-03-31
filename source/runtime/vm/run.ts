import { unreachable } from "../../utils/utils";
import { CrochetValue } from "../primitives";
import { ErrNativeError, MachineError } from "./errors";

// Error types
export class CrochetError {
  constructor(readonly error: MachineError, readonly frames: string[]) {}

  get message() {
    return this.error.format();
  }

  get stack() {
    const trace = this.frames.map((x) => `  - ${x}`).join("\n");
    return `${this.message}\n\nExecution trace:\n${trace}`;
  }
}

// Yield types
export type Yield = Await | Push | Jump | Mark;

export class Push {
  readonly tag = "push";
  constructor(readonly machine: Machine) {}

  evaluate(thread: Thread) {
    thread.save_machine();
    thread.machine = this.machine;
    thread.input = null;
  }
}

export class Jump {
  readonly tag = "jump";
  constructor(readonly machine: Machine) {}

  evaluate(thread: Thread) {
    thread.unwind_to_procedure();
    thread.save_machine();
    thread.machine = this.machine;
    thread.input = null;
  }
}

export class Mark {
  readonly tag = "mark";
  constructor(
    readonly name: string,
    readonly machine: Machine,
    readonly k: Machine | null
  ) {}

  evaluate(thread: Thread) {
    thread.stack.push(new FProcedure(this.name, this.k ?? thread.machine));
    thread.machine = this.machine;
    thread.input = null;
  }
}

export class Await {
  readonly tag = "await";
  constructor(readonly value: Promise<unknown>) {}

  evaluate(thread: Thread) {
    return new SRAwait(this.value, thread);
  }
}

export function _await(value: Promise<unknown>) {
  return new Await(value);
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

// Frame types
type Frame = FMachine | FProcedure;

class FMachine {
  readonly tag = "machine";
  constructor(readonly machine: Machine) {}

  evaluate(value: unknown, thread: Thread) {
    thread.machine = this.machine;
    thread.input = value;
  }
}

class FProcedure {
  readonly tag = "continuation";
  constructor(readonly location: string, readonly k: Machine) {}

  evaluate(value: unknown, thread: Thread) {
    thread.machine = this.k;
    thread.input = value;
  }
}

// Sync return types
type SyncReturn = SRAwait | SRDone;

class SRAwait {
  readonly tag = "await";
  constructor(readonly value: Promise<unknown>, readonly thread: Thread) {}
}

class SRDone {
  readonly tag = "done";
  constructor(readonly value: unknown) {}
}

export class Thread {
  private constructor(
    public stack: Frame[],
    public machine: Machine,
    public input: unknown
  ) {}

  static for_machine(machine: Machine) {
    return new Thread([], machine, null);
  }

  save_machine() {
    this.stack.push(new FMachine(this.machine));
  }

  unwind_to_procedure() {
    let frame: Frame | null = null;
    do {
      frame = this.stack.pop() ?? null;
    } while (frame != null && !(frame instanceof FProcedure));
    return frame;
  }

  run(): SyncReturn {
    try {
      while (true) {
        const result = this.machine.next(this.input);
        if (result.done) {
          const newFrame = this.stack.pop();
          if (newFrame == null) {
            return new SRDone(result.value);
          } else {
            newFrame.evaluate(result.value, this);
          }
        } else {
          const signal = result.value;
          const sr = signal.evaluate(this);
          if (sr != null) {
            return sr;
          }
        }
      }
    } catch (error) {
      if (error instanceof MachineError) {
        const trace = this.stack_trace();
        throw new CrochetError(error, trace);
      } else {
        throw error;
      }
    }
  }

  run_sync(): unknown {
    const result = this.run();
    switch (result.tag) {
      case "done":
        return result.value;
      case "await":
        throw this.die(`The evaluation did not complete synchronously.`);
      default:
        throw unreachable(result, `SyncResult`);
    }
  }

  async run_and_wait(): Promise<unknown> {
    let input = this.input;
    while (true) {
      this.input = input;
      const result = this.run();
      switch (result.tag) {
        case "done": {
          return result.value;
        }
        case "await": {
          input = await result.value;
          continue;
        }
        default:
          throw unreachable(result, `SyncReturn`);
      }
    }
  }

  stack_trace() {
    const trace = [];
    let n = 10;
    for (let i = this.stack.length - 1; i >= 0 && n > 0; --i) {
      const frame = this.stack[i];
      if (frame instanceof FProcedure) {
        trace.push(frame.location);
        n--;
      }
    }
    return trace;
  }

  die(message: string) {
    throw new Error(`${message}\n\n  - ${this.stack_trace().join("\n  -")}`);
  }
}

// Machine execution
export type Machine = Generator<Yield, unknown, unknown>;

export function* run_all(machines: Machine[]): Machine {
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
    throw die(`expected a crochet value`);
  }
}

export function avalue(x: unknown): CrochetValue[] {
  if (Array.isArray(x) && x.every((z) => z instanceof CrochetValue)) {
    return x;
  } else {
    throw die(`expected an array of crochet values`);
  }
}

export function die(x: string): never {
  throw new ErrNativeError(new Error(x));
}
