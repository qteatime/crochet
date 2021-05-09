import type { TraceEntry } from "./primitives/stack-trace";

export class CrochetError extends Error {}

export class ErrArbitrary extends CrochetError {
  constructor(readonly tag: string, readonly message: string) {
    super(`${tag}: ${message}`);
  }
}

export class ErrNativePanic extends CrochetError {
  constructor(readonly tag: string, readonly message: string) {
    super(`${tag}: ${message}`);
  }
}

export class CrochetEvaluationError extends CrochetError {
  readonly source: Error;
  readonly trace: TraceEntry[];

  constructor(source: Error, trace: TraceEntry[], formatted_trace: string) {
    let native_trace = source instanceof Error ? source.stack ?? "" : "";
    if (native_trace != "") {
      const trace = native_trace.replace(/^.*?\n\s*at /, "");
      native_trace = `\n\nArising from the native code:\n${trace}`;
    }

    super(
      [source.message, "\n\n", "Arising from:\n", formatted_trace, "\n"].join(
        ""
      )
    );
    this.source = source;
    this.trace = trace;
  }
}
