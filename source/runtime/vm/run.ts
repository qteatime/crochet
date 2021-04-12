import { logger } from "../../utils";
import { unreachable } from "../../utils/utils";
import { Expression, generated_node, Metadata, Statement } from "../ir";
import { CrochetValue } from "../primitives";
import { ErrNativeError, MachineError } from "./errors/errors";
import type { State } from "./state";

// Error types
export class CrochetError {
  constructor(readonly error: MachineError, readonly trace: StackTrace) {}

  get message() {
    return this.error.format();
  }

  get stack() {
    const message = logger.verbose
      ? this.error.format_verbose()
      : this.error.format();

    return `${message}\n\n${this.trace.format()}`;
  }
}

// Yield types
export abstract class Yield {
  abstract evaluate(thread: Thread): SyncReturn | void;
}

export class Push extends Yield {
  constructor(readonly machine: Machine) {
    super();
  }

  evaluate(thread: Thread) {
    thread.save_machine();
    thread.machine = this.machine;
    thread.input = null;
  }
}

export class Jump extends Yield {
  constructor(readonly machine: Machine) {
    super();
  }

  evaluate(thread: Thread) {
    thread.unwind_to_procedure();
    thread.save_machine();
    thread.machine = this.machine;
    thread.input = null;
  }
}

export class Mark extends Yield {
  constructor(
    readonly name: string,
    readonly machine: Machine,
    readonly k: Machine | null
  ) {
    super();
  }

  evaluate(thread: Thread) {
    thread.stack.push(new FProcedure(this.name, this.k ?? thread.machine));
    thread.machine = this.machine;
    thread.input = null;
  }
}

export class Trace extends Yield {
  constructor(readonly expr: Expression | Statement, readonly state: State) {
    super();
  }

  evaluate(thread: Thread) {
    thread.current = {
      position: this.expr.position,
      filename: this.state.env.module.qualified_name,
    };
  }
}

export class Await extends Yield {
  constructor(readonly value: Promise<unknown>) {
    super();
  }

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

export function _trace(expr: Expression | Statement, state: State) {
  return new Trace(expr, state);
}

export function _mark(
  name: string,
  machine: Machine,
  k: Machine | null = null
) {
  return new Mark(name, machine, k);
}

// Frame types
export abstract class Frame {
  abstract evaluate(value: unknown, thread: Thread): void;
}

class FMachine extends Frame {
  constructor(readonly machine: Machine) {
    super();
  }

  evaluate(value: unknown, thread: Thread) {
    thread.machine = this.machine;
    thread.input = value;
  }
}

class FProcedure extends Frame {
  constructor(readonly location: string, readonly k: Machine) {
    super();
  }

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
    public input: unknown,
    public current: { position: Metadata; filename: string } | null
  ) {}

  static for_machine(machine: Machine) {
    return new Thread([], machine, null, null);
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
    return new StackTrace(this.current, trace);
  }

  die(message: string) {
    throw new Error(`${message}\n\n  - ${this.stack_trace().format()}`);
  }
}

export class StackTrace {
  constructor(
    readonly location: { position: Metadata; filename: string } | null,
    readonly trace: string[]
  ) {}

  format_location() {
    if (this.location == null) {
      return [];
    } else {
      return [
        `In ${this.location.filename} at ${this.location.position.annotated_source}`,
      ];
    }
  }

  format_trace() {
    if (this.trace.length === 0) {
      return [];
    } else {
      return [
        [`Arising from:`, ...this.trace.map((x) => `  - ${x}`)].join("\n"),
      ];
    }
  }

  format() {
    return [...this.format_location(), ...this.format_trace()].join("\n\n");
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
