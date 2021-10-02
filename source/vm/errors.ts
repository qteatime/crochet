import type { TraceEntry } from "./primitives/stack-trace";

export class CrochetError extends Error {}

export class ErrArbitrary extends CrochetError {
  constructor(readonly tag: string, readonly original_message: string) {
    super(`${tag}: ${original_message}`);
  }
}

export class ErrNativePanic extends CrochetError {
  constructor(
    readonly tag: string,
    readonly original_message: string,
    readonly include_trace = true
  ) {
    super(`${tag}: ${original_message}`);
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
    const include_trace =
      source instanceof ErrNativePanic ? source.include_trace : true;
    const suffix = include_trace
      ? ["\n\n", "Arising from:\n", formatted_trace, "\n", native_trace]
      : [];

    super([source.message, ...suffix].join(""));
    this.source = source;
    this.trace = trace;
  }
}
