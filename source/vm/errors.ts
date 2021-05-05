import type { TraceEntry } from "./primitives/stack-trace";

export class CrochetError extends Error {}

export class ErrArbitrary extends CrochetError {
  constructor(readonly tag: string, readonly message: string) {
    super(`${tag}: ${message}`);
  }
}

export class CrochetEvaluationError extends CrochetError {
  constructor(
    readonly source: Error,
    readonly trace: TraceEntry[],
    formatted_trace: string
  ) {
    super(
      [source.message, "\n\n", "Arising from:\n", formatted_trace, "\n"].join(
        ""
      )
    );
  }
}
